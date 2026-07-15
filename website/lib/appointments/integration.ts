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
 */

const processedCalls = new Set<string>();

export interface AppointmentIntegrationResult {
  created: boolean;

  appointment?: Appointment;

  reason?: string;
}

export async function syncAppointment(
  session: AIConversationSession,
  result: AICompletionResult,
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
  if (processedCalls.has(callId)) {
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
      reason:
        "No appointment information available.",
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
    !appointment.phoneNumber ||
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

  /**
   * Create appointment.
   */
  const createdAppointment =
    await createAppointmentService({
      clinicName:
        "PatientPilot Demo Clinic",

      patientName:
        appointment.patientName,

      phoneNumber:
        appointment.phoneNumber,

      appointmentDate,

      appointmentTime,

      reason:
        appointment.reason,

      callSid: callId,
    });

  processedCalls.add(callId);

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
  callId: string,
): boolean {
  return processedCalls.has(callId);
}

/**
 * Clears synchronization state.
 */
export function clearAppointmentSync(
  callId: string,
): void {
  processedCalls.delete(callId);
}