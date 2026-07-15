// website/lib/ai/client.ts

import OpenAI from "openai";

/**
 * ============================================================
 * PatientPilot AI
 * OpenAI Client
 * ============================================================
 */

export const DEFAULT_MODEL =
  process.env.OPENAI_MODEL ??
  "gpt-5.5";

/**
 * Singleton OpenAI client.
 */
let client: OpenAI | null = null;

/**
 * Returns the shared OpenAI client.
 */
export function getOpenAIClient(): OpenAI {
  if (client) {
    return client;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable.",
    );
  }

  client = new OpenAI({
    apiKey,
  });

  return client;
}

/**
 * Reset the cached client.
 * Useful for testing.
 */
export function resetOpenAIClient(): void {
  client = null;
}