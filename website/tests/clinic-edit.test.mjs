import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("clinics list exposes an accessible edit action and scopes non-global users", () => {
  const page = read("app/admin/clinics/page.tsx");
  assert.match(page, /Actions/);
  assert.match(page, /Open \/ Edit/);
  assert.match(page, /href=\{`\/admin\/clinics\/\$\{clinic\.id\}`\}/);
  assert.match(page, /canManageDoctorsGlobally\(identity\)/);
  assert.match(page, /query = query\.eq\("id", identity\.clinicId\)/);
  assert.match(page, /min-h-11/);
});

test("edit page preloads only supported clinic fields and preserves system fields", () => {
  const page = read("app/admin/clinics/[id]/page.tsx");
  const form = read("components/admin/ClinicEditForm.tsx");
  assert.match(page, /requireAdminPagePermission\(Permissions\.ClinicUpdate\)/);
  assert.match(page, /!canManageDoctorsGlobally\(authorization\) && id !== authorization\.clinicId/);
  assert.match(form, /Phone number/);
  assert.match(form, /inputMode: "tel"/);
  assert.match(form, /System information/);
  assert.match(form, /Clinic ID/);
  assert.match(form, /Slug/);
  assert.doesNotMatch(form, /name="slug"/);
  assert.doesNotMatch(form, /name="id"/);
  assert.match(page, /clinic_settings/);
  assert.match(page, /normalizeClinicBusinessHours/);
  assert.match(form, /Business Hours/);
  assert.match(form, /BUSINESS_HOUR_DAYS/);
  assert.match(form, /disabled=\{saving \|\| !schedule\.enabled\}/);
  assert.match(form, /Clinic operating hours are stored separately from individual doctor schedules/);
  assert.doesNotMatch(form, /Postal|ZIP/);
});

test("clinic update route is permissioned, clinic-scoped, and mass-assignment safe", () => {
  const route = read("app/api/admin/clinics/[id]/route.ts");
  assert.match(route, /requirePermission\(request, Permissions\.ClinicUpdate\)/);
  assert.match(route, /!canManageDoctorsGlobally\(authorization\) && id !== authorization\.clinicId/);
  assert.match(route, /Invalid clinic identifier/);
  assert.match(route, /const editableFields = \[/);
  assert.match(route, /\.update\(update\)/);
  assert.match(route, /\.eq\("id", id\)/);
  assert.doesNotMatch(route, /\.update\(input\)/);
  assert.doesNotMatch(route, /slug:/);
  assert.doesNotMatch(route, /input\.clinic_id/);
  assert.match(route, /officeHours/);
  assert.match(route, /validateClinicBusinessHours/);
  assert.match(route, /Clinic changes were reverted/);
  assert.match(route, /clinicSnapshot/);
  assert.match(route, /bookingPolicyToPersistence/);
  assert.match(route, /validateClinicBookingPolicy/);
});

test("clinic settings save redirects only after all supported sections succeed", () => {
  const form = read("components/admin/ClinicEditForm.tsx");
  assert.match(form, /router\.replace\("\/admin\/clinics"\)/);
  assert.match(form, /if \(!response\.ok\)/);
  assert.match(form, /router\.push\("\/admin\/clinics"\)/);
  assert.match(form, /if \(saving\) return/);
  assert.match(form, /validateClinicBusinessHours\(hours\)/);
  assert.match(form, /Booking Policy/);
});

test("business-hours contract normalizes stored JSONB and rejects invalid open ranges", () => {
  const hours = read("lib/clinic/models/business-hours.ts");
  assert.match(hours, /normalizeClinicBusinessHours/);
  assert.match(hours, /validateClinicBusinessHours/);
  assert.match(hours, /schedule\.open >= schedule\.close/);
  assert.match(hours, /BUSINESS_HOUR_DAYS/);
  assert.doesNotMatch(hours, /doctor_schedules/);
});

test("existing Add Clinic flow remains present and separately permissioned", () => {
  const route = read("app/api/admin/clinics/route.ts");
  const wizard = read("app/admin/clinics/new/NewClinicWizard.tsx");
  assert.match(route, /requirePermission\(request, Permissions\.ClinicUpdate\)/);
  assert.match(wizard, /fetch\("\/api\/admin\/clinics"/);
});
