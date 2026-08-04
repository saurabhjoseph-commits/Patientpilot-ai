/**
 * ============================================================
 * PatientPilot AI
 * Contact Preference Policy
 * ============================================================
 */

import {
  AICommunicationPreference,
  ChannelPreference,
  CommunicationChannel,
  CommunicationPurpose,
  ContactPreference,
  ConsentPreference,
} from "./contact-preference.types";

export interface CommunicationRequest {
  channel: CommunicationChannel;
  purpose: CommunicationPurpose;
  at?: Date;
  isAI?: boolean;
}

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export function canCommunicate(
  preference: ContactPreference,
  request: CommunicationRequest,
): PolicyDecision {
  if (preference.doNotDisturb && isWithinQuietHours(preference, request.at)) {
    return {
      allowed: false,
      reason: "Patient is in Do Not Disturb period.",
    };
  }

  const channel = getChannelPreference(
    preference.preferredChannels,
    request.channel,
  );

  if (!channel || !channel.enabled) {
    return {
      allowed: false,
      reason: `${request.channel} is disabled.`,
    };
  }

  const consent = getConsent(
    preference.consents,
    request.purpose,
  );

  if (!consent || consent.status !== "granted") {
    return {
      allowed: false,
      reason: `Consent not granted for ${request.purpose}.`,
    };
  }

  if (request.isAI && !isAIAllowed(preference.ai, request.channel)) {
    return {
      allowed: false,
      reason: `AI communication is not permitted via ${request.channel}.`,
    };
  }

  return {
    allowed: true,
  };
}

function getChannelPreference(
  channels: ChannelPreference[],
  channel: CommunicationChannel,
): ChannelPreference | undefined {
  return channels.find((c) => c.channel === channel);
}

function getConsent(
  consents: ConsentPreference[],
  purpose: CommunicationPurpose,
): ConsentPreference | undefined {
  return consents.find((c) => c.purpose === purpose);
}

function isWithinQuietHours(
  preference: ContactPreference,
  at: Date = new Date(),
): boolean {
  if (
    !preference.doNotDisturbStart ||
    !preference.doNotDisturbEnd
  ) {
    return false;
  }

  const current = toMinutes(
    at.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: preference.timezone,
    }),
  );

  const start = toMinutes(preference.doNotDisturbStart);
  const end = toMinutes(preference.doNotDisturbEnd);

  if (start <= end) {
    return current >= start && current <= end;
  }

  // Overnight window (e.g. 22:00–07:00)
  return current >= start || current <= end;
}

function isAIAllowed(
  ai: AICommunicationPreference,
  channel: CommunicationChannel,
): boolean {
  switch (channel) {
    case "phone":
      return ai.allowAIVoiceCalls;

    case "sms":
      return ai.allowAISMS;

    case "email":
      return ai.allowAIEmail;

    case "whatsapp":
      return ai.allowAIChat;

    case "push":
      return ai.allowAIChat;

    case "postal_mail":
      return false;

    default:
      return false;
  }
}

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}