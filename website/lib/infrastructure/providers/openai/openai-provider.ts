/**
 * PatientPilot AI
 * Infrastructure Layer
 * OpenAI Provider
 *
 * Abstraction over OpenAI services.
 * This initial implementation is a production-ready skeleton
 * that can later be connected to the official OpenAI SDK.
 */

import configuration from "../../config";

export interface ChatMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

export interface ChatCompletionRequest {
  readonly model: string;
  readonly messages: readonly ChatMessage[];
  readonly temperature?: number;
  readonly maxTokens?: number;
}

export interface ChatCompletionResponse {
  readonly id: string;
  readonly content: string;
  readonly model: string;
}

export interface OpenAIProvider {
  createChatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse>;

  isConfigured(): boolean;
}

export class DefaultOpenAIProvider
  implements OpenAIProvider
{
  isConfigured(): boolean {
    return Boolean(
      configuration.openai.apiKey,
    );
  }

  async createChatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    if (!this.isConfigured()) {
      throw new Error(
        "OpenAI is not configured.",
      );
    }

    void request;

    /**
     * TODO:
     * Replace with the official OpenAI SDK.
     */

    return {
      id: crypto.randomUUID(),
      content: "",
      model: request.model,
    };
  }
}

/**
 * Creates an OpenAI Provider.
 */
export function createOpenAIProvider(): OpenAIProvider {
  return new DefaultOpenAIProvider();
}

/**
 * Shared OpenAI Provider.
 */
export const openAIProvider =
  createOpenAIProvider();

/**
 * Default OpenAI Provider.
 */
export default openAIProvider;