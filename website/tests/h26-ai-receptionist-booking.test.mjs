import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { VerifiedInboundBookingHarness } from "./fixtures/h26-ai-booking-harness.mjs";
import { fixture } from "./fixtures/h21g3-workflow-harness.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const request = (overrides = {}) => ({ verified: true, deliveryId: "delivery-1", clinicId: fixture.clinicA, intent: "book_appointment", patientName: "Fixture Patient", phone: "+919876543210", serviceName: "Exam", doctorName: "Dr A", appointmentDate: "2026-08-10", appointmentTime: "09:30", confirmed: true, ...overrides });

test("fixture-based integration-style inbound AI booking reaches an authoritative appointment only after confirmation", () => {
  const harness = new VerifiedInboundBookingHarness();
  const result = harness.book(request());
  assert.equal(result.success, true); assert.equal(result.appointment.clinicId, fixture.clinicA); assert.equal(result.appointment.duration, 40); assert.equal(result.appointment.source, "AI Receptionist");
  assert.match(result.message, /confirmed.*Dr A/);
  const calendar = harness.scheduling.calendar(fixture.ownerA, fixture.clinicA, { from: "2026-08-10", to: "2026-08-10" }, { doctorId: "doctor-a", serviceId: "service-a", roomId: "room-a" });
  assert.equal(calendar.appointments.length, 1);
});

test("fixture-based inbound AI failures do not create or claim a booking", () => {
  for (const overrides of [{ verified: false }, { confirmed: false }, { serviceName: "Unsupported service" }, { doctorName: "Dr B" }, { clinicId: fixture.clinicB }]) {
    const harness = new VerifiedInboundBookingHarness(); const result = harness.book(request(overrides)); assert.equal(result.success, false);
  }
  const incomplete = new VerifiedInboundBookingHarness({ ready: false }); assert.equal(incomplete.book(request()).success, false);
  const failedPersistence = new VerifiedInboundBookingHarness({ persist: false }); const failure = failedPersistence.book(request()); assert.equal(failure.success, false); assert.doesNotMatch(failure.message, /confirmed/i);
  const duplicate = new VerifiedInboundBookingHarness(); duplicate.book(request()); assert.equal(duplicate.book(request()).duplicate, true);
});

test("production AI booking preserves trusted telephony scope, readiness, clinic linkage, and safe response boundaries", () => {
  const voice = read("app/api/twilio/voice/route.ts"); const respond = read("app/api/ai/respond/route.ts"); const integration = read("lib/appointments/integration.ts"); const booking = read("lib/ai/clinic-booking.ts"); const workflow = read("lib/workflows/conversation-workflow.ts");
  assert.match(voice, /verifyTwilioWebhook/); assert.match(voice, /resolveTelephonyClinic\(to\)/); assert.match(respond, /verifyTwilioWebhook/); assert.match(respond, /resolveTelephonyClinic/); assert.match(respond, /createWebhookDeliveryService/);
  assert.match(workflow, /getClinicReceptionistContext\(scope\.clinicId\)/); assert.doesNotMatch(workflow, /Bright Smile Dental/);
  assert.match(integration, /appointment\.confirmed !== true/); assert.match(integration, /resolveClinicBooking\(scope, normalizedAppointment\)/); assert.match(integration, /source: "AI Receptionist"/);
  assert.match(booking, /getClinicOperationalReadiness/); assert.match(booking, /clinic_services/); assert.match(booking, /doctor_services/); assert.match(booking, /checkAuthoritativeSlot/); assert.match(booking, /not ready to accept AI bookings/);
  assert.match(booking, /normalizeClinicAppointmentDateTime/); assert.match(booking, /tomorrow/); assert.match(integration, /Please clarify the appointment date or time/);
  assert.match(respond, /workflow\.bookingFailure/); assert.match(respond, /workflow\.appointment/); assert.doesNotMatch(respond, /TWILIO_AUTH_TOKEN|service_role/i);
});
