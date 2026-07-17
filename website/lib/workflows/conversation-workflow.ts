// website/lib/workflows/conversation-workflow.ts

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
  AIContext,
  AIMessage,
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
 */

export interface ConversationWorkflowResult {
  ai: AICompletionResult;

  session: AIConversationSession;

  appointment?: Appointment;

  patient?: Patient;

  summary?: CallSummary;
}

const DEFAULT_CONTEXT: AIContext = {
  clinicName: "Bright Smile Dental",
  timezone: "America/New_York",
  officeHours: "Mon-Fri 8:00 AM - 5:00 PM",
  providers: ["Dr. Smith"],
  acceptedInsurance: ["Delta Dental"],
  appointmentTypes: [
    "Cleaning",
    "Emergency",
    "Consultation",
  ],
};

/**
 * Execute a complete conversation workflow.
 */
export async function executeConversationWorkflow(
  callSid: string,
  userMessage: string,
): Promise<ConversationWorkflowResult> {

  const message: AIMessage = {
    id: crypto.randomUUID(),
    role: "user",
    speaker: "patient",
    content: userMessage,
    timestamp: new Date().toISOString(),
  };

  const aiResponse = await continueConversation({
  callId: callSid,
  context: DEFAULT_CONTEXT,
  message,
  intent: "unknown",
});

const ai: AICompletionResult = {
  response: aiResponse,
  analysis: aiResponse.analysis,
  actions: aiResponse.actions,
};

  /**
   * Reload latest session.
   */
  const session =
    getConversation(callSid);

  let appointment: Appointment | undefined;
  let patient: Patient | undefined;
  let summary: CallSummary | undefined;

  /**
   * Synchronize appointment.
   */
  const appointmentResult =
    await syncAppointment(
      session,
      ai,
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
        appointment,
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
        patient,
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