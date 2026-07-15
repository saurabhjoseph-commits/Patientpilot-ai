// website/lib/ai/analysis.ts

import type {
  AIConversationSession,
  ConversationAnalysis,
} from "./core";

import {
  detectIntent,
  getMissingAppointmentFields,
  needsHumanAgent,
  calculateConfidence,
} from "./conversation-utils";

import {
  evaluateState,
} from "./state-machine";

import {
  validateAppointment,
} from "./validators";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation Analysis Engine
 * ============================================================
 *
 * Responsible for producing a single
 * ConversationAnalysis object.
 *
 * No OpenAI calls.
 * No session mutation.
 * No persistence.
 * ============================================================
 */

export function analyzeConversation(
  session: AIConversationSession,
  latestMessage: string,
): ConversationAnalysis {

  const intent =
    detectIntent(latestMessage);

  const workflow =
    evaluateState(session);

  const validation =
    validateAppointment(
      session.appointment,
    );

  const missingFields =
    getMissingAppointmentFields(
      session.appointment,
    );

  const needsHuman =
    needsHumanAgent(intent);

  const confidence =
    calculateConfidence(
      missingFields,
    );

  return {

    intent,

    nextState:
      workflow.nextState,

    completed:
      validation.valid,

    shouldHangup:
      workflow.completed ||
      needsHuman,

    needsHuman,

    confidence,

    missingFields,

    summary:
      buildSummary(
        session,
        missingFields,
      ),
  };
}

/**
 * ------------------------------------------------------------
 * Summary builder
 * ------------------------------------------------------------
 */

function buildSummary(
  session: AIConversationSession,
  missingFields: string[],
): string {

  if (missingFields.length === 0) {
    return "Appointment information complete.";
  }

  return `Waiting for ${missingFields.join(", ")}.`;
}

/**
 * ------------------------------------------------------------
 * Convenience helpers
 * ------------------------------------------------------------
 */

export function isConversationComplete(
  analysis: ConversationAnalysis,
): boolean {
  return analysis.completed;
}

export function requiresHumanAgent(
  analysis: ConversationAnalysis,
): boolean {
  return analysis.needsHuman;
}

export function getRemainingQuestions(
  analysis: ConversationAnalysis,
): string[] {
  return analysis.missingFields;
}

export function getConfidence(
  analysis: ConversationAnalysis,
): number {
  return analysis.confidence;
}