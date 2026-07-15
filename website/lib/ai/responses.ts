// website/lib/ai/responses.ts

import {
  getOpenAIClient,
  DEFAULT_MODEL,
} from "./client";

import { buildSystemPrompt } from "./prompts";
import { conversationResponseSchema } from "./schema";

import type {
  AIResponse,
  ConversationRequest,
  ConversationMessage,
} from "./core";

import type { ResponseInput } from "openai/resources/responses/responses";

/**
 * ============================================================
 * PatientPilot AI
 * OpenAI Response Service
 * ============================================================
 */

function buildConversationInput(
  messages: ConversationMessage[],
): ResponseInput {
  return messages.map((message) => ({
    role:
      message.role === "assistant"
        ? "assistant"
        : message.role === "system"
        ? "system"
        : "user",

    content: [
      {
        type: "input_text",
        text: message.content,
      },
    ],
  })) as ResponseInput;
}

export async function generateAIResponse(
  request: ConversationRequest,
): Promise<AIResponse> {
  const client = getOpenAIClient();

  const prompt = buildSystemPrompt(
    request.context,
    request.state,
  );

  const input: ResponseInput = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: prompt,
        },
      ],
    },

    ...buildConversationInput(
      request.state.messages,
    ),

    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: request.latestMessage.content,
        },
      ],
    },
  ];

  const completion =
    await client.responses.create({
      model: DEFAULT_MODEL,

      input,

      text: {
        format: {
          type: "json_schema",

          name:
            conversationResponseSchema.name,

          strict: true,

          schema:
            conversationResponseSchema.schema,
        },
      },
    });

  if (!completion.output_text) {
    throw new Error(
      "OpenAI returned an empty response.",
    );
  }

  const parsed = JSON.parse(
    completion.output_text,
  ) as Omit<AIResponse, "state">;

  return {
    ...parsed,

    state: {
      ...request.state,

      updatedAt: new Date().toISOString(),
    },
  };
}