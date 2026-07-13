import OpenAI from "openai";

import { buildSystemPrompt } from "./prompts";

import type {
  AICompletionResult,
  AIMessage,
  GenerateResponseParams,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * OpenAI Client
 * ============================================================
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL =
  process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

/**
 * Convert our message roles to OpenAI roles.
 */
function mapRole(
  role: AIMessage["role"]
): "system" | "user" | "assistant" {
  switch (role) {
    case "assistant":
      return "assistant";

    case "user":
      return "user";

    default:
      return "system";
  }
}

/**
 * Generate the next AI response.
 */
export async function generateResponse(
  request: GenerateResponseParams
): Promise<AICompletionResult> {
  const { session, userMessage } = request;

  const systemPrompt = buildSystemPrompt(session);

  const messages = [
    {
      role: "system" as const,
      content: systemPrompt,
    },

    ...session.messages.map((message) => ({
      role: mapRole(message.role),
      content: message.content,
    })),

    {
      role: "user" as const,
      content: userMessage,
    },
  ];

  const completion =
    await openai.chat.completions.create({
      model: MODEL,

      temperature: 0.4,

      messages,
    });

  const responseText =
    completion.choices[0]?.message?.content?.trim() ??
    "I'm sorry, I didn't quite catch that. Could you please repeat that?";

  /**
   * Future versions will use structured outputs to
   * detect intent, state transitions and appointment
   * extraction automatically.
   */
  return {
    response: {
      message: responseText,

      state: session.state,

      intent: session.intent,

      appointment: {},

      shouldHangup: false,
    },

    usage: {
      inputTokens:
        completion.usage?.prompt_tokens ?? 0,

      outputTokens:
        completion.usage?.completion_tokens ?? 0,

      totalTokens:
        completion.usage?.total_tokens ?? 0,
    },
  };
}