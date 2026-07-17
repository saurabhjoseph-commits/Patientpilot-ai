// website/lib/ai/workflow/response.ts

import { addMessage } from "@/lib/ai/session";

import { generateAIResponse } from "@/lib/ai/responses";

import type {
  AIConversationSession,
  AIMessage,
  AIResponse,
} from "@/lib/ai/core";

import type {
  AIContext,
} from "@/lib/ai/types";

/**
 * ============================================================
 * PatientPilot AI
 * Workflow Response
 * ============================================================
 *
 * Responsibilities
 * ----------------
 * • Call OpenAI
 * • Build final AI response
 * • Persist assistant message
 *
 * Does NOT
 * --------
 * • Execute business tools
 * • Make workflow decisions
 * • Extract entities
 * ============================================================
 */

export interface ResponseRequest {
  context: AIContext;
  session: AIConversationSession;
  latestMessage: AIMessage;
}

export async function generateWorkflowResponse(
  request: ResponseRequest,
): Promise<AIResponse> {
  const response =
    await generateAIResponse({
      context: request.context,
      state: request.session,
      latestMessage: request.latestMessage,
    });

  addMessage(
    request.session.callId,
    {
      id: crypto.randomUUID(),
      role: "assistant",
      speaker: "assistant",
      content: response.message,
      timestamp: new Date().toISOString(),
    },
  );

  return response;
}