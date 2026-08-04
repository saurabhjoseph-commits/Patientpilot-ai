/**
 * PatientPilot AI
 * AI Conversation Context
 *
 * Maintains the conversation state that is sent
 * to the AI model independent of storage.
 */

import type {
  ChatMessage,
} from "../infrastructure/providers/openai/openai-provider";

export interface ConversationContext {
  readonly clinicId: string;
  readonly conversationId: string;
  readonly patientId?: string;

  readonly messages: readonly ChatMessage[];

  readonly metadata: Readonly<Record<string, unknown>>;
}

export class ConversationContextBuilder {
  private messages: ChatMessage[] = [];

  private metadata: Record<
    string,
    unknown
  > = {};

  constructor(
    private readonly clinicId: string,
    private readonly conversationId: string,
    private readonly patientId?: string,
  ) {}

  addMessage(
    message: ChatMessage,
  ): this {
    this.messages.push(message);

    return this;
  }

  addMessages(
    messages: readonly ChatMessage[],
  ): this {
    this.messages.push(...messages);

    return this;
  }

  setMetadata(
    key: string,
    value: unknown,
  ): this {
    this.metadata[key] = value;

    return this;
  }

  build(): ConversationContext {
    return {
      clinicId: this.clinicId,
      conversationId:
        this.conversationId,
      patientId: this.patientId,
      messages: [...this.messages],
      metadata: {
        ...this.metadata,
      },
    };
  }
}

/**
 * Creates a Conversation Context Builder.
 */
export function createConversationContext(
  clinicId: string,
  conversationId: string,
  patientId?: string,
): ConversationContextBuilder {
  return new ConversationContextBuilder(
    clinicId,
    conversationId,
    patientId,
  );
}

export default createConversationContext;