import type {
  AICompletionResult,
  AIConversationSession,
} from "@/lib/ai/types";

import type {
  Appointment,
} from "@/lib/appointments/types";

import type {
  Patient,
} from "@/lib/patients/types";

import type {
  CreateSummaryInput,
  SummaryOutcome,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Summary Generator
 * ============================================================
 */

export function generateSummary(
  session: AIConversationSession,
  result: AICompletionResult,
  appointment?: Appointment,
  patient?: Patient,
): CreateSummaryInput {

  /**
   * RC5 Migration
   */
  const callId =
    session.callSid ?? session.callId;

  const appointmentData =
    result.response.appointment;

  const appointmentDate =
    appointment?.appointmentDate ??
    appointmentData?.appointmentDate ??
    appointmentData?.preferredDate;

  const appointmentTime =
    appointment?.appointmentTime ??
    appointmentData?.appointmentTime ??
    appointmentData?.preferredTime;

  return {
    callSid: callId,

    clinicName:
      appointment?.clinicName ??
      patient?.clinicName ??
      "PatientPilot Demo Clinic",

    patientName:
      appointment?.patientName ??
      appointmentData?.patientName,

    phoneNumber:
      appointment?.phoneNumber ??
      appointmentData?.phoneNumber,

    intent:
      result.response.intent ??
      session.intent,

    outcome:
      determineOutcome(
        result,
        appointment,
      ),

    summary:
      buildSummary(
        result,
        appointment,
        appointmentDate,
        appointmentTime,
      ),

    actionItems:
      buildActionItems(
        result,
        appointment,
      ),

    appointmentId:
      appointment?.id,

    patientId:
      patient?.id,

    /**
     * RC5 uses 0–1 confidence.
     */
    confidence:
      result.analysis.confidence ?? 1,
  };
}

/**
 * Determine call outcome.
 */
function determineOutcome(
  result: AICompletionResult,
  appointment?: Appointment,
): SummaryOutcome {

  if (appointment) {
    return "appointment_created";
  }

  if (result.analysis.completed) {
    return "appointment_requested";
  }

  if (result.analysis.needsHuman) {
    return "transferred";
  }

  return "incomplete";
}

/**
 * Build summary.
 */
function buildSummary(
  result: AICompletionResult,
  appointment: Appointment | undefined,
  appointmentDate?: string,
  appointmentTime?: string,
): string {

  if (appointment) {
    return [
      `Appointment created for ${appointment.patientName}.`,
      `Reason: ${appointment.reason}.`,
      `Requested: ${appointmentDate ?? "Unknown"} at ${appointmentTime ?? "Unknown"}.`,
    ].join(" ");
  }

  if (result.analysis.completed) {
    return "The AI completed the conversation and collected the required appointment information.";
  }

  if (result.analysis.needsHuman) {
    return "The caller requested assistance from a human staff member.";
  }

  return "The conversation ended before all required information was collected.";
}

/**
 * Suggested follow-up actions.
 */
function buildActionItems(
  result: AICompletionResult,
  appointment?: Appointment,
): string[] {

  const actions: string[] = [];

  if (appointment) {
    actions.push(
      "Confirm appointment with patient.",
    );

    actions.push(
      "Send confirmation SMS.",
    );

    actions.push(
      "Send confirmation email.",
    );
  }

  if (result.analysis.needsHuman) {
    actions.push(
      "Receptionist should call patient.",
    );
  }

  if (
    !result.analysis.completed &&
    result.analysis.missingFields.length > 0
  ) {
    actions.push(
      `Collect: ${result.analysis.missingFields.join(", ")}`,
    );
  }

  if (actions.length === 0) {
    actions.push(
      "No further action required.",
    );
  }

  return actions;
}