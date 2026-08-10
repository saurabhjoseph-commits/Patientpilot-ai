import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("owner onboarding reset is super-admin confirmed and never relinks an identity", () => {
  const route = read("app/api/admin/clinics/[id]/owner-onboarding/reset/route.ts");
  const onboarding = read("lib/clinic/owner-onboarding.ts");
  assert.match(route, /canManageDoctorsGlobally/);
  assert.match(route, /confirmation !== clinic\.name/);
  assert.match(onboarding, /resetOwnerOnboarding/);
  assert.match(onboarding, /profile\.clinic_id !== clinicId/);
  assert.doesNotMatch(onboarding, /auth\.admin\.deleteUser/);
});

test("clinic deletion is confirmed, super-admin-only, and blocked by protected ownership", () => {
  const route = read("app/api/admin/clinics/[id]/route.ts");
  const safety = read("lib/clinic/deletion-safety.ts");
  assert.match(route, /Only a super administrator can permanently delete a clinic/);
  assert.match(route, /confirmation !== clinic\.name/);
  assert.match(route, /blockingClinicDependencies/);
  for (const table of ["profiles", "doctors", "appointments", "contacts", "calls", "clinic_owner_onboarding", "doctor_room_assignments"]) assert.match(safety, new RegExp(`count\\(\\"${table}\\"`));
  assert.match(route, /status: 409/);
});

test("successful deletion sends only a post-delete safe transactional notification", () => {
  const route = read("app/api/admin/clinics/[id]/route.ts");
  const email = read("lib/clinic/deletion-notification.ts");
  assert.match(route, /captureClinicDeletionRecipient/);
  assert.match(route, /from\("clinics"\)\.delete/);
  assert.match(route, /createDeletionNotification/);
  assert.match(route, /deliverDeletionNotification/);
  assert.ok(route.indexOf('from("clinics").delete') < route.lastIndexOf("deliverDeletionNotification"));
  assert.match(email, /Your PatientPilot AI Clinic Account Has Been Deleted/);
  assert.match(email, /support@patientpilotai\.com/);
  assert.match(email, /recipient\.clinicName/);
  assert.doesNotMatch(email, /patient data|appointment data|token_hash|password/i);
});

test("rejected or failed deletion cannot send a deletion email and notification retry cannot recreate a clinic", () => {
  const route = read("app/api/admin/clinics/[id]/route.ts");
  const retry = read("app/api/admin/clinic-deletion-notifications/[id]/retry/route.ts");
  const email = read("lib/clinic/deletion-notification.ts");
  assert.ok(route.indexOf("if (dependencies.length)") < route.lastIndexOf("deliverDeletionNotification"));
  assert.match(email, /status: "failed"/);
  assert.match(retry, /eq\("status", "failed"\)/);
  assert.doesNotMatch(retry, /from\("clinics"\)\.(insert|upsert|update)/);
});

test("doctor status changes preserve history while deletion remains dependency-free and global-only", () => {
  const route = read("app/api/admin/doctors/[id]/route.ts");
  const safety = read("lib/doctors/deletion-safety.ts");
  assert.match(route, /Permissions\.DoctorsDeactivate/);
  assert.match(route, /Only a super administrator can permanently delete a doctor/);
  assert.match(route, /protectedDoctorDependencies/);
  for (const table of ["appointments", "doctor_services", "doctor_schedules", "doctor_leave", "blocked_time", "doctor_room_assignments"]) assert.match(safety, new RegExp(`count\\(\\"${table}\\"`));
  assert.match(route, /status: 409/);
});

test("destructive controls use server paths and do not record secrets", () => {
  const clinic = read("components/admin/ClinicDangerZone.tsx");
  const doctor = read("components/admin/DoctorAdministrationControls.tsx");
  assert.match(clinic, /confirmation !== clinicName/);
  assert.match(doctor, /confirmation !== fullName/);
  assert.doesNotMatch(`${clinic}\n${doctor}`, /token|password|console\./i);
});
