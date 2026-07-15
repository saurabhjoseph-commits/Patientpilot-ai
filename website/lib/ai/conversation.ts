// website/lib/ai/conversation.ts

import { generateAIResponse } from "./responses";
import { validateAIResponse } from "./validators";
import { processAppointment } from "./appointment";

import type {
  AIResponse,
  ConversationMessage,
  ConversationRequest,
  ConversationState,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation Orchestrator
 * ============================================================
 */

export interface ConversationResult {
  response: AIResponse;

  updatedState: ConversationState;

  appointment: ReturnType<typeof processAppointment>;

  processingTimeMs: number;
}

function appendAssistantMessage(
  state: ConversationState,
  speech: string,
): ConversationState {
  const assistantMessage: ConversationMessage = {
    id: crypto.randomUUID(),

    role: "assistant",

    speaker: "assistant",

    content: speech,

    timestamp: new Date().toISOString(),
  };

  return {
    ...state,

    messages: [
      ...state.messages,
      assistantMessage,
    ],

    updatedAt: new Date().toISOString(),
  };
}

/**
 * Executes one conversation turn.
 */
export async function continueConversation(
  request: ConversationRequest,
): Promise<ConversationResult> {
  const started = Date.now();

  /**
   * generateAIResponse() now returns
   * a fully parsed AIResponse.
   */
  const parsedResponse =
    await generateAIResponse(request);

  const validation =
    validateAIResponse(parsedResponse);

  if (!validation.valid) {
    throw new Error(
      [
        "Invalid AI response:",
        ...validation.errors,
      ].join("\n"),
    );
  }

  const appointment =
    processAppointment(parsedResponse);

  const updatedState =
    appendAssistantMessage(
      request.state,
      parsedResponse.speech,
    );

  const response: AIResponse = {
    ...parsedResponse,

    actions: appointment.actions,

    state: updatedState,
  };

  return {
    response,

    updatedState,

    appointment,

    processingTimeMs:
      Date.now() - started,
  };
}