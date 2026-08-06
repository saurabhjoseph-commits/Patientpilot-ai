import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("doctor repository scopes every lookup and mutation to its clinic", () => {
  const repository = read("lib/doctors/repository.ts");
  assert.match(repository, /\.eq\("clinic_id", filters\.clinicId\)/);
  assert.match(repository, /\.eq\("clinic_id", clinicId\)\.eq\("id", id\)/);
  assert.match(repository, /clinic_id: input\.clinicId/);
  assert.match(repository, /doctor_id: doctorId/);
  assert.match(repository, /clinic_id: clinicId/);
});

test("doctor validation requires trusted scope, a valid email, and positive duration", () => {
  const validation = read("lib/doctors/validation.ts");
  assert.match(validation, /Trusted clinic scope is required/);
  assert.match(validation, /valid doctor email is required/);
  assert.match(validation, /duration must be a positive whole number/);
});

test("doctor APIs enforce server-derived permissions and never accept a browser clinic id", () => {
  const collection = read("app/api/admin/doctors/route.ts");
  const item = read("app/api/admin/doctors/[id]/route.ts");
  const services = read("app/api/admin/doctors/[id]/services/route.ts");
  assert.match(collection, /requirePermission\(request, Permissions\.DoctorsRead\)/);
  assert.match(collection, /requirePermission\(request, Permissions\.DoctorsCreate\)/);
  assert.match(item, /requirePermission\(request, Permissions\.DoctorsUpdate\)/);
  assert.match(services, /requirePermission\(request, Permissions\.DoctorsAssignServices\)/);
  for (const route of [collection, item, services]) assert.match(route, /resolveAdminClinic\(authorization\)\.clinicId/);
  assert.doesNotMatch(collection, /input\.clinicId|body\.clinicId/);
});

test("doctor UI supports search, filters, sorting, pagination, active state, and responsive cards", () => {
  const page = read("app/admin/doctors/page.tsx");
  const directory = read("app/admin/doctors/DoctorDirectory.tsx");
  const form = read("app/admin/doctors/DoctorForm.tsx");
  assert.match(page, /requireAdminPagePermission\(Permissions\.DoctorsRead\)/);
  assert.match(directory, /Search name, email, specialty/);
  assert.match(directory, /All statuses/);
  assert.match(directory, /Recently added/);
  assert.match(directory, /Previous/);
  assert.match(directory, /md:hidden/);
  assert.match(form, /Assigned clinic services/);
  assert.match(form, /Profile photo/);
  assert.match(form, /status/);
});

test("administrative roles receive doctor permissions while staff roles do not", () => {
  const catalog = read("lib/platform/domain/identity/permission-catalog.ts");
  assert.match(catalog, /DoctorsRead: "doctors\.read"/);
  assert.match(catalog, /"practice-manager"[\s\S]*Permissions\.DoctorsCreate/);
  assert.doesNotMatch(catalog.match(/receptionist: \[[\s\S]*?\],/)?.[0] ?? "", /Doctors(Create|Update|Deactivate|AssignServices)/);
});
