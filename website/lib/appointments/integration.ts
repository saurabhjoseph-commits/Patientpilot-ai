import {
  createAppointmentService,
} from "./service";

import type {
  Appointment,
} from "./types";

import type {
  AICompletionResult,
  AIConversationSession,
} from "@/lib/ai/types";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";
import { normalizeClinicAppointmentDateTime, resolveClinicBooking } from "@/lib/ai/clinic-booking";
import { isAppointmentSlotConflict } from "./errors";

/**
 * ============================================================
 * PatientPilot AI
 * Appointment Integration
 * ============================================================
 *
 * Bridges the AI engine and the Appointment module.
 */

export interface AppointmentIntegrationResult {
  created: boolean;

  appointment?: Appointment;

  doctorName?: string;

  reason?: string;
}

export async function syncAppointment(
  session: AIConversationSession,
  result: AICompletionResult,
  scope: ClinicScope,
  timezone: string,
): Promise<AppointmentIntegrationResult> {

  /**
   * RC5 Migration
   *
   * Canonical identifier is callId.
   * callSid is kept temporarily for compatibility.
   */
  const callId =
    session.callSid ?? session.callId;

  if (!callId) {
    return {
      created: false,
      reason: "Missing call identifier.",
    };
  }

  /**
   * Conversation not complete.
   */
  if (!result.analysis.completed) {
    return {
      created: false,
      reason: "Conversation not complete.",
    };
  }

  /**
   * Prevent duplicate creation.
   */
  const appointment =
    result.response.appointment;

  if (!appointment) {
    return {
      created: false,
      reason:
        "No appointment information available.",
    };
  }

  if (appointment.confirmed !== true) {
    return {
      created: false,
      reason: "Patient confirmation is required before booking.",
    };
  }

  /**
   * Required fields.
   */
  const appointmentDate =
    appointment.appointmentDate ??
    appointment.preferredDate;

  const appointmentTime =
    appointment.appointmentTime ??
    appointment.preferredTime;

  if (
    !appointment.patientName ||
    !(appointment.phoneNumber ?? session.patient.phone) ||
    !appointmentDate ||
    !appointmentTime ||
    !appointment.reason
  ) {
    return {
      created: false,
      reason:
        "Appointment data incomplete.",
    };
  }

  const normalizedDateTime = normalizeClinicAppointmentDateTime(appointmentDate, appointmentTime, timezone);
  if (!normalizedDateTime) return { created: false, reason: "Please clarify the appointment date or time." };
  const normalizedAppointment = { ...appointment, appointmentDate: normalizedDateTime.date, appointmentTime: normalizedDateTime.time };

  /**
   * Create appointment.
   */
  const booking = await resolveClinicBooking(scope, normalizedAppointment);
  if (!booking.ok) return { created: false, reason: booking.reason };

  let createdAppointment: Appointment;
  try {
    createdAppointment = await createAppointmentService({
      clinicId: scope.clinicId,
      patientName:
        appointment.patientName,

      phone: appointment.phoneNumber ?? session.patient.phone ?? "",
      email: appointment.email,

      appointmentDate: normalizedDateTime.date,

      appointmentTime: normalizedDateTime.time,

      service: booking.serviceName,
      serviceId: booking.serviceId,
      doctorId: booking.doctorId,
      roomId: booking.roomId,
      source: "AI Receptionist",
    });
  } catch (error) {
    if (isAppointmentSlotConflict(error)) return { created: false, reason: "The selected time is no longer available. Please choose another slot." };
    throw error;
  }

  return {
    created: true,
    appointment: createdAppointment,
    doctorName: booking.doctorName,
  };
}

/**
 * Returns whether the appointment
 * has already been synchronized.
 */
export function isAppointmentSynced(
  callId: string,
): boolean {
  void callId;
  return false;
}

/**
 * Clears synchronization state.
 */
export function clearAppointmentSync(
  callId: string,
): void {
  void callId;
}
