import { NextRequest, NextResponse } from "next/server";

import { validateClinicOnboarding, normalizeClinicSlug, type ClinicOnboardingPayload } from "@/lib/clinic/onboarding-contract";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import { assertOwnerOnboardingReady, OwnerOnboardingError, startOwnerOnboarding } from "@/lib/clinic/owner-onboarding";

export async function POST(request: NextRequest) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ message: "Invalid clinic request." }, { status: 400 });
  const input = body as ClinicOnboardingPayload;
  const validationError = validateClinicOnboarding(input);
  if (validationError) return NextResponse.json({ message: validationError }, { status: 400 });

  try {
    await assertOwnerOnboardingReady(input.ownerAccount);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Owner onboarding is unavailable." }, { status: error instanceof OwnerOnboardingError ? 503 : 500 });
  }

  const slug = normalizeClinicSlug(input.slug);
  const { data, error } = await supabaseServer.rpc("create_clinic_with_settings", {
    p_name: input.name.trim(), p_slug: slug, p_email: input.email.trim().toLowerCase(),
    p_phone: input.phone.trim(), p_website: input.website.trim() || null,
    p_address: [input.addressLine1, input.addressLine2, input.city, input.state, input.postalCode].filter(Boolean).join(", "),
    p_city: input.city.trim(), p_state: input.state.trim(), p_country: input.country.trim(), p_timezone: input.timezone.trim(),
    p_greeting: input.aiSettings.greeting.trim() || `Welcome to ${input.name.trim()}.`,
    p_office_hours: input.businessHours, p_voice: input.aiSettings.voice, p_language: input.aiSettings.language,
    p_scheduling_rules: { aiEnabled: input.aiSettings.enabled, appointmentBooking: input.aiSettings.appointmentBooking, appointmentCancellation: input.aiSettings.appointmentCancellation, appointmentRescheduling: input.aiSettings.appointmentRescheduling, humanHandoff: input.aiSettings.humanHandoff, afterHoursMode: input.aiSettings.afterHoursMode, transcriptStorage: input.aiSettings.transcriptStorage, callRecording: input.aiSettings.callRecording },
    p_emergency_rules: { escalationPhone: input.emergencyPhone?.trim() || null, afterHoursMode: input.aiSettings.afterHoursMode },
  });

  if (error) {
    const duplicate = error.code === "23505";
    return NextResponse.json({ message: duplicate ? "A clinic with this slug already exists." : "Unable to create clinic." }, { status: duplicate ? 409 : 500 });
  }
  const clinic = Array.isArray(data) ? data[0] : data;
  if (!clinic?.id) return NextResponse.json({ message: "Clinic was created without an identifier. Administrator recovery is required." }, { status: 500 });
  try {
    const onboarding = await startOwnerOnboarding(clinic.id, input.ownerAccount);
    const partial = onboarding.status === "failed";
    return NextResponse.json({ id: clinic.id, slug, onboarding: { status: onboarding.status, failureCode: onboarding.failure_code } }, { status: partial ? 202 : 201 });
  } catch (error) {
    return NextResponse.json({ id: clinic.id, slug, onboarding: { status: "failed" }, message: error instanceof Error ? error.message : "Clinic created but owner onboarding requires administrator recovery." }, { status: 202 });
  }
}
