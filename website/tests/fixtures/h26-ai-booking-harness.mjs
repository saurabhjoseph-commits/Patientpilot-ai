import { FixtureRepository, SchedulingWorkflowService, fixture } from "./h21g3-workflow-harness.mjs";

export class VerifiedInboundBookingHarness {
  constructor({ ready = true, persist = true } = {}) {
    this.ready = ready;
    this.persist = persist;
    this.repository = new FixtureRepository();
    this.scheduling = new SchedulingWorkflowService(this.repository);
    this.deliveries = new Set();
  }

  book({ verified, deliveryId, clinicId, intent, patientName, phone, serviceName, doctorName, appointmentDate, appointmentTime, confirmed }) {
    if (!verified) return { success: false, message: "Unauthorized webhook." };
    if (this.deliveries.has(deliveryId)) return { success: false, duplicate: true, message: "Duplicate delivery acknowledged." };
    this.deliveries.add(deliveryId);
    if (!this.ready) return { success: false, message: "Clinic is not ready to accept AI bookings." };
    if (intent !== "book_appointment") return { success: false, message: "No booking action was requested." };
    if (!confirmed) return { success: false, message: "Patient confirmation is required before booking." };
    const service = this.repository.rows("services", clinicId).find((row) => normalize(row.name) === normalize(serviceName));
    if (!service) return { success: false, message: "The requested service is not available at this clinic." };
    const doctor = this.repository.rows("doctors", clinicId).find((row) => normalize(row.name) === normalize(doctorName));
    if (!doctor) return { success: false, message: "The requested doctor cannot provide that service." };
    const room = this.repository.rows("rooms", clinicId).find((row) => row.id === (doctor.id === "doctor-a" ? "room-a" : "room-b"));
    if (!room || !this.persist) return { success: false, message: "I’m sorry, I can’t complete that booking right now. A clinic team member can help you." };
    try {
      const appointment = this.scheduling.appointment(fixture.ownerA, clinicId, { patientName, phone, serviceId: service.id, doctorId: doctor.id, roomId: room.id, appointmentDate, appointmentTime, source: "AI Receptionist" });
      return { success: true, appointment, message: `Your ${service.name} appointment is confirmed for ${appointmentDate} at ${appointmentTime} with ${doctor.name}.` };
    } catch {
      return { success: false, message: "I’m sorry, I can’t complete that booking right now. A clinic team member can help you." };
    }
  }
}

function normalize(value) { return value.trim().toLowerCase(); }
