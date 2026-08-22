/**
 * H2.1G3 fixture-based integration harness.
 *
 * This is deliberately an in-memory repository/service boundary: it never
 * opens a Supabase connection and must not be described as database E2E.
 */
export const fixture = Object.freeze({
  clinicA: "clinic-a", clinicB: "clinic-b",
  ownerA: { role: "owner", clinicId: "clinic-a" },
  managerA: { role: "manager", clinicId: "clinic-a" },
  receptionistA: { role: "receptionist", clinicId: "clinic-a" },
  doctorA: { role: "doctor", clinicId: "clinic-a", doctorId: "doctor-a" },
  doctorB: { role: "doctor", clinicId: "clinic-a", doctorId: "doctor-b" },
  doctorC: { role: "doctor", clinicId: "clinic-b", doctorId: "doctor-c" },
  superAdmin: { role: "super-admin" },
});

const copy = (row) => ({ ...row });
const active = (row) => row.active !== false;

export class FixtureRepository {
  constructor() {
    this.sequence = 1;
    this.tables = {
      doctors: [
        { id: "doctor-a", clinicId: fixture.clinicA, name: "Dr A", active: true },
        { id: "doctor-b", clinicId: fixture.clinicA, name: "Dr B", active: true },
        { id: "doctor-c", clinicId: fixture.clinicB, name: "Dr C", active: true },
      ],
      services: [
        { id: "service-a", clinicId: fixture.clinicA, name: "Exam", duration: 30 },
        { id: "service-b", clinicId: fixture.clinicA, name: "Cleaning", duration: 45 },
        { id: "service-c", clinicId: fixture.clinicB, name: "Clinic B Exam", duration: 60 },
      ],
      doctorServices: [
        { doctorId: "doctor-a", serviceId: "service-a", clinicId: fixture.clinicA, duration: 40 },
        { doctorId: "doctor-b", serviceId: "service-b", clinicId: fixture.clinicA, duration: null },
        { doctorId: "doctor-c", serviceId: "service-c", clinicId: fixture.clinicB, duration: null },
      ],
      rooms: [
        { id: "room-a", clinicId: fixture.clinicA, name: "Room A", active: true },
        { id: "room-b", clinicId: fixture.clinicA, name: "Room B", active: true },
        { id: "room-c", clinicId: fixture.clinicB, name: "Room C", active: true },
      ],
      appointments: [], schedules: [], leaves: [], blocks: [], assignments: [],
      appointmentRoomAssignments: [
        { doctorId: "doctor-a", roomId: "room-a", clinicId: fixture.clinicA, effectiveFrom: "2026-01-01", effectiveTo: null, active: true },
        { doctorId: "doctor-b", roomId: "room-b", clinicId: fixture.clinicA, effectiveFrom: "2026-01-01", effectiveTo: null, active: true },
        { doctorId: "doctor-c", roomId: "room-c", clinicId: fixture.clinicB, effectiveFrom: "2026-01-01", effectiveTo: null, active: true },
      ],
    };
  }

  id(prefix) { return `${prefix}-${this.sequence++}`; }
  rows(table, clinicId) { return this.tables[table].filter((row) => row.clinicId === clinicId).map(copy); }
  one(table, id, clinicId) {
    const row = this.tables[table].find((item) => item.id === id && item.clinicId === clinicId);
    if (!row) throw new Error(`${table} record is outside the selected clinic.`);
    return row;
  }
  insert(table, row) { const saved = { id: this.id(table), ...row }; this.tables[table].push(saved); return copy(saved); }
  update(table, id, clinicId, changes) { const row = this.one(table, id, clinicId); Object.assign(row, changes); return copy(row); }
}

export class SchedulingWorkflowService {
  constructor(repository) { this.repository = repository; }

  scope(principal, requestedClinicId, capability) {
    if (principal.role === "super-admin") {
      if (!requestedClinicId) throw new Error("Select a clinic before managing scheduling.");
      return requestedClinicId;
    }
    if (!principal.clinicId || (requestedClinicId && requestedClinicId !== principal.clinicId)) throw new Error("Cross-clinic access is not permitted.");
    if (principal.role === "receptionist" && capability !== "appointments" && capability !== "calendar") throw new Error("Scheduling configuration is not permitted.");
    return principal.clinicId;
  }

  assertDoctor(principal, doctorId, clinicId) {
    this.repository.one("doctors", doctorId, clinicId);
    if (principal.role === "doctor" && principal.doctorId !== doctorId) throw new Error("Doctors may access only their own schedule.");
  }

  appointment(principal, requestedClinicId, input) {
    const clinicId = this.scope(principal, requestedClinicId, "appointments");
    const service = this.repository.one("services", input.serviceId, clinicId);
    const doctor = this.repository.one("doctors", input.doctorId, clinicId);
    if (!doctor.active) throw new Error("Selected doctor is inactive.");
    const assignment = this.repository.tables.doctorServices.find((row) => row.clinicId === clinicId && row.doctorId === input.doctorId && row.serviceId === input.serviceId);
    if (!assignment) throw new Error("Selected doctor is not assigned to this service.");
    const room = this.repository.one("rooms", input.roomId, clinicId);
    if (!room.active) throw new Error("Selected room is inactive.");
    const roomAssignment = this.repository.tables.appointmentRoomAssignments.find((row) => row.clinicId === clinicId && row.doctorId === doctor.id && row.roomId === room.id && row.active && row.effectiveFrom <= input.appointmentDate && (!row.effectiveTo || row.effectiveTo >= input.appointmentDate));
    if (!roomAssignment) throw new Error("Selected doctor is not currently assigned to this room.");
    return this.repository.insert("appointments", { clinicId, patientId: "patient-a", patientName: input.patientName ?? "Fixture Patient", phone: input.phone ?? "+15555550100", email: input.email ?? null, appointmentDate: input.appointmentDate, appointmentTime: input.appointmentTime, doctorId: doctor.id, serviceId: service.id, roomId: room.id, duration: assignment.duration ?? service.duration, source: input.source ?? "Admin", notes: input.notes ?? null, status: "Pending", checkedInAt: null, completedAt: null });
  }

  editAppointment(principal, requestedClinicId, id, changes) {
    const clinicId = this.scope(principal, requestedClinicId, "appointments");
    const existing = this.repository.one("appointments", id, clinicId);
    const merged = { ...existing, ...changes };
    const resolved = this.appointment(principal, clinicId, merged);
    this.repository.tables.appointments = this.repository.tables.appointments.filter((row) => row.id !== resolved.id);
    return this.repository.update("appointments", id, clinicId, { patientName: resolved.patientName, phone: resolved.phone, email: resolved.email, appointmentDate: resolved.appointmentDate, appointmentTime: resolved.appointmentTime, doctorId: resolved.doctorId, serviceId: resolved.serviceId, roomId: resolved.roomId, duration: resolved.duration, source: resolved.source, notes: resolved.notes });
  }

  lifecycle(principal, requestedClinicId, id, action, timestamp) {
    const clinicId = this.scope(principal, requestedClinicId, "appointments");
    const appointment = this.repository.one("appointments", id, clinicId);
    if (action === "confirm") {
      if (appointment.status === "Confirmed" || appointment.status === "Cancelled" || appointment.completedAt) throw new Error("This appointment cannot be confirmed.");
      return this.repository.update("appointments", id, clinicId, { status: "Confirmed" });
    }
    if (action === "check-in") {
      if (appointment.status === "Cancelled" || appointment.checkedInAt) throw new Error("This appointment cannot be checked in.");
      return this.repository.update("appointments", id, clinicId, { status: "Checked In", checkedInAt: timestamp });
    }
    if (action === "complete") {
      if (!appointment.checkedInAt || appointment.status === "Cancelled") throw new Error("An appointment must be checked in before it can be completed.");
      if (timestamp < appointment.checkedInAt) throw new Error("Completion cannot precede check-in.");
      return this.repository.update("appointments", id, clinicId, { status: "Completed", completedAt: timestamp });
    }
    if (appointment.status === "Cancelled" || appointment.completedAt) throw new Error("This appointment cannot be cancelled.");
    return this.repository.update("appointments", id, clinicId, { status: "Cancelled" });
  }

  schedule(principal, requestedClinicId, doctorId, input, id) {
    const clinicId = this.scope(principal, requestedClinicId, "schedule"); this.assertDoctor(principal, doctorId, clinicId);
    if (!/^\d{2}:\d{2}$/.test(input.startTime) || input.startTime >= input.endTime) throw new Error("Schedule start time must be before end time.");
    const conflict = this.repository.rows("schedules", clinicId).some((row) => row.id !== id && active(row) && row.doctorId === doctorId && row.weekday === input.weekday && input.startTime < row.endTime && row.startTime < input.endTime);
    if (conflict) throw new Error("Schedule overlaps an existing working period.");
    const row = { clinicId, doctorId, ...input, active: true };
    return id ? this.repository.update("schedules", id, clinicId, row) : this.repository.insert("schedules", row);
  }
  endSchedule(principal, requestedClinicId, doctorId, id) { const clinicId = this.scope(principal, requestedClinicId, "schedule"); this.assertDoctor(principal, doctorId, clinicId); return this.repository.update("schedules", id, clinicId, { active: false }); }

  leave(principal, requestedClinicId, doctorId, input, id) {
    const clinicId = this.scope(principal, requestedClinicId, "leave"); this.assertDoctor(principal, doctorId, clinicId);
    if (!input.startsOn || !input.endsOn || input.startsOn > input.endsOn) throw new Error("Leave end date must be on or after the start date.");
    const row = { clinicId, doctorId, ...input, active: true };
    return id ? this.repository.update("leaves", id, clinicId, row) : this.repository.insert("leaves", row);
  }
  cancelLeave(principal, requestedClinicId, doctorId, id) { const clinicId = this.scope(principal, requestedClinicId, "leave"); this.assertDoctor(principal, doctorId, clinicId); return this.repository.update("leaves", id, clinicId, { active: false }); }
  leaveGroups(clinicId, today) { const rows = this.repository.rows("leaves", clinicId); return { upcoming: rows.filter((row) => active(row) && row.endsOn >= today), past: rows.filter((row) => active(row) && row.endsOn < today), cancelled: rows.filter((row) => !active(row)) }; }

  block(principal, requestedClinicId, doctorId, input, id) {
    const clinicId = this.scope(principal, requestedClinicId, "block"); this.assertDoctor(principal, doctorId, clinicId);
    if (!input.startsAt || !input.endsAt || new Date(input.startsAt) >= new Date(input.endsAt)) throw new Error("Blocked time must end after it starts.");
    const row = { clinicId, doctorId, ...input, active: true };
    return id ? this.repository.update("blocks", id, clinicId, row) : this.repository.insert("blocks", row);
  }
  endBlock(principal, requestedClinicId, doctorId, id) { const clinicId = this.scope(principal, requestedClinicId, "block"); this.assertDoctor(principal, doctorId, clinicId); return this.repository.update("blocks", id, clinicId, { active: false }); }

  room(principal, requestedClinicId, input, id) {
    const clinicId = this.scope(principal, requestedClinicId, "room");
    if (!input.name?.trim()) throw new Error("Room name is required.");
    return id ? this.repository.update("rooms", id, clinicId, input) : this.repository.insert("rooms", { clinicId, active: true, ...input });
  }
  assignment(principal, requestedClinicId, doctorId, roomId, effectiveFrom) {
    const clinicId = this.scope(principal, requestedClinicId, "assignment"); this.assertDoctor(principal, doctorId, clinicId); this.repository.one("rooms", roomId, clinicId);
    return this.repository.insert("assignments", { clinicId, doctorId, roomId, effectiveFrom, effectiveTo: null, active: true });
  }
  changeAssignment(principal, requestedClinicId, doctorId, id, roomId, effectiveFrom) {
    const clinicId = this.scope(principal, requestedClinicId, "assignment"); this.assertDoctor(principal, doctorId, clinicId); this.repository.one("rooms", roomId, clinicId);
    this.repository.update("assignments", id, clinicId, { active: false, effectiveTo: effectiveFrom });
    return this.assignment(principal, clinicId, doctorId, roomId, effectiveFrom);
  }
  endAssignment(principal, requestedClinicId, doctorId, id, effectiveTo) { const clinicId = this.scope(principal, requestedClinicId, "assignment"); this.assertDoctor(principal, doctorId, clinicId); return this.repository.update("assignments", id, clinicId, { active: false, effectiveTo }); }

  calendar(principal, requestedClinicId, range, filters = {}) {
    const clinicId = this.scope(principal, requestedClinicId, "calendar");
    const includes = (row) => row.clinicId === clinicId && row.appointmentDate >= range.from && row.appointmentDate <= range.to && Object.entries(filters).every(([key, value]) => !value || row[key] === value);
    const appointments = this.repository.tables.appointments.filter(includes).map(copy);
    const blocks = this.repository.tables.blocks.filter((row) => active(row) && row.clinicId === clinicId && row.startsAt.slice(0, 10) >= range.from && row.startsAt.slice(0, 10) <= range.to).map(copy);
    return { appointments, blocks, week: Array.from({ length: 7 }, (_, index) => dateOffset(range.from, index)).map((date) => ({ date, appointments: appointments.filter((row) => row.appointmentDate === date) })), monthCounts: Object.fromEntries(appointments.map((row) => [row.appointmentDate, appointments.filter((item) => item.appointmentDate === row.appointmentDate).length])) };
  }
}

function dateOffset(date, amount) { const value = new Date(`${date}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + amount); return value.toISOString().slice(0, 10); }
