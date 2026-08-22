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

import {
  intentClassifier,
} from "@/lib/ai/intent-classifier";

import type {
  AICompletionResult,
  AIConversationSession,
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
import type { ClinicScope } from "@/lib/clinic/clinic-scope";
import { getClinicReceptionistContext } from "@/lib/ai/clinic-receptionist-context";
import type { AIContext } from "@/lib/ai/types";

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

  bookingFailure?: string;

  bookingDoctorName?: string;
}

/**
 * Execute a complete conversation workflow.
 */
export async function executeConversationWorkflow(
  callSid: string,
  userMessage: string,
  scope: ClinicScope,
  suppliedContext?: AIContext,
): Promise<ConversationWorkflowResult> {
  const context = suppliedContext ?? await getClinicReceptionistContext(scope.clinicId);
  const message: AIMessage = {
    id: crypto.randomUUID(),
    role: "user",
    speaker: "patient",
    content: userMessage,
    timestamp: new Date().toISOString(),
  };

  /**
   * Detect conversation intent before AI execution.
   */
  const classification =
    intentClassifier.classify(userMessage);

  const aiResponse =
    await continueConversation({
      callId: callSid,
      context,
      message,
      intent: classification.intent,
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
    await getConversation(scope.clinicId, callSid);
  if (!session) throw new Error("Conversation session is unavailable.");

  let appointment:
    | Appointment
    | undefined;

  let patient:
    | Patient
    | undefined;

  let summary:
    | CallSummary
    | undefined;

  let bookingFailure: string | undefined;
  let bookingDoctorName: string | undefined;

  /**
   * Synchronize appointment.
   */
  const appointmentResult =
    await syncAppointment(
      session,
      ai,
      scope,
      context.timezone,
    );

  if (
    appointmentResult.created &&
    appointmentResult.appointment
  ) {
    appointment =
      appointmentResult.appointment;
    bookingDoctorName = appointmentResult.doctorName;

    /**
     * Synchronize patient.
     */
    const patientResult =
      await syncPatient(
        appointment,
        context.clinicName,
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
        scope,
        context.clinicName,
        appointment,
        patient,
      );
  } else if (ai.analysis.completed && ai.response.appointment?.confirmed === true) {
    bookingFailure = appointmentResult.reason ?? "The appointment could not be created.";
  }

  return {
    ai,
    session,
    appointment,
    patient,
    summary,
    bookingFailure,
    bookingDoctorName,
  };
}
