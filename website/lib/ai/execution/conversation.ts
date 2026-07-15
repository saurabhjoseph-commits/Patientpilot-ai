// website/lib/ai/execution/conversation.ts

import type {
  AIConversationSession,
  AIMessage,
  AIResponse,
  ConversationRequest,
} from "../core";

import { generateAIResponse } from "./ai-service";

/**
 * ============================================================
 * PatientPilot AI
 * RC5 Execution Engine
 * Conversation Orchestrator
 * ============================================================
 */

function createAssistantMessage(
  response: AIResponse,
): AIMessage {
  return {
    id: crypto.randomUUID(),

    role: "assistant",

    speaker: "assistant",

    content: response.message,

    timestamp: new Date().toISOString(),
  };
}

function updateSession(
  session: AIConversationSession,
  response: AIResponse,
): AIConversationSession {
  return {
    ...session,

    state: response.analysis.nextState,

    intent: response.intent,

    appointment:
      response.appointment ??
      session.appointment,

    analysis:
      response.analysis,

    messages: [
      ...session.messages,
      createAssistantMessage(
        response,
      ),
    ],

    updatedAt:
      new Date().toISOString(),
  };
}

/**
 * Execute one conversational turn.
 */
export async function executeConversation(
  request: ConversationRequest,
): Promise<AIResponse> {

  const aiResponse =
    await generateAIResponse(
      request,
    );

  return {
    ...aiResponse,

    state: updateSession(
      request.state,
      aiResponse,
    ),
  };
}