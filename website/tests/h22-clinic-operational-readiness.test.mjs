import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("booking policy is clinic-specific, constrained, and maps persistence fields", () => {
  const policy = read("lib/clinic/booking-policy.ts");
  assert.match(policy, /minimumBookingNoticeMinutes/);
  assert.match(policy, /maximumBookingHorizonDays/);
  assert.match(policy, /slotIntervalMinutes/);
  assert.match(policy, /10080/);
  assert.match(policy, /730/);
  assert.match(policy, /multiple of 5 minutes/);
  assert.match(policy, /minimum_booking_notice_minutes/);
  assert.doesNotMatch(policy, /60 \/ 30 \/ 15/);
});

test("clinic settings preload and update the approved booking-policy columns", () => {
  const page = read("app/admin/clinics/[id]/page.tsx");
  const form = read("components/admin/ClinicEditForm.tsx");
  const route = read("app/api/admin/clinics/[id]/route.ts");
  assert.match(page, /minimum_booking_notice_minutes/);
  assert.match(page, /bookingPolicyFromPersistence/);
  assert.match(form, /Booking Policy/);
  assert.match(form, /parsedBookingPolicy/);
  assert.match(route, /validateClinicBookingPolicy/);
  assert.match(route, /bookingPolicyToPersistence/);
  assert.match(route, /Permissions\.ClinicUpdate/);
});

test("readiness is server-side, clinic-scoped, fail-closed, and checks every H3 prerequisite", () => {
  const readiness = read("lib/clinic/operational-readiness.ts");
  const page = read("app/admin/clinics/[id]/page.tsx");
  const card = read("components/admin/ClinicOperationalReadiness.tsx");
  assert.match(readiness, /import "server-only"/);
  for (const key of ["timezone", "office-hours", "booking-policy", "services", "doctors", "doctor-services", "schedules", "rooms", "room-assignments", "appointment-linkage"]) assert.match(readiness, new RegExp(`item\\("${key}"`));
  assert.match(readiness, /h3Ready: readyCount === required\.length/);
  assert.match(readiness, /!appointmentsResult\.error/);
  assert.match(readiness, /\.eq\("clinic_id", clinicId\)/);
  assert.match(page, /getClinicOperationalReadiness/);
  assert.match(card, /AI Booking Setup/);
  assert.match(card, /Configure/);
  assert.doesNotMatch(readiness, /window\./);
});

test("service management derives clinic context server-side and protects mutations", () => {
  const route = read("app/api/admin/services/route.ts");
  const page = read("app/admin/services/page.tsx");
  const manager = read("components/admin/ServicesManager.tsx");
  assert.match(route, /requirePermission\(request, Permissions\.ClinicUpdate\)/);
  assert.match(route, /resolveDoctorClinic\(authorization/);
  assert.match(route, /default_duration_minutes/);
  assert.match(route, /positive whole number/);
  assert.match(route, /\.eq\("clinic_id", clinicId\)/);
  assert.match(page, /requireAdminPagePermission\(Permissions\.ClinicUpdate\)/);
  assert.match(page, /Select a clinic/);
  assert.match(manager, /Default duration \(minutes\)/);
  assert.match(manager, /Deactivate/);
});

test("existing doctor service assignment and authoritative duration resolution remain in place", () => {
  const repository = read("lib/doctors/repository.ts");
  const linkage = read("lib/appointments/clinical-linkage.ts");
  assert.match(repository, /One or more selected services do not belong to this clinic/);
  assert.match(repository, /custom_duration_minutes/);
  assert.match(linkage, /assignment\.custom_duration_minutes \?\? durationMinutes/);
  assert.match(linkage, /default_duration_minutes/);
  assert.match(linkage, /browser payload must not override/);
});
