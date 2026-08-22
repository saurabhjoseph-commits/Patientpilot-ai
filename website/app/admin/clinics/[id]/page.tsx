import { notFound } from "next/navigation";

import ClinicEditForm from "@/components/admin/ClinicEditForm";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import { normalizeClinicBusinessHours } from "@/lib/clinic/models/business-hours";
import { bookingPolicyFromPersistence } from "@/lib/clinic/booking-policy";
import { getClinicOperationalReadiness } from "@/lib/clinic/operational-readiness";
import ClinicOperationalReadiness from "@/components/admin/ClinicOperationalReadiness";
import OwnerOnboardingCard from "@/components/admin/OwnerOnboardingCard";
import { getOwnerOnboarding, isOwnerOnboardingAvailable } from "@/lib/clinic/owner-onboarding";
import ClinicDangerZone from "@/components/admin/ClinicDangerZone";

export default async function ClinicPage({ params }: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdminPagePermission(Permissions.ClinicUpdate);
  const { id } = await params;

  if (!canManageDoctorsGlobally(authorization) && id !== authorization.clinicId) {
    notFound();
  }

  const [{ data, error }, settingsResult, readiness, onboarding, onboardingAvailable] = await Promise.all([
    supabaseServer
    .from("clinics")
    .select("id,name,email,phone,website,address,city,state,country,timezone,slug,created_at")
    .eq("id", id)
    .maybeSingle(),
    supabaseServer
      .from("clinic_settings")
      .select("office_hours,minimum_booking_notice_minutes,maximum_booking_horizon_days,slot_interval_minutes,greeting,language,voice,scheduling_rules,emergency_rules")
      .eq("clinic_id", id)
      .maybeSingle(),
    getClinicOperationalReadiness(id),
    getOwnerOnboarding(id),
    isOwnerOnboardingAvailable(),
  ]);

  if (error) throw new Error("Unable to load clinic.");
  if (!data) notFound();

  const settings = settingsResult.error
    ? (await supabaseServer.from("clinic_settings").select("office_hours").eq("clinic_id", id).maybeSingle()).data
    : settingsResult.data;
  const settingsRow = (settings ?? {}) as { office_hours?: unknown; minimum_booking_notice_minutes?: unknown; maximum_booking_horizon_days?: unknown; slot_interval_minutes?: unknown; greeting?: unknown; language?: unknown; voice?: unknown; scheduling_rules?: unknown; emergency_rules?: unknown };

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clinic settings</h1>
        <p className="text-sm text-muted-foreground">Manage clinic identity and operational information.</p>
      </div>
      <ClinicOperationalReadiness readiness={readiness} />
      <OwnerOnboardingCard clinicId={id} clinicName={data.name} onboarding={onboarding} canUpdate={authorization.permissionCodes.includes(Permissions.ClinicUpdate)} canReset={canManageDoctorsGlobally(authorization)} available={onboardingAvailable} />
      <ClinicEditForm
        clinic={data}
        officeHours={normalizeClinicBusinessHours(settingsRow.office_hours)}
        bookingPolicy={bookingPolicyFromPersistence(settingsRow)}
        policyAvailable={!settingsResult.error}
        aiSettings={{ greeting: typeof settingsRow.greeting === "string" ? settingsRow.greeting : `Welcome to ${data.name}.`, language: typeof settingsRow.language === "string" ? settingsRow.language : "english", voice: typeof settingsRow.voice === "string" ? settingsRow.voice : "alloy", schedulingRules: settingsRow.scheduling_rules, emergencyRules: settingsRow.emergency_rules }}
      />
      <ClinicDangerZone clinicId={id} clinicName={data.name} canDelete={canManageDoctorsGlobally(authorization)} />
    </main>
  );
}
