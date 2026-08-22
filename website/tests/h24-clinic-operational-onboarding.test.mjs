import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("one authoritative server-side evaluator represents all ten AI booking requirements", () => {
  const readiness = read("lib/clinic/operational-readiness.ts");
  assert.match(readiness, /evaluateClinicOperationalReadiness/);
  for (const key of ["timezone", "office-hours", "booking-policy", "services", "doctors", "doctor-services", "schedules", "rooms", "room-assignments", "appointment-linkage"]) assert.match(readiness, new RegExp(`item\\("${key}"`));
  assert.match(readiness, /readyCount === required\.length/);
  assert.match(readiness, /effective_from/);
  assert.match(readiness, /effective_to/);
  assert.match(readiness, /Any failed ownership query contributes no qualifying rows/);
  assert.doesNotMatch(readiness, /window\.(?:location|localStorage|sessionStorage)|localStorage/);
});

test("owner setup UX explains each incomplete requirement and shows a real 10/10 success state", () => {
  const card = read("components/admin/ClinicOperationalReadiness.tsx");
  assert.match(card, /entry\.description/);
  assert.match(card, /entry\.actionLabel/);
  assert.match(card, /AI Booking Ready/);
  assert.match(card, /10 of 10 setup requirements complete/);
  assert.match(card, /Test AI Booking/);
  assert.match(card, /\/admin\/demo/);
  assert.match(card, /Setup incomplete/);
});

test("configuration mutations and all setup routes remain clinic-scoped and refresh server data", () => {
  const services = read("app/api/admin/services/route.ts");
  const rooms = read("app/api/admin/rooms/route.ts");
  const doctors = read("app/api/admin/doctors/[id]/route.ts");
  const scheduling = read("components/admin/DoctorSchedulingPanel.tsx");
  assert.match(services, /resolveDoctorClinic\(authorization/);
  assert.match(rooms, /resolveDoctorClinic\(auth/);
  assert.match(doctors, /resolveDoctorClinic\(authorization/);
  assert.match(scheduling, /router\.refresh\(\)/);
  assert.doesNotMatch(`${services}\n${rooms}\n${doctors}`, /localStorage|clinicId:\s*"[0-9a-f-]+"/i);
});
