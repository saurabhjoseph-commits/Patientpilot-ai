import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function engine() {
  const source = readFileSync(new URL("../lib/scheduling/availability.ts", import.meta.url), "utf8").replace('import "server-only";', "");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

const base = (overrides = {}) => ({ clinicReady: true, timezone: "Asia/Kolkata", date: "2026-08-16", startTime: "09:00", serviceId: "service-a", durationMinutes: 30, intervalMinutes: 15, minimumNoticeMinutes: 0, maximumHorizonDays: 30, officeHours: { sunday: { enabled: true, open: "09:00", close: "17:00" } }, doctors: [{ id: "doctor-a", active: true }], assignments: [{ doctorId: "doctor-a", serviceId: "service-a", active: true, durationMinutes: 30 }], schedules: [{ doctorId: "doctor-a", weekday: 0, start: "09:00", end: "17:00", active: true }], leave: [], blocks: [], rooms: [{ id: "room-a", active: true }, { id: "room-b", active: true }], roomAssignments: [{ doctorId: "doctor-a", roomId: "room-a", active: true }, { doctorId: "doctor-a", roomId: "room-b", active: true }], appointments: [], now: new Date("2026-08-15T00:00:00.000Z"), ...overrides });

test("H3.1 exact slot, slot interval, business hours, schedule, and alternatives are authoritative", async () => {
  const { checkSlotAvailability, getAvailableSlots } = await engine();
  assert.equal(checkSlotAvailability(base()).available, true);
  assert.equal(checkSlotAvailability(base({ startTime: "16:45", durationMinutes: 30 })).reason, "CLINIC_CLOSED");
  assert.equal(checkSlotAvailability(base({ startTime: "10:00", schedules: [{ doctorId: "doctor-a", weekday: 0, start: "11:00", end: "17:00", active: true }] })).reason, "DOCTOR_NOT_SCHEDULED");
  const slots = getAvailableSlots(base(), "09:00", 3).slots;
  assert.deepEqual(slots.map((slot) => slot.startTime), ["09:00", "09:15", "09:30"]);
});

test("H3.1 subtracts leave, blocks, conflicts, accepts back-to-back, and selects a free alternative room", async () => {
  const { checkSlotAvailability } = await engine();
  assert.equal(checkSlotAvailability(base({ leave: [{ doctorId: "doctor-a", startsOn: "2026-08-16", endsOn: "2026-08-16", active: true }] })).available, false);
  assert.equal(checkSlotAvailability(base({ blocks: [{ doctorId: "doctor-a", startsAt: "2026-08-16T09:15:00", endsAt: "2026-08-16T10:00:00", active: true }] })).available, false);
  assert.equal(checkSlotAvailability(base({ appointments: [{ id: "existing", doctorId: "doctor-a", roomId: "room-a", date: "2026-08-16", time: "09:00", durationMinutes: 30, status: "Confirmed" }] })).reason, "DOCTOR_CONFLICT");
  assert.equal(checkSlotAvailability(base({ startTime: "09:30", appointments: [{ id: "existing", doctorId: "doctor-a", roomId: "room-a", date: "2026-08-16", time: "09:00", durationMinutes: 30, status: "Confirmed" }] })).available, true);
  assert.equal(checkSlotAvailability(base({ appointments: [{ id: "existing", doctorId: "doctor-a", roomId: "room-a", date: "2026-08-16", time: "09:00", durationMinutes: 30, status: "Cancelled" }] })).available, true);
  const alternateRoom = checkSlotAvailability(base({ doctorId: "doctor-b", doctors: [{ id: "doctor-b", active: true }], assignments: [{ doctorId: "doctor-b", serviceId: "service-a", active: true }], schedules: [{ doctorId: "doctor-b", weekday: 0, start: "09:00", end: "17:00", active: true }], roomAssignments: [{ doctorId: "doctor-b", roomId: "room-a", active: true }, { doctorId: "doctor-b", roomId: "room-b", active: true }], appointments: [{ id: "room-conflict", doctorId: "doctor-a", roomId: "room-a", date: "2026-08-16", time: "09:00", durationMinutes: 30, status: "Confirmed" }] }));
  assert.equal(alternateRoom.available, true); assert.equal(alternateRoom.slots[0].roomId, "room-b");
});

test("H3.1 enforces readiness, policy boundaries, self-exclusion, and DST-valid timezone calculations", async () => {
  const { checkSlotAvailability } = await engine();
  assert.equal(checkSlotAvailability(base({ clinicReady: false })).reason, "CLINIC_NOT_READY");
  assert.equal(checkSlotAvailability(base({ minimumNoticeMinutes: 600, now: new Date("2026-08-16T02:00:00.000Z") })).reason, "MINIMUM_NOTICE");
  assert.equal(checkSlotAvailability(base({ maximumHorizonDays: 1, date: "2026-08-20" })).reason, "OUTSIDE_BOOKING_HORIZON");
  const self = { id: "self", doctorId: "doctor-a", roomId: "room-a", date: "2026-08-16", time: "09:00", durationMinutes: 30, status: "Confirmed" };
  assert.equal(checkSlotAvailability(base({ appointments: [self], excludeAppointmentId: "self" })).available, true);
  assert.equal(checkSlotAvailability(base({ timezone: "America/New_York", date: "2026-11-01", officeHours: { sunday: { enabled: true, open: "09:00", close: "17:00" } }, now: new Date("2026-10-31T12:00:00.000Z") })).available, true);
});

test("H3.1 application boundary has one database-backed authority and rechecks before persistence", () => {
  const service = readFileSync(new URL("../lib/appointments/service.ts", import.meta.url), "utf8");
  const authority = readFileSync(new URL("../lib/scheduling/availability-service.ts", import.meta.url), "utf8");
  const ai = readFileSync(new URL("../lib/appointments/integration.ts", import.meta.url), "utf8");
  assert.match(service, /checkAuthoritativeSlot/); assert.match(service, /await assertAvailable/);
  assert.match(authority, /Promise\.all/); assert.match(authority, /getClinicOperationalReadiness/); assert.match(authority, /eq\("clinic_id", request\.clinicId\)/);
  assert.match(ai, /createAppointmentService/);
});

test("H3.1 review-only concurrency guard uses the verified contract and safe conflict boundary", () => {
  const migration = readFileSync(new URL("../lib/supabase/migrations/0023_h31_appointment_overlap_guard_review.sql", import.meta.url), "utf8");
  const repository = readFileSync(new URL("../lib/appointments/repository.ts", import.meta.url), "utf8");
  const errors = readFileSync(new URL("../lib/appointments/errors.ts", import.meta.url), "utf8");
  const route = readFileSync(new URL("../app/api/appointments/route.ts", import.meta.url), "utf8");
  assert.match(migration, /appointment_date.*text/); assert.match(migration, /appointment_time.*text/); assert.match(migration, /duration_minutes.*integer/);
  assert.match(migration, /status not in \('Cancelled', 'Completed'\)/); assert.match(migration, /pg_advisory_xact_lock/); assert.match(migration, /order by key/);
  assert.match(migration, /existing\.id is distinct from new\.id/); assert.match(migration, /existing\.appointment_time::time < new\.appointment_time::time/);
  assert.match(migration, /appointments_clinic_doctor_date_idx/); assert.match(migration, /appointments_clinic_room_date_idx/);
  assert.match(repository, /mapAppointmentPersistenceError/); assert.match(errors, /APPOINTMENT_SLOT_CONFLICT/); assert.match(route, /status: 409/);
});

test("H3.1 SQL never places procedural IF directly after a transaction BEGIN", () => {
  const preflight = readFileSync(new URL("../docs/database-audit/h31-staging-overlap-preflight.sql", import.meta.url), "utf8");
  const migration = readFileSync(new URL("../lib/supabase/migrations/0023_h31_appointment_overlap_guard_review.sql", import.meta.url), "utf8");
  const verification = readFileSync(new URL("../docs/database-audit/h31-staging-post-migration-verification.sql", import.meta.url), "utf8");
  for (const sql of [preflight, migration, verification]) assert.doesNotMatch(sql, /\bbegin;\s*(?:--[^\n]*\n\s*)*if\b/i);
  assert.match(preflight, /do \$\$\s*begin[\s\S]*?if to_regclass/s); assert.match(preflight, /with capacity as/);
  assert.match(migration, /begin;\s*do \$\$/s); assert.doesNotMatch(verification, /\b(do|begin|if|raise)\b/i);
});

test("H3.1C reconciliation documentation tracks the application scheduling contract without creating replacement schema", () => {
  const audit = readFileSync(new URL("../docs/database-audit/h31-staging-schema-drift-audit.sql", import.meta.url), "utf8");
  const preflight = readFileSync(new URL("../docs/database-audit/h31-staging-reconciliation-data-preflight.sql", import.meta.url), "utf8");
  const verification = readFileSync(new URL("../docs/database-audit/h31-staging-reconciliation-verification.sql", import.meta.url), "utf8");
  const runbook = readFileSync(new URL("../docs/database-audit/H31_STAGING_SCHEMA_RECONCILIATION.md", import.meta.url), "utf8");
  for (const table of ["clinic_services", "doctors", "doctor_services", "doctor_schedules", "doctor_leave", "blocked_time", "clinic_rooms", "doctor_room_assignments", "appointments"]) assert.match(audit, new RegExp(table));
  assert.doesNotMatch(audit, /\b(create|alter|drop|insert|update|delete)\b/i); assert.doesNotMatch(preflight, /\b(create|alter|drop|insert|update|delete)\b/i); assert.doesNotMatch(verification, /\b(create|alter|drop|insert|update|delete)\b/i);
  assert.match(runbook, /0017_g2_clinic_services\.sql/); assert.match(runbook, /0020a_h21_doctor_profile_role_reconciliation\.sql/); assert.match(runbook, /0023_h31_appointment_overlap_guard_review\.sql/);
});
