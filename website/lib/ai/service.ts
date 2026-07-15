// website/lib/ai/service.ts

import {
  createSession,
  getSession,
  addMessage,
} from "./session";

import type {
  AIAction,
  AICompletionResult,
  AIConversationSession,
  AIMessage,
  AIResponse,
  ConversationAnalysis,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Temporary Compatibility Layer
 * ============================================================
 *
 * Keeps legacy callers working until the RC5 execution
 * engine replaces this implementation.
 */

export function startConversation(
  callSid: string,
): AIConversationSession {
  return createSession(callSid);
}

export function getConversation(
  callSid: string,
): AIConversationSession {
  return getSession(callSid);
}

export async function continueConversation(
  callSid: string,
  userMessage: string,
): Promise<AICompletionResult> {

  const message: AIMessage = {
    id: crypto.randomUUID(),

    role: "user",

    speaker: "patient",

    content: userMessage,

    timestamp: new Date().toISOString(),
  };

  addMessage(
    callSid,
    message,
  );

  const session =
    getSession(callSid);

  const analysis: ConversationAnalysis = {
    intent: "unknown",

    nextState: "greeting",

    completed: false,

    shouldHangup: false,

    needsHuman: false,

    confidence: 1,

    missingFields: [],

    summary: "",
  };

  const response: AIResponse = {
    message:
      "Thank you. PatientPilot AI received your message.",

    speech:
      "Thank you. PatientPilot AI received your message.",

    intent:
      analysis.intent,

    confidence:
      analysis.confidence,

    analysis,

    appointment: undefined,

    actions: [],

    shouldHangup: false,

    state: session,
  };

  return {
    response,

    analysis,

    actions: [] satisfies AIAction[],
  };
}