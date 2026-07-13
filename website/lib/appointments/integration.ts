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

/**
 * ============================================================
 * PatientPilot AI
 * Appointment Integration
 * ============================================================
 *
 * Bridges the AI engine and the Appointment module.
 *
 * Responsible for:
 * - Checking conversation completion
 * - Preventing duplicate appointment creation
 * - Creating appointments
 * ============================================================
 */

/**
 * Tracks appointments already created
 * during the current server process.
 *
 * NOTE:
 * This is an in-memory implementation for the MVP.
 * Later this will be replaced with a database lookup
 * using the Call SID.
 */
const processedCalls = new Set<string>();

export interface AppointmentIntegrationResult {
  created: boolean;

  appointment?: Appointment;

  reason?: string;
}

/**
 * Synchronize a completed AI conversation
 * into the Appointment module.
 */
export async function syncAppointment(
  session: AIConversationSession,
  result: AICompletionResult
): Promise<AppointmentIntegrationResult> {
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
  if (processedCalls.has(session.callSid)) {
    return {
      created: false,
      reason: "Appointment already created.",
    };
  }

  const appointment =
    result.response.appointment;

  if (!appointment) {
    return {
      created: false,
      reason: "No appointment information available.",
    };
  }

  /**
   * Ensure all required fields exist.
   */
  if (
    !appointment.patientName ||
    !appointment.phoneNumber ||
    !appointment.appointmentDate ||
    !appointment.appointmentTime ||
    !appointment.reason
  ) {
    return {
      created: false,
      reason: "Appointment data incomplete.",
    };
  }

  /**
   * Create appointment.
   */
  const createdAppointment =
    await createAppointmentService({
      clinicName: "PatientPilot Demo Clinic",

      patientName:
        appointment.patientName,

      phoneNumber:
        appointment.phoneNumber,

      appointmentDate:
        appointment.appointmentDate,

      appointmentTime:
        appointment.appointmentTime,

      reason:
        appointment.reason,

      callSid:
        session.callSid,
    });

  processedCalls.add(session.callSid);

  return {
    created: true,
    appointment: createdAppointment,
  };
}

/**
 * Returns whether the appointment
 * has already been synchronized.
 */
export function isAppointmentSynced(
  callSid: string
): boolean {
  return processedCalls.has(callSid);
}

/**
 * Clears synchronization state.
 *
 * Useful for testing.
 */
export function clearAppointmentSync(
  callSid: string
): void {
  processedCalls.delete(callSid);
}