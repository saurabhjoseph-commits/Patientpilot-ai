// website/lib/ai/responses.ts

import {
  getOpenAIClient,
  DEFAULT_MODEL,
} from "./client";

import {
  buildSystemPrompt,
} from "./prompts";

import type {
  AIResponse,
  ConversationRequest,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * AI Response Engine
 * ============================================================
 *
 * Responsibilities
 * ----------------
 * • Build the OpenAI prompt
 * • Execute the model
 * • Parse structured JSON
 * • Return a strongly typed AIResponse
 * ============================================================
 */

const RESPONSE_TEMPERATURE = 0.3;

/**
 * Executes the OpenAI Responses API.
 */
async function executeCompletion(
  request: ConversationRequest,
) {
  const client = getOpenAIClient();

  const systemPrompt =
    buildSystemPrompt(
      request.context,
      request.state,
    );

  const completion =
    await client.responses.create({
      model: DEFAULT_MODEL,

      temperature: RESPONSE_TEMPERATURE,

      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content:
            request.latestMessage.content,
        },
      ],
    });

  return completion;
}

/**
 * Parses the JSON returned by OpenAI.
 */
function parseResponse(
  completion: Awaited<
    ReturnType<typeof executeCompletion>
  >,
): Omit<AIResponse, "state"> {
  if (!completion.output_text?.trim()) {
    throw new Error(
      "OpenAI returned an empty response.",
    );
  }

  try {
    return JSON.parse(
      completion.output_text,
    ) as Omit<
      AIResponse,
      "state"
    >;
  } catch {
    console.error(
      "Invalid JSON returned by OpenAI:",
      completion.output_text,
    );

    throw new Error(
      "OpenAI returned invalid JSON.",
    );
  }
}

/**
 * ============================================================
 * Public API
 * ============================================================
 *
 * Generates one structured AI response for the
 * current conversation turn.
 */
export async function generateAIResponse(
  request: ConversationRequest,
): Promise<AIResponse> {
  const completion =
    await executeCompletion(request);

  const parsed =
    parseResponse(completion);

  return {
    ...parsed,

    state: {
      ...request.state,

      updatedAt:
        new Date().toISOString(),
    },
  };
}