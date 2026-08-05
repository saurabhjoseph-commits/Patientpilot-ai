/**
 * PatientPilot AI
 * AI Prompt Builder
 *
 * Responsible for constructing consistent prompts
 * for all AI interactions.
 */

import type {
  ChatMessage,
} from "../infrastructure/providers/openai/openai-provider";

export interface PromptContext {
  readonly clinicName?: string;
  readonly patientName?: string;
  readonly conversationType?: string;
}

export class PromptBuilder {
  buildSystemPrompt(
    context: PromptContext = {},
  ): ChatMessage {
    const clinic =
      context.clinicName ??
      "the dental clinic";

    return {
      role: "system",
      content: [
        "You are PatientPilot AI.",
        "You are a professional AI Front Office Manager.",
        `You represent ${clinic}.`,
        "Always be friendly, empathetic, and professional.",
        "Collect missing information before answering.",
        "Never invent appointment availability.",
        "Escalate emergencies to clinic staff immediately.",
      ].join(" "),
    };
  }

  buildConversation(
    userMessage: string,
    history: readonly ChatMessage[] = [],
    context: PromptContext = {},
  ): readonly ChatMessage[] {
    return [
      this.buildSystemPrompt(context),
      ...history,
      {
        role: "user",
        content: userMessage,
      },
    ];
  }
}

/**
 * Shared Prompt Builder.
 */
export const promptBuilder =
  new PromptBuilder();

export default promptBuilder;