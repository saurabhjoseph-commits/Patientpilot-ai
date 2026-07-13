import type {
  AIConversationSession,
  ConversationAnalysis,
} from "./types";

import {
  detectIntent,
  determineNextState,
  getMissingAppointmentFields,
  needsHumanAgent,
  shouldEndConversation,
} from "./conversation";

import {
  validateAppointment,
} from "./validator";

/**
 * ============================================================
 * PatientPilot AI
 * Analysis Service
 * ============================================================
 */

export function analyzeConversation(
  session: AIConversationSession,
  latestMessage: string
): ConversationAnalysis {

  const intent =
    detectIntent(latestMessage);

  const nextState =
    determineNextState(session);

  const validation =
    validateAppointment(
      session.appointment
    );

  const missingFields =
    getMissingAppointmentFields(
      session.appointment
    );

  const needsHuman =
    needsHumanAgent(intent);

  const completed =
    validation.valid;

  const shouldHangup =
    shouldEndConversation(
      nextState,
      needsHuman
    );

  return {
    nextState,

    intent,

    completed,

    shouldHangup,

    needsHuman,

    missingFields,

    confidence:
      validation.score,
  };
}

/**
 * ============================================================
 * Returns whether the AI has
 * enough information to finish.
 * ============================================================
 */

export function isConversationComplete(
  analysis: ConversationAnalysis
): boolean {
  return analysis.completed;
}

/**
 * ============================================================
 * Returns whether a human
 * should take over.
 * ============================================================
 */

export function requiresHumanAgent(
  analysis: ConversationAnalysis
): boolean {
  return analysis.needsHuman;
}

/**
 * ============================================================
 * Returns remaining information.
 * ============================================================
 */

export function getRemainingQuestions(
  analysis: ConversationAnalysis
): string[] {
  return analysis.missingFields;
}

/**
 * ============================================================
 * Confidence helper.
 * ============================================================
 */

export function getConfidence(
  analysis: ConversationAnalysis
): number {
  return analysis.confidence ?? 0;
}