// website/lib/ai/execution/client.ts

import OpenAI from "openai";

/**
 * ============================================================
 * PatientPilot AI
 * RC5 Execution Engine
 * OpenAI Client
 * ============================================================
 */

export const DEFAULT_MODEL =
  process.env.OPENAI_MODEL ?? "gpt-5.5";

let client: OpenAI | undefined;

/**
 * Returns the singleton OpenAI client.
 */
export function getOpenAIClient(): OpenAI {
  if (client) {
    return client;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured.",
    );
  }

  client = new OpenAI({
    apiKey,
  });

  return client;
}

/**
 * Reset client (tests only)
 */
export function resetOpenAIClient(): void {
  client = undefined;
}