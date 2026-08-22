import "server-only";

import type { AIContext } from "./types";
import { supabaseServer } from "@/lib/supabase-server";
import { normalizeClinicLanguageMode } from "@/lib/platform/domain/clinic-language";

export class ClinicReceptionistConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClinicReceptionistConfigurationError";
  }
}

/** Loads only trusted, clinic-scoped prompt context after telephony verification. */
export async function getClinicReceptionistContext(clinicId: string): Promise<AIContext> {
  const [clinicResult, settingsResult, serviceResult, doctorResult] = await Promise.all([
    supabaseServer.from("clinics").select("name,timezone,country").eq("id", clinicId).maybeSingle(),
    supabaseServer.from("clinic_settings").select("office_hours,language").eq("clinic_id", clinicId).maybeSingle(),
    supabaseServer.from("clinic_services").select("name").eq("clinic_id", clinicId).eq("active", true).order("name"),
    supabaseServer.from("doctors").select("full_name").eq("clinic_id", clinicId).eq("status", "active").order("full_name"),
  ]);
  if (clinicResult.error || settingsResult.error || serviceResult.error || doctorResult.error || !clinicResult.data?.name || !clinicResult.data.timezone) {
    throw new ClinicReceptionistConfigurationError("Clinic receptionist configuration is unavailable.");
  }
  return {
    clinicId,
    clinicName: clinicResult.data.name,
    country: clinicResult.data.country ?? undefined,
    languageMode: normalizeClinicLanguageMode(settingsResult.data?.language, clinicResult.data.country ?? undefined),
    timezone: clinicResult.data.timezone,
    officeHours: formatOfficeHours(settingsResult.data?.office_hours),
    providers: (doctorResult.data ?? []).map((doctor) => doctor.full_name),
    acceptedInsurance: [],
    appointmentTypes: (serviceResult.data ?? []).map((service) => service.name),
  };
}

function formatOfficeHours(value: unknown): string {
  return value && typeof value === "object" && !Array.isArray(value) ? JSON.stringify(value) : "Please ask clinic staff for office hours.";
}
