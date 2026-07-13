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
 *
 * Generates a structured call summary from
 * an AI conversation.
 * ============================================================
 */

/**
 * Build a call summary.
 */
export function generateSummary(
  session: AIConversationSession,
  result: AICompletionResult,
  appointment?: Appointment,
  patient?: Patient
): CreateSummaryInput {
  const appointmentData =
    result.response.appointment;

  return {
    callSid: session.callSid,

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
        appointment
      ),

    summary:
      buildSummary(
        result,
        appointment
      ),

    actionItems:
      buildActionItems(
        result,
        appointment
      ),

    appointmentId:
      appointment?.id,

    patientId:
      patient?.id,

    confidence:
      result.analysis.confidence ?? 100,
  };
}

/**
 * Determine call outcome.
 */
function determineOutcome(
  result: AICompletionResult,
  appointment?: Appointment
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
 * Build summary text.
 */
function buildSummary(
  result: AICompletionResult,
  appointment?: Appointment
): string {
  if (appointment) {
    return [
      `Appointment created for ${appointment.patientName}.`,
      `Reason: ${appointment.reason}.`,
      `Requested: ${appointment.appointmentDate} at ${appointment.appointmentTime}.`,
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
  appointment?: Appointment
): string[] {
  const actions: string[] = [];

  if (appointment) {
    actions.push(
      "Confirm appointment with patient."
    );

    actions.push(
      "Send confirmation SMS."
    );

    actions.push(
      "Send confirmation email."
    );
  }

  if (result.analysis.needsHuman) {
    actions.push(
      "Receptionist should call patient."
    );
  }

  if (
    !result.analysis.completed &&
    result.analysis.missingFields.length
  ) {
    actions.push(
      `Collect: ${result.analysis.missingFields.join(
        ", "
      )}`
    );
  }

  if (actions.length === 0) {
    actions.push(
      "No further action required."
    );
  }

  return actions;
}