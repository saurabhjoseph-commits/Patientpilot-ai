import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FixtureRepository, SchedulingWorkflowService, fixture } from "./fixtures/h21g3-workflow-harness.mjs";

// Fixture-based integration-style tests. They use no database, network, or production data.
const workflow = () => new SchedulingWorkflowService(new FixtureRepository());
const input = (overrides = {}) => ({ patientName: "Test Patient", phone: "+15555550100", email: "test@example.invalid", serviceId: "service-a", doctorId: "doctor-a", roomId: "room-a", appointmentDate: "2026-08-10", appointmentTime: "09:30", source: "Admin", notes: "Fixture-only booking", ...overrides });
const rejects = (operation, message) => assert.throws(operation, new RegExp(message));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("ready-clinic fixture completes create, duration, edit, lifecycle, calendar, and historical retention", () => {
  const service = workflow();
  const appointment = service.appointment(fixture.ownerA, fixture.clinicA, input());
  assert.deepEqual({ clinicId: appointment.clinicId, duration: appointment.duration, doctorId: appointment.doctorId, serviceId: appointment.serviceId, roomId: appointment.roomId }, { clinicId: fixture.clinicA, duration: 40, doctorId: "doctor-a", serviceId: "service-a", roomId: "room-a" });
  const fallbackDuration = service.appointment(fixture.ownerA, fixture.clinicA, input({ doctorId: "doctor-b", serviceId: "service-b", roomId: "room-b", appointmentTime: "10:30" }));
  assert.equal(fallbackDuration.duration, 45);
  const edited = service.editAppointment(fixture.ownerA, fixture.clinicA, appointment.id, input({ doctorId: "doctor-b", serviceId: "service-b", roomId: "room-b", appointmentDate: "2026-08-11", appointmentTime: "10:00", notes: "Rescheduled fixture booking" }));
  assert.equal(edited.duration, 45); assert.equal(edited.notes, "Rescheduled fixture booking");
  rejects(() => service.lifecycle(fixture.ownerA, fixture.clinicA, edited.id, "complete", "2026-08-11T10:30:00Z"), "checked in");
  service.lifecycle(fixture.ownerA, fixture.clinicA, edited.id, "confirm", "");
  rejects(() => service.lifecycle(fixture.ownerA, fixture.clinicA, edited.id, "confirm", ""), "cannot be confirmed");
  const checkedIn = service.lifecycle(fixture.ownerA, fixture.clinicA, edited.id, "check-in", "2026-08-11T10:05:00Z");
  rejects(() => service.lifecycle(fixture.ownerA, fixture.clinicA, edited.id, "complete", "2026-08-11T10:00:00Z"), "cannot precede");
  const completed = service.lifecycle(fixture.ownerA, fixture.clinicA, edited.id, "complete", "2026-08-11T10:30:00Z");
  assert.ok(completed.completedAt >= checkedIn.checkedInAt);
  const calendar = service.calendar(fixture.ownerA, fixture.clinicA, { from: "2026-08-10", to: "2026-08-16" }, { doctorId: "doctor-b", serviceId: "service-b", roomId: "room-b", status: "Completed" });
  assert.equal(calendar.appointments.length, 1); assert.equal(calendar.week[1].appointments[0].id, edited.id); assert.equal(calendar.monthCounts["2026-08-11"], 1);
  const cancelled = service.appointment(fixture.ownerA, fixture.clinicA, input({ appointmentTime: "11:00" }));
  assert.equal(service.lifecycle(fixture.ownerA, fixture.clinicA, cancelled.id, "cancel", "").id, cancelled.id);
  assert.equal(service.calendar(fixture.ownerA, fixture.clinicA, { from: "2026-08-10", to: "2026-08-10" }, { status: "Cancelled" }).appointments[0].id, cancelled.id);
});

test("fixture rejects cross-clinic or invalid clinical linkage and retains tenant/doctor boundaries", () => {
  const service = workflow();
  for (const change of [{ doctorId: "doctor-c" }, { serviceId: "service-c" }, { roomId: "room-c" }, { doctorId: "doctor-b", serviceId: "service-a", roomId: "room-b" }]) rejects(() => service.appointment(fixture.ownerA, fixture.clinicA, input(change)), "outside the selected clinic|not assigned");
  const own = service.appointment(fixture.doctorA, fixture.clinicA, input());
  assert.equal(service.calendar(fixture.doctorA, fixture.clinicA, { from: "2026-08-10", to: "2026-08-10" }, { doctorId: "doctor-a" }).appointments[0].id, own.id);
  rejects(() => service.calendar(fixture.doctorA, fixture.clinicB, { from: "2026-08-10", to: "2026-08-10" }), "Cross-clinic");
  rejects(() => service.appointment(fixture.receptionistA, fixture.clinicB, input()), "Cross-clinic");
});

test("production appointment boundary preserves native date/time, trusted linkage, lifecycle, detail, and responsive calendar contracts", () => {
  const validation = read("lib/appointments/validation.ts");
  const linkage = read("lib/appointments/clinical-linkage.ts");
  const service = read("lib/appointments/service.ts");
  const route = read("app/api/appointments/route.ts");
  const detail = read("app/admin/appointments/[id]/page.tsx");
  const calendar = read("app/admin/calendar/page.tsx");
  assert.match(validation, /NATIVE_TIME_REGEX/); assert.match(validation, /isCalendarDate/);
  assert.match(linkage, /doctor_room_assignments/); assert.match(linkage, /Selected doctor is not currently assigned to this room/);
  assert.match(route, /resolveAdminClinic\(authorization\)\.clinicId/);
  assert.match(service, /must be checked in before it can be completed/); assert.match(service, /cannot be confirmed/); assert.match(service, /cannot be cancelled/);
  for (const label of ["Patient", "Contact", "Service", "Doctor", "Room", "Date and time", "Duration", "Source", "Status", "Checked in", "Completed", "Notes"]) assert.match(detail, new RegExp(`label="${label}"`));
  assert.match(detail, /sm:grid-cols-2/); assert.match(calendar, /md:hidden/); assert.match(calendar, /doctorIdentity\?\.doctorId/); assert.match(calendar, /status.*doctorId.*serviceId.*roomId/s);
});
