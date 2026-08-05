/**
 * PatientPilot AI
 * Application Layer
 * Provider Service
 *
 * Central access point for external providers.
 */

import {
  providerManager,
} from "@/lib/infrastructure/providers/provider-manager";

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
} from "@/lib/infrastructure/providers/openai/openai-provider";

import type {
  OutboundCallRequest,
  CallResult,
  SmsRequest,
  SmsResult,
} from "@/lib/infrastructure/providers/twilio/twilio-provider";

export interface ProviderService {
  createChatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse>;

  makeCall(
    request: OutboundCallRequest,
  ): Promise<CallResult>;

  sendSms(
    request: SmsRequest,
  ): Promise<SmsResult>;

  validateConfiguration(): void;
}

export class DefaultProviderService
  implements ProviderService
{
  async createChatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    return providerManager.openAI.createChatCompletion(
      request,
    );
  }

  async makeCall(
    request: OutboundCallRequest,
  ): Promise<CallResult> {
    return providerManager.twilio.makeCall(
      request,
    );
  }

  async sendSms(
    request: SmsRequest,
  ): Promise<SmsResult> {
    return providerManager.twilio.sendSms(
      request,
    );
  }

  validateConfiguration(): void {
    providerManager.validateConfiguration();
  }
}

/**
 * Creates a Provider Service.
 */
export function createProviderService(): ProviderService {
  return new DefaultProviderService();
}

/**
 * Shared Provider Service.
 */
export const providerService =
  createProviderService();

export default providerService;