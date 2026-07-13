import { generateResponse } from "./client";

import {
  addMessage,
  createSession,
  deleteSession,
  getActiveSessionCount,
  getAllSessions,
  getConversationHistory,
  getSession,
  saveSession,
  updateAppointment,
  updateIntent,
  updateState,
} from "./session";

import {
  addEvent,
  addTranscriptMessage,
  updateAIState,
  updateIntent as updateLiveIntent,
  updateTokenUsage,
} from "@/lib/live";

import type {
  AICompletionResult,
  AIConversationSession,
  AIConversationState,
  AIIntent,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Public Service Layer
 * ============================================================
 */

export function startConversation(
  callSid: string
): AIConversationSession {
  return createSession(callSid);
}

export async function continueConversation(
  callSid: string,
  userMessage: string
): Promise<AICompletionResult> {
  /**
   * Ensure session exists.
   */
  createSession(callSid);

  /**
   * Save patient's message.
   */
  addMessage(callSid, "user", userMessage);

  addTranscriptMessage(
    callSid,
    "user",
    userMessage
  );

  addEvent(callSid, {
    type: "speech",
    title: "Patient Spoke",
    description: userMessage,
  });

  /**
   * Reload latest session after mutation.
   */
  const session = getSession(callSid);

  /**
   * AI is processing.
   */
  updateAIState(callSid, "collecting_reason");

  addEvent(callSid, {
    type: "thinking",
    title: "AI Thinking",
    description: "Generating response...",
  });

  /**
   * Generate response.
   */
  const result = await generateResponse({
    session,
    userMessage,
  });

  /**
   * Save assistant reply.
   */
  addMessage(
    callSid,
    "assistant",
    result.response.message
  );

  addTranscriptMessage(
    callSid,
    "assistant",
    result.response.message
  );

  addEvent(callSid, {
    type: "response",
    title: "AI Responded",
    description: result.response.message,
  });

  /**
   * Conversation state.
   */
  if (result.response.state) {
    updateState(
      callSid,
      result.response.state
    );

    updateAIState(
      callSid,
      result.response.state
    );
  }

  /**
   * Intent.
   */
  if (result.response.intent) {
    updateIntent(
      callSid,
      result.response.intent
    );

    updateLiveIntent(
      callSid,
      result.response.intent
    );
  }

  /**
   * Appointment data.
   */
  if (result.response.appointment) {
    updateAppointment(
      callSid,
      result.response.appointment
    );
  }

  /**
   * Token usage.
   */
  updateTokenUsage(callSid, {
    promptTokens: result.usage.inputTokens,
    completionTokens:
      result.usage.outputTokens,
    totalTokens: result.usage.totalTokens,
  });

  return result;
}

export function endConversation(
  callSid: string
): void {
  deleteSession(callSid);
}

export function getConversation(
  callSid: string
): AIConversationSession {
  return getSession(callSid);
}

export function getHistory(
  callSid: string
) {
  return getConversationHistory(callSid);
}

export function getConversations() {
  return getAllSessions();
}

export function getConversationCount() {
  return getActiveSessionCount();
}

/**
 * Session helpers.
 */
export {
  saveSession,
  updateState,
  updateIntent,
  updateAppointment,
};

/**
 * Types.
 */
export type {
  AICompletionResult,
  AIConversationSession,
  AIConversationState,
  AIIntent,
};