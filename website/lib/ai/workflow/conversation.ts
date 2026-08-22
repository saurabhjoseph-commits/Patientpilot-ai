// website/lib/ai/workflow/conversation.ts

import {
  addMessage,
  createSession,
  getSession,
  updateAppointment,
  configureSessionLanguage,
  updateSessionLanguage,
  updateIntent,
} from "@/lib/ai/session";
import { detectConversationLanguage, type ClinicLanguageMode } from "@/lib/platform/domain/clinic-language";

import {
  extractAppointmentData,
  hasExtractedData,
} from "@/lib/ai/extractor";

import { evaluateDecision } from "@/lib/ai/decision/engine";

import {
  createWorkflowPlan,
  type WorkflowPlan,
} from "@/lib/ai/decision/planner";

import type {
  AIConversationSession,
  AIIntent,
  AIMessage,
} from "@/lib/ai/core";

import type { DecisionResult } from "@/lib/ai/decision/types";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation Pipeline
 * ============================================================
 *
 * Responsibilities
 * ----------------
 * • Create/load conversation session
 * • Store incoming message
 * • Extract structured appointment information
 * • Update conversation session
 * • Run Decision Engine
 * • Produce Workflow Plan
 *
 * This module DOES NOT:
 * • Call OpenAI
 * • Execute tools
 * • Persist business entities
 * ============================================================
 */

export interface ConversationRequest {
  clinicId: string;
  callId: string;
  message: AIMessage;
  intent: AIIntent;
  languageMode: ClinicLanguageMode;
}

export interface ConversationResult {
  session: AIConversationSession;
  decision: DecisionResult;
  workflow: WorkflowPlan;
}

export async function processConversation(
  request: ConversationRequest,
): Promise<ConversationResult> {
  const {
    callId,
    message,
    intent,
  } = request;

  /**
   * Ensure a session exists.
   */
  await createSession(request.clinicId, callId, request.languageMode);
  await configureSessionLanguage(request.clinicId, callId, request.languageMode);
  await updateSessionLanguage(request.clinicId, callId, detectConversationLanguage(message.content));
  await updateIntent(request.clinicId, callId, intent);

  /**
   * Store the incoming message.
   */
  await addMessage(
    request.clinicId, callId,
    message,
  );

  /**
   * Extract appointment information.
   */
  const extraction =
    extractAppointmentData(
      message.content,
    );

  /**
   * Update appointment state.
   */
  if (
    hasExtractedData(
      extraction.appointment,
    )
  ) {
    await updateAppointment(
      request.clinicId, callId,
      extraction.appointment,
    );
  }

  /**
   * Load the updated session.
   */
  const session =
    await getSession(request.clinicId, callId);
  if (!session) throw new Error("Conversation session is unavailable.");

  /**
   * Determine the next action.
   */
  const decision =
    evaluateDecision({
      session,
      intent,
    });

  /**
   * Build execution workflow.
   */
  const workflow =
    createWorkflowPlan(
      decision,
    );

  return {
    session,
    decision,
    workflow,
  };
}
