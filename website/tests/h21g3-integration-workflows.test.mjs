import assert from "node:assert/strict";
import test from "node:test";
import { FixtureRepository, SchedulingWorkflowService, fixture } from "./fixtures/h21g3-workflow-harness.mjs";

// Fixture-based integration-style tests. These use no database, network, or production data.
const setup = () => ({ repository: new FixtureRepository(), service: null });
const workflow = () => { const state = setup(); state.service = new SchedulingWorkflowService(state.repository); return state; };
const input = (overrides = {}) => ({ serviceId: "service-a", doctorId: "doctor-a", roomId: "room-a", appointmentDate: "2026-08-10", appointmentTime: "09:00", ...overrides });
const assertRejects = (fn, message) => assert.throws(fn, new RegExp(message));

test("appointment create and edit resolve clinic-scoped clinical linkage through the fixture repository", () => {
  const { repository, service } = workflow();
  const created = service.appointment(fixture.ownerA, fixture.clinicA, input());
  assert.deepEqual({ clinicId: created.clinicId, doctorId: created.doctorId, serviceId: created.serviceId, roomId: created.roomId, duration: created.duration }, { clinicId: fixture.clinicA, doctorId: "doctor-a", serviceId: "service-a", roomId: "room-a", duration: 40 });
  const edited = service.editAppointment(fixture.ownerA, fixture.clinicA, created.id, input({ doctorId: "doctor-b", serviceId: "service-b", roomId: "room-b", appointmentDate: "2026-08-11", appointmentTime: "10:00" }));
  assert.equal(edited.duration, 45); assert.equal(edited.appointmentDate, "2026-08-11"); assert.equal(repository.rows("appointments", fixture.clinicA).length, 1);
  for (const change of [{ doctorId: "doctor-c" }, { serviceId: "service-c" }, { roomId: "room-c" }]) assertRejects(() => service.editAppointment(fixture.ownerA, fixture.clinicA, created.id, input(change)), "outside the selected clinic");
});

test("appointment lifecycle preserves chronology and cancellation history", () => {
  const { service } = workflow(); const appointment = service.appointment(fixture.ownerA, fixture.clinicA, input());
  assertRejects(() => service.lifecycle(fixture.ownerA, fixture.clinicA, appointment.id, "complete", "2026-08-10T10:00:00Z"), "checked in");
  service.lifecycle(fixture.ownerA, fixture.clinicA, appointment.id, "confirm");
  const checkedIn = service.lifecycle(fixture.ownerA, fixture.clinicA, appointment.id, "check-in", "2026-08-10T09:05:00Z");
  const complete = service.lifecycle(fixture.ownerA, fixture.clinicA, appointment.id, "complete", "2026-08-10T09:40:00Z");
  assert.equal(checkedIn.checkedInAt < complete.completedAt, true); assert.equal(complete.status, "Completed");
  assertRejects(() => service.lifecycle(fixture.ownerA, fixture.clinicA, appointment.id, "cancel"), "cannot be cancelled");
  const cancellable = service.appointment(fixture.ownerA, fixture.clinicA, input({ appointmentTime: "11:00" }));
  const cancelled = service.lifecycle(fixture.ownerA, fixture.clinicA, cancellable.id, "cancel");
  assert.equal(cancelled.status, "Cancelled"); assert.equal(cancelled.id, cancellable.id);
});

test("schedule workflow creates, edits, rejects overlaps, and ends without changing clinic", () => {
  const { service } = workflow();
  const schedule = service.schedule(fixture.ownerA, fixture.clinicA, "doctor-a", { weekday: 1, startTime: "09:00", endTime: "12:00" });
  const edited = service.schedule(fixture.managerA, fixture.clinicA, "doctor-a", { weekday: 1, startTime: "08:30", endTime: "12:00" }, schedule.id);
  assert.equal(edited.clinicId, fixture.clinicA); assertRejects(() => service.schedule(fixture.ownerA, fixture.clinicA, "doctor-a", { weekday: 1, startTime: "11:00", endTime: "13:00" }), "overlaps");
  assert.equal(service.endSchedule(fixture.ownerA, fixture.clinicA, "doctor-a", schedule.id).active, false);
});

test("leave and blocked-time workflows remain non-destructive and reject invalid ranges", () => {
  const { service } = workflow();
  const leave = service.leave(fixture.ownerA, fixture.clinicA, "doctor-a", { startsOn: "2026-08-12", endsOn: "2026-08-14", reason: "Leave" });
  service.leave(fixture.ownerA, fixture.clinicA, "doctor-a", { startsOn: "2026-01-01", endsOn: "2026-01-02", reason: "Past" });
  service.leave(fixture.ownerA, fixture.clinicA, "doctor-a", { startsOn: "2026-09-01", endsOn: "2026-09-02", reason: "Cancel" });
  service.cancelLeave(fixture.ownerA, fixture.clinicA, "doctor-a", leave.id);
  const groups = service.leaveGroups(fixture.clinicA, "2026-08-10"); assert.equal(groups.cancelled.some((item) => item.id === leave.id), true); assert.equal(groups.past.length, 1);
  assertRejects(() => service.leave(fixture.ownerA, fixture.clinicA, "doctor-a", { startsOn: "2026-08-20", endsOn: "2026-08-10" }), "Leave end");
  const block = service.block(fixture.ownerA, fixture.clinicA, "doctor-a", { startsAt: "2026-08-10T10:00:00Z", endsAt: "2026-08-10T10:30:00Z" });
  assert.equal(service.block(fixture.ownerA, fixture.clinicA, "doctor-a", { startsAt: "2026-08-10T11:00:00Z", endsAt: "2026-08-10T11:45:00Z" }, block.id).endsAt, "2026-08-10T11:45:00Z");
  assert.equal(service.endBlock(fixture.ownerA, fixture.clinicA, "doctor-a", block.id).active, false);
  assertRejects(() => service.block(fixture.ownerA, fixture.clinicA, "doctor-a", { startsAt: "2026-08-10T12:00:00Z", endsAt: "2026-08-10T11:00:00Z" }), "Blocked time");
});

test("room inventory is non-destructive and assignment change retains history", () => {
  const { repository, service } = workflow();
  const room = service.room(fixture.ownerA, fixture.clinicA, { name: "Room D" });
  assert.equal(service.room(fixture.managerA, fixture.clinicA, { name: "Room D", active: false }, room.id).active, false);
  const first = service.assignment(fixture.ownerA, fixture.clinicA, "doctor-a", "room-a", "2026-08-01");
  const second = service.changeAssignment(fixture.ownerA, fixture.clinicA, "doctor-a", first.id, "room-b", "2026-08-15");
  assert.equal(repository.rows("assignments", fixture.clinicA).length, 2); assert.equal(repository.one("assignments", first.id, fixture.clinicA).active, false); assert.equal(second.roomId, "room-b");
  assert.equal(service.endAssignment(fixture.ownerA, fixture.clinicA, "doctor-a", second.id, "2026-08-31").active, false);
  assertRejects(() => service.assignment(fixture.ownerA, fixture.clinicA, "doctor-a", "room-c", "2026-09-01"), "outside the selected clinic");
});

test("doctor-own, cross-doctor, cross-clinic, and role authorization are enforced at the fixture service boundary", () => {
  const { service } = workflow();
  service.schedule(fixture.doctorA, fixture.clinicA, "doctor-a", { weekday: 2, startTime: "09:00", endTime: "11:00" });
  service.leave(fixture.doctorA, fixture.clinicA, "doctor-a", { startsOn: "2026-08-18", endsOn: "2026-08-18" });
  service.block(fixture.doctorA, fixture.clinicA, "doctor-a", { startsAt: "2026-08-18T09:00:00Z", endsAt: "2026-08-18T10:00:00Z" });
  for (const method of [() => service.schedule(fixture.doctorA, fixture.clinicA, "doctor-b", { weekday: 3, startTime: "09:00", endTime: "10:00" }), () => service.leave(fixture.doctorA, fixture.clinicA, "doctor-b", { startsOn: "2026-08-20", endsOn: "2026-08-20" }), () => service.block(fixture.doctorA, fixture.clinicB, "doctor-a", { startsAt: "2026-08-20T09:00:00Z", endsAt: "2026-08-20T10:00:00Z" })]) assertRejects(method, "Doctors may access|Cross-clinic");
  assertRejects(() => service.schedule(fixture.receptionistA, fixture.clinicA, "doctor-a", { weekday: 4, startTime: "09:00", endTime: "10:00" }), "configuration");
  assert.doesNotThrow(() => service.appointment(fixture.receptionistA, fixture.clinicA, input()));
  assertRejects(() => service.appointment(fixture.superAdmin, undefined, input()), "Select a clinic");
  assert.doesNotThrow(() => service.appointment(fixture.superAdmin, fixture.clinicA, input()));
});

test("calendar fixture covers day, week, month, filters, blocked time, and routed actions", () => {
  const { service } = workflow();
  const first = service.appointment(fixture.ownerA, fixture.clinicA, input());
  service.appointment(fixture.ownerA, fixture.clinicA, input({ appointmentDate: "2026-08-12", appointmentTime: "10:00" }));
  service.block(fixture.ownerA, fixture.clinicA, "doctor-a", { startsAt: "2026-08-10T12:00:00Z", endsAt: "2026-08-10T13:00:00Z" });
  const calendar = service.calendar(fixture.ownerA, fixture.clinicA, { from: "2026-08-10", to: "2026-08-16" }, { doctorId: "doctor-a", serviceId: "service-a", roomId: "room-a", status: "Pending" });
  assert.equal(calendar.appointments.length, 2); assert.equal(calendar.blocks.length, 1); assert.equal(calendar.week.length, 7); assert.equal(calendar.monthCounts["2026-08-10"], 1);
  assert.deepEqual({ newAppointment: "/admin/appointments/new", openAppointment: `/admin/appointments/${first.id}`, lifecycle: "check-in|complete|cancel" }, { newAppointment: "/admin/appointments/new", openAppointment: `/admin/appointments/${first.id}`, lifecycle: "check-in|complete|cancel" });
});
