/**
 * PatientPilot AI
 * Infrastructure Layer
 * Provider Manager
 *
 * Central registry for external providers.
 */

import {
  openAIProvider,
  OpenAIProvider,
} from "./openai/openai-provider";

import {
  twilioProvider,
  TwilioProvider,
} from "./twilio/twilio-provider";

export interface ProviderManager {
  readonly openAI: OpenAIProvider;
  readonly twilio: TwilioProvider;

  validateConfiguration(): void;
}

export class DefaultProviderManager
  implements ProviderManager
{
  readonly openAI = openAIProvider;

  readonly twilio = twilioProvider;

  validateConfiguration(): void {
    if (!this.openAI.isConfigured()) {
      console.warn(
        "[ProviderManager] OpenAI provider is not configured.",
      );
    }

    if (!this.twilio.isConfigured()) {
      console.warn(
        "[ProviderManager] Twilio provider is not configured.",
      );
    }
  }
}

/**
 * Creates the Provider Manager.
 */
export function createProviderManager(): ProviderManager {
  return new DefaultProviderManager();
}

/**
 * Shared Provider Manager.
 */
export const providerManager =
  createProviderManager();

export default providerManager;