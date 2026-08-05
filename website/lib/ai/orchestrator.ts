/**
 * PatientPilot AI
 * AI Orchestrator
 *
 * Central coordinator for AI conversations.
 */

import openAIProvider, {
  ChatMessage,
} from "../infrastructure/providers/openai/openai-provider";
import { eventBus } from "../platform/runtime/event-bus";

export type ConversationChannel =
  | "phone"
  | "web"
  | "sms"
  | "email";

export type ConversationIntent =
  | "unknown"
  | "new_patient"
  | "existing_patient"
  | "appointment_booking"
  | "appointment_reschedule"
  | "appointment_cancel"
  | "office_hours"
  | "insurance"
  | "pricing"
  | "emergency"
  | "human_agent";

export interface ConversationHistoryMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

export interface AIConversationRequest {
  readonly clinicId: string;
  readonly conversationId: string;
  readonly patientId?: string;

  readonly channel: ConversationChannel;

  readonly message: string;

  readonly history?: readonly ConversationHistoryMessage[];
}

export interface AIConversationResponse {
  readonly reply: string;

  readonly intent: ConversationIntent;

  readonly confidence: number;

  readonly requiresHuman: boolean;

  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface AIOrchestrator {
  process(
    request: AIConversationRequest,
  ): Promise<AIConversationResponse>;
}

export class DefaultAIOrchestrator
  implements AIOrchestrator
{
  async process(
    request: AIConversationRequest,
  ): Promise<AIConversationResponse> {
    const intent =
      this.detectIntent(request.message);

    const requiresHuman =
      intent === "human_agent" ||
      intent === "emergency";

    const reply =
      await this.generateReply(request);

    await this.publishConversationEvent(
      request,
      intent,
    );

    return {
      reply,
      intent,
      confidence: 0.95,
      requiresHuman,
      metadata: {
        clinicId: request.clinicId,
        conversationId:
          request.conversationId,
        channel: request.channel,
      },
    };
  }

  private detectIntent(
    message: string,
  ): ConversationIntent {
    const text = message.toLowerCase();

    if (
      text.includes("reschedule")
    ) {
      return "appointment_reschedule";
    }

    if (
      text.includes("cancel")
    ) {
      return "appointment_cancel";
    }

    if (
      text.includes("appointment") ||
      text.includes("book")
    ) {
      return "appointment_booking";
    }

    if (
      text.includes("insurance")
    ) {
      return "insurance";
    }

    if (
      text.includes("price") ||
      text.includes("cost")
    ) {
      return "pricing";
    }

    if (
      text.includes("hours") ||
      text.includes("open")
    ) {
      return "office_hours";
    }

    if (
      text.includes("pain") ||
      text.includes("emergency")
    ) {
      return "emergency";
    }

    if (
      text.includes("human") ||
      text.includes("person") ||
      text.includes("staff")
    ) {
      return "human_agent";
    }

    return "unknown";
  }

  private async generateReply(
    request: AIConversationRequest,
  ): Promise<string> {
    if (!openAIProvider.isConfigured()) {
      return (
        "Thank you for contacting our dental office. " +
        "Our AI assistant is currently unavailable. " +
        "A team member will assist you shortly."
      );
    }

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are a friendly AI Front Office Manager for a dental clinic.",
      },
      ...(request.history ?? []),
      {
        role: "user",
        content: request.message,
      },
    ];

    try {
      const response =
        await openAIProvider.createChatCompletion({
          model: "gpt-5.5",
          messages,
          temperature: 0.3,
          maxTokens: 300,
        });

      return (
        response.content ||
        "Thank you. How else may I assist you today?"
      );
    } catch {
      return (
        "I'm sorry, I couldn't process your request at the moment."
      );
    }
  }

  private async publishConversationEvent(
    request: AIConversationRequest,
    intent: ConversationIntent,
  ): Promise<void> {
    await eventBus.publish({
      id: crypto.randomUUID(),
      name: "ai.conversation.processed",
      version: "1.0",
      occurredAt: new Date(),
      payload: {
        clinicId: request.clinicId,
        conversationId:
          request.conversationId,
        patientId: request.patientId,
        channel: request.channel,
        intent,
      },
    });
  }
}

export function createAIOrchestrator(): AIOrchestrator {
  return new DefaultAIOrchestrator();
}

export const aiOrchestrator =
  createAIOrchestrator();

export default aiOrchestrator;