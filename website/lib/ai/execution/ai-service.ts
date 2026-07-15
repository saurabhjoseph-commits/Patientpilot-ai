// website/lib/ai/execution/ai-service.ts

import type {
  AIResponse,
  ConversationRequest,
} from "../core";

export async function generateAIResponse(
  _request: ConversationRequest,
): Promise<AIResponse> {
  throw new Error(
    "generateAIResponse() has not been implemented yet.",
  );
}