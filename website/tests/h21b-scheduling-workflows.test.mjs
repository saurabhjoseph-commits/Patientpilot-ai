import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("H2.1B uses existing scheduling tables for non-destructive workflow mutations", () => {
  const repository = read("lib/scheduling/repository.ts");
  const service = read("lib/scheduling/service.ts");
  assert.match(repository, /updateSchedule[\s\S]*deactivateSchedule/);
  assert.match(repository, /updateLeave[\s\S]*cancelLeave/);
  assert.match(repository, /addBlockedTime[\s\S]*cancelBlockedTime/);
  assert.match(repository, /addRoomAssignment[\s\S]*endRoomAssignment/);
  assert.match(repository, /assertRoomInClinic/);
  assert.match(service, /validateSchedule[\s\S]*validateLeave[\s\S]*validateBlock[\s\S]*validateRoomAssignment/);
});

test("H2.1B routes derive doctor identity and clinic scope on the server", () => {
  const authorization = read("lib/scheduling/authorization.ts");
  const schedule = read("app/api/admin/doctors/[id]/schedule/route.ts");
  const leave = read("app/api/admin/doctors/[id]/leave/route.ts");
  const blocked = read("app/api/admin/doctors/[id]/blocked-time/route.ts");
  assert.match(authorization, /resolveDoctorIdentity/);
  assert.match(authorization, /identity\.doctorId !== requestedDoctorId/);
  assert.match(schedule, /resolveSchedulingDoctor/);
  assert.match(leave, /resolveSchedulingDoctor/);
  assert.match(blocked, /resolveSchedulingDoctor/);
  assert.doesNotMatch(schedule, /body\.clinicId/);
});

test("calendar contracts support responsive agenda-first day, week, and month views", () => {
  const calendar = read("app/admin/calendar/page.tsx");
  assert.match(calendar, /<option value="day">Day<\/option>/);
  assert.match(calendar, /<option value="week">Week<\/option>/);
  assert.match(calendar, /<option value="month">Month<\/option>/);
  assert.match(calendar, /doctorId/);
  assert.match(calendar, /serviceId/);
  assert.match(calendar, /roomId/);
  assert.match(calendar, /blockedTime/);
});

test("appointment lifecycle actions keep chronology and linkage validation server-side", () => {
  const service = read("lib/appointments/service.ts");
  const route = read("app/api/appointments/[id]/route.ts");
  assert.match(service, /resolveClinicalLinkage/);
  assert.match(service, /must be checked in before it can be completed/);
  assert.match(route, /action === "check-in"/);
  assert.match(route, /action === "complete"/);
  assert.match(route, /Invalid appointment identifier/);
});
