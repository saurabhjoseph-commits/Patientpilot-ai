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
  assert.doesNotMatch(route, /clinic_id:/);
});

test("existing Add Clinic flow remains present and separately permissioned", () => {
  const route = read("app/api/admin/clinics/route.ts");
  const wizard = read("app/admin/clinics/new/NewClinicWizard.tsx");
  assert.match(route, /requirePermission\(request, Permissions\.ClinicUpdate\)/);
  assert.match(wizard, /fetch\("\/api\/admin\/clinics"/);
});
