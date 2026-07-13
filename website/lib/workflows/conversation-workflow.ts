import {
  continueConversation,
  getConversation,
} from "@/lib/ai";

import {
  syncAppointment,
} from "@/lib/appointments/integration";

import {
  syncPatient,
} from "@/lib/patients/integration";

import {
  createSummaryService,
} from "@/lib/summaries/service";

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
  CallSummary,
} from "@/lib/summaries/types";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation Workflow
 * ============================================================
 *
 * Orchestrates the complete business workflow:
 *
 * Twilio
 *   ↓
 * AI
 *   ↓
 * Appointment
 *   ↓
 * Patient
 *   ↓
 * Summary
 * ============================================================
 */

export interface ConversationWorkflowResult {
  ai: AICompletionResult;

  session: AIConversationSession;

  appointment?: Appointment;

  patient?: Patient;

  summary?: CallSummary;
}

/**
 * Execute a complete conversation workflow.
 */
export async function executeConversationWorkflow(
  callSid: string,
  userMessage: string
): Promise<ConversationWorkflowResult> {
  /**
   * Continue the AI conversation.
   */
  const ai =
    await continueConversation(
      callSid,
      userMessage
    );

  /**
   * Reload latest session because
   * continueConversation updates it.
   */
  const session =
    getConversation(callSid);

  let appointment:
    | Appointment
    | undefined;

  let patient:
    | Patient
    | undefined;

  let summary:
    | CallSummary
    | undefined;

  /**
   * Create appointment if the AI
   * has completed the conversation.
   */
  const appointmentResult =
    await syncAppointment(
      session,
      ai
    );

  if (
    appointmentResult.created &&
    appointmentResult.appointment
  ) {
    appointment =
      appointmentResult.appointment;

    /**
     * Synchronize patient.
     */
    const patientResult =
      await syncPatient(
        appointment
      );

    patient =
      patientResult.patient;

    /**
     * Generate summary.
     */
    summary =
      await createSummaryService(
        session,
        ai,
        appointment,
        patient
      );
  }

  return {
    ai,
    session,
    appointment,
    patient,
    summary,
  };
}