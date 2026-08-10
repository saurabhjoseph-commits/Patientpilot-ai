import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("schedule workspace wires prefilled schedule edit and conflict-safe API update", () => {
  const panel = read("components/admin/DoctorSchedulingPanel.tsx");
  const api = read("app/api/admin/doctors/[id]/schedule/[scheduleId]/route.ts");
  const repository = read("lib/scheduling/repository.ts");
  assert.match(panel, /kind: "schedule"/);
  assert.match(panel, /ScheduleForm/);
  assert.match(panel, /editing\.kind === "schedule" \? "schedule"/);
  assert.match(panel, /\$\{route\}\/\$\{editing\.entry\.id\}/);
  assert.match(api, /updateSchedule/);
  assert.match(repository, /assertScheduleDoesNotOverlap/);
});

test("leave edit preserves history and groups upcoming, past, and cancelled records", () => {
  const panel = read("components/admin/DoctorSchedulingPanel.tsx");
  assert.match(panel, /upcoming:/);
  assert.match(panel, /past:/);
  assert.match(panel, /cancelled:/);
  assert.match(panel, /LeaveGroup/);
  assert.match(panel, /editing\.kind === "leave" \? "leave"/);
  assert.match(panel, /endLabel="Cancel"/);
});

test("blocked-time edit uses existing guarded update endpoint", () => {
  const panel = read("components/admin/DoctorSchedulingPanel.tsx");
  const api = read("app/api/admin/doctors/[id]/blocked-time/[blockId]/route.ts");
  assert.match(panel, /kind: "block"/);
  assert.match(panel, /BlockForm/);
  assert.match(api, /resolveSchedulingDoctor/);
  assert.match(api, /updateBlockedTime/);
});

test("room assignments support change, end, current state, and history", () => {
  const panel = read("components/admin/DoctorSchedulingPanel.tsx");
  const api = read("app/api/admin/doctors/[id]/room-assignments/[assignmentId]/route.ts");
  assert.match(panel, /Current assignment/);
  assert.match(panel, /Assignment history/);
  assert.match(panel, /AssignmentForm/);
  assert.match(api, /updateRoomAssignment/);
  assert.match(api, /endRoomAssignment/);
});

test("room inventory exposes clinic-scoped current doctor assignments", () => {
  const page = read("app/admin/rooms/page.tsx");
  const manager = read("components/admin/RoomsManager.tsx");
  const repository = read("lib/scheduling/repository.ts");
  assert.match(page, /roomAssignmentsForClinic/);
  assert.match(repository, /\.eq\("clinic_id", clinicId\)/);
  assert.match(manager, /Current assignments/);
  assert.match(manager, /doctorName/);
});

test("doctor-own and cross-clinic authorization remains server authoritative", () => {
  const authorization = read("lib/scheduling/authorization.ts");
  const page = read("app/admin/doctors/[id]/schedule/page.tsx");
  assert.match(authorization, /identity\.doctorId !== requestedDoctorId/);
  assert.match(authorization, /Cross-clinic access is not permitted/);
  assert.match(page, /resolveDoctorIdentity/);
  assert.match(page, /clinicId=\{canManageDoctorsGlobally\(user\) \? clinicId : undefined\}/);
});
