// website/lib/ai/service.ts

import {
  createSession,
  getSession,
} from "./session";

import { runWorkflow } from "./workflow";

import type {
  AIContext,
  AIConversationSession,
  AIIntent,
  AIMessage,
  AIResponse,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * AI Service (RC4 Compatibility Layer)
 * ============================================================
 */

export interface ConversationRequest {
  callId: string;
  context: AIContext;
  message: AIMessage;
  intent: AIIntent;
}

/**
 * Legacy API.
 * Called when a new phone call starts.
 */
export function startConversation(
  callId: string,
): AIConversationSession {
  return createSession(callId);
}

/**
 * Legacy API.
 */
export function getConversation(
  callId: string,
): AIConversationSession {
  return getSession(callId);
}

/**
 * Main AI conversation entry point.
 */
export async function continueConversation(
  request: ConversationRequest,
): Promise<AIResponse> {
  if (!request.callId) {
    throw new Error("Missing callId.");
  }

  if (!request.message) {
    throw new Error("Missing conversation message.");
  }

  return runWorkflow({
    callId: request.callId,
    context: request.context,
    message: request.message,
    intent: request.intent,
  });
}