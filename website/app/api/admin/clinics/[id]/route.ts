import { NextRequest, NextResponse } from "next/server";

import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import { normalizeClinicBusinessHours, validateClinicBusinessHours } from "@/lib/clinic/models/business-hours";
import { bookingPolicyToPersistence, type ClinicBookingPolicy, validateClinicBookingPolicy } from "@/lib/clinic/booking-policy";
import { blockingClinicDependencies, clinicDependencyCounts } from "@/lib/clinic/deletion-safety";
import { captureClinicDeletionRecipient, createDeletionNotification, deliverDeletionNotification } from "@/lib/clinic/deletion-notification";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const editableFields = [
  "email",
  "phone",
  "website",
  "address",
  "city",
  "state",
  "country",
  "timezone",
] as const;

type EditableField = (typeof editableFields)[number];
type ClinicUpdate = { name: string } & Partial<Record<EditableField, string | null | undefined>>;

function optionalText(input: Record<string, unknown>, field: EditableField): string | null | undefined {
  const value = input[field];
  if (typeof value !== "string") return undefined;
  return value.trim() || null;
}

function clinicSnapshot(clinic: Record<string, unknown>): ClinicUpdate {
  return {
    name: String(clinic.name ?? ""),
    ...Object.fromEntries(editableFields.map((field) => [field, typeof clinic[field] === "string" ? clinic[field] : null])),
  } as ClinicUpdate;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;

  const { id } = await params;
  if (!UUID.test(id)) {
    return NextResponse.json({ message: "Invalid clinic identifier." }, { status: 400 });
  }

  if (!canManageDoctorsGlobally(authorization) && id !== authorization.clinicId) {
    return NextResponse.json({ message: "Cross-clinic updates are not permitted." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ message: "Invalid clinic update." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) {
    return NextResponse.json({ message: "Clinic name is required." }, { status: 400 });
  }

  const update: ClinicUpdate = {
    name,
    ...Object.fromEntries(editableFields.map((field) => [field, optionalText(input, field)])),
  };

  const hasOfficeHours = Object.prototype.hasOwnProperty.call(input, "officeHours");
  const officeHours = hasOfficeHours ? normalizeClinicBusinessHours(input.officeHours) : null;
  const hoursError = officeHours ? validateClinicBusinessHours(officeHours) : null;
  if (hoursError) return NextResponse.json({ message: hoursError }, { status: 400 });
  const hasBookingPolicy = Object.prototype.hasOwnProperty.call(input, "bookingPolicy");
  const bookingPolicy = hasBookingPolicy ? input.bookingPolicy as ClinicBookingPolicy : null;
  const bookingPolicyError = hasBookingPolicy ? validateClinicBookingPolicy(bookingPolicy) : null;
  if (bookingPolicyError) return NextResponse.json({ message: bookingPolicyError }, { status: 400 });

  const { data: existing, error: existingError } = await supabaseServer
    .from("clinics")
    .select("name,email,phone,website,address,city,state,country,timezone")
    .eq("id", id)
    .maybeSingle();
  if (existingError || !existing) return NextResponse.json({ message: "Clinic was not found." }, { status: 404 });

  const shouldUpdateSettings = hasOfficeHours || hasBookingPolicy;
  const { data: existingSettings, error: existingSettingsError } = shouldUpdateSettings
    ? await supabaseServer.from("clinic_settings").select("office_hours").eq("clinic_id", id).maybeSingle()
    : { data: null, error: null };
  if (existingSettingsError) return NextResponse.json({ message: "Unable to load clinic settings." }, { status: 500 });

  const { data, error } = await supabaseServer
    .from("clinics")
    .update(update)
    .eq("id", id)
    .select("id,name,email,phone,website,address,city,state,country,timezone,slug,created_at,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ message: "Unable to update clinic." }, { status: 400 });
  }

  if (shouldUpdateSettings) {
    const settingsUpdate = {
      ...(officeHours ? { office_hours: officeHours } : {}),
      ...(bookingPolicy ? bookingPolicyToPersistence(bookingPolicy) : {}),
    };
    const settingsResult = existingSettings
      ? await supabaseServer.from("clinic_settings").update(settingsUpdate).eq("clinic_id", id)
      : await supabaseServer.from("clinic_settings").insert({ clinic_id: id, ...settingsUpdate });
    if (settingsResult.error) {
      const rollback = await supabaseServer.from("clinics").update(clinicSnapshot(existing as Record<string, unknown>)).eq("id", id);
      if (rollback.error) return NextResponse.json({ message: "Clinic settings update failed and requires administrator review." }, { status: 500 });
      return NextResponse.json({ message: "Unable to update clinic settings. Clinic changes were reverted." }, { status: 500 });
    }
  }

  return NextResponse.json({ clinic: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  if (!canManageDoctorsGlobally(authorization)) return NextResponse.json({ message: "Only a super administrator can permanently delete a clinic." }, { status: 403 });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ message: "Invalid clinic identifier." }, { status: 400 });
  const body = await request.json().catch(() => null);
  const { data: clinic, error } = await supabaseServer.from("clinics").select("id,name").eq("id", id).maybeSingle();
  if (error || !clinic) return NextResponse.json({ message: "Clinic was not found." }, { status: 404 });
  if (!body || typeof body !== "object" || (body as Record<string, unknown>).confirmation !== clinic.name) return NextResponse.json({ message: "Type the clinic name to confirm permanent deletion." }, { status: 400 });
  try {
    const dependencies = blockingClinicDependencies(await clinicDependencyCounts(id, clinic.name));
    if (dependencies.length) return NextResponse.json({ message: `Clinic cannot be deleted while protected data exists: ${dependencies.join(", ")}. The verified schema has no archive state.`, dependencies }, { status: 409 });
    const recipient = await captureClinicDeletionRecipient(id, clinic.name);
    const { error: deleteError } = await supabaseServer.from("clinics").delete().eq("id", id);
    if (deleteError) return NextResponse.json({ message: "Clinic deletion was refused by the database." }, { status: 409 });
    const notification = await createDeletionNotification(recipient);
    const notificationDelivered = notification ? await deliverDeletionNotification(notification) : false;
    return NextResponse.json({ deleted: true, notification: notification ? (notificationDelivered ? "sent" : "failed") : "unavailable" });
  } catch (failure) { return NextResponse.json({ message: failure instanceof Error ? failure.message : "Unable to verify clinic deletion safety." }, { status: 500 }); }
}
