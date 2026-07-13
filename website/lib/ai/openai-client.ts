import OpenAI from "openai";

import type { AIMessage } from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * OpenAI Client
 * ============================================================
 */

export interface ChatCompletionRequest {
  systemPrompt: string;
  messages: AIMessage[];
  temperature?: number;
}

export interface ChatCompletionResponse {
  message: string;

  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

/**
 * Lazily creates the OpenAI client.
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable."
    );
  }

  return new OpenAI({
    apiKey,
  });
}

/**
 * Model used by PatientPilot AI.
 */
export function getModel(): string {
  return (
    process.env.OPENAI_MODEL ??
    "gpt-4.1-mini"
  );
}

/**
 * Sends a chat completion request.
 */
export async function createChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const client = getOpenAIClient();

  const completion =
    await client.chat.completions.create({
      model: getModel(),

      temperature:
        request.temperature ?? 0.4,

      messages: [
        {
          role: "system",
          content: request.systemPrompt,
        },

        ...request.messages.map(
          (message) => ({
            role: message.role,
            content: message.content,
          })
        ),
      ],
    });

  return {
    message:
      completion.choices[0]?.message?.content?.trim() ??
      "I'm sorry, could you repeat that?",

    usage: {
      inputTokens:
        completion.usage?.prompt_tokens ?? 0,

      outputTokens:
        completion.usage
          ?.completion_tokens ?? 0,

      totalTokens:
        completion.usage?.total_tokens ?? 0,
    },
  };
}

/**
 * Simple health check.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = getOpenAIClient();

    await client.models.list();

    return true;
  } catch {
    return false;
  }
}