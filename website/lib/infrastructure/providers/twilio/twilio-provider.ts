/**
 * PatientPilot AI
 * Infrastructure Layer
 * Twilio Provider
 *
 * Abstraction over Twilio communications.
 * The initial implementation is a production-ready skeleton
 * that can later be connected to the official Twilio SDK.
 */

import configuration from "../../config";

export interface OutboundCallRequest {
  readonly to: string;
  readonly from?: string;
  readonly twimlUrl: string;
}

export interface SmsRequest {
  readonly to: string;
  readonly from?: string;
  readonly body: string;
}

export interface CallResult {
  readonly id: string;
  readonly status: string;
}

export interface SmsResult {
  readonly id: string;
  readonly status: string;
}

export interface TwilioProvider {
  makeCall(
    request: OutboundCallRequest,
  ): Promise<CallResult>;

  sendSms(
    request: SmsRequest,
  ): Promise<SmsResult>;

  isConfigured(): boolean;
}

export class DefaultTwilioProvider
  implements TwilioProvider
{
  isConfigured(): boolean {
    return Boolean(
      configuration.twilio.accountSid &&
        configuration.twilio.authToken &&
        configuration.twilio.phoneNumber,
    );
  }

  async makeCall(
    request: OutboundCallRequest,
  ): Promise<CallResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "Twilio is not configured.",
      );
    }

    void request;

    /**
     * TODO:
     * Replace with Twilio SDK:
     *
     * client.calls.create(...)
     */

    return {
      id: crypto.randomUUID(),
      status: "queued",
    };
  }

  async sendSms(
    request: SmsRequest,
  ): Promise<SmsResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "Twilio is not configured.",
      );
    }

    void request;

    /**
     * TODO:
     * Replace with Twilio SDK:
     *
     * client.messages.create(...)
     */

    return {
      id: crypto.randomUUID(),
      status: "queued",
    };
  }
}

/**
 * Creates a Twilio Provider.
 */
export function createTwilioProvider(): TwilioProvider {
  return new DefaultTwilioProvider();
}

/**
 * Shared Twilio Provider.
 */
export const twilioProvider =
  createTwilioProvider();

/**
 * Default Twilio Provider.
 */
export default twilioProvider;