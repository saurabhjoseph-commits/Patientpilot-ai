/**
 * ============================================================
 * PatientPilot AI
 * Contact Preference Service
 * ============================================================
 */

import {
  ChannelPreference,
  CommunicationChannel,
  CommunicationPurpose,
  ContactPreference,
  ConsentPreference,
} from "./contact-preference.types";

import {
  validateContactPreference,
  ValidationResult,
} from "./contact-preference-validator";

import {
  canCommunicate,
  CommunicationRequest,
  PolicyDecision,
} from "./contact-preference-policy";

export class ContactPreferenceService {
  validate(
    preference: ContactPreference,
  ): ValidationResult {
    return validateContactPreference(preference);
  }

  canCommunicate(
    preference: ContactPreference,
    request: CommunicationRequest,
  ): PolicyDecision {
    return canCommunicate(preference, request);
  }

  getPrimaryChannel(
    preference: ContactPreference,
  ): ChannelPreference | undefined {
    return preference.preferredChannels.find(
      (channel) => channel.primary,
    );
  }

  isChannelEnabled(
    preference: ContactPreference,
    channel: CommunicationChannel,
  ): boolean {
    return preference.preferredChannels.some(
      (item) =>
        item.channel === channel &&
        item.enabled,
    );
  }

  hasConsent(
    preference: ContactPreference,
    purpose: CommunicationPurpose,
  ): boolean {
    return preference.consents.some(
      (consent) =>
        consent.purpose === purpose &&
        consent.status === "granted",
    );
  }

  getConsent(
    preference: ContactPreference,
    purpose: CommunicationPurpose,
  ): ConsentPreference | undefined {
    return preference.consents.find(
      (consent) => consent.purpose === purpose,
    );
  }

  enableChannel(
    preference: ContactPreference,
    channel: CommunicationChannel,
  ): ContactPreference {
    return {
      ...preference,
      preferredChannels:
        preference.preferredChannels.map((item) =>
          item.channel === channel
            ? {
                ...item,
                enabled: true,
              }
            : item,
        ),
      updatedAt: new Date(),
    };
  }

  disableChannel(
    preference: ContactPreference,
    channel: CommunicationChannel,
  ): ContactPreference {
    return {
      ...preference,
      preferredChannels:
        preference.preferredChannels.map((item) =>
          item.channel === channel
            ? {
                ...item,
                enabled: false,
              }
            : item,
        ),
      updatedAt: new Date(),
    };
  }

  updateConsent(
    preference: ContactPreference,
    consent: ConsentPreference,
  ): ContactPreference {
    const consents =
      preference.consents.filter(
        (item) =>
          item.purpose !== consent.purpose,
      );

    consents.push(consent);

    return {
      ...preference,
      consents,
      updatedAt: new Date(),
    };
  }

  updatePreferredLanguage(
    preference: ContactPreference,
    language: ContactPreference["preferredLanguage"],
  ): ContactPreference {
    return {
      ...preference,
      preferredLanguage: language,
      updatedAt: new Date(),
    };
  }

  updatePreferredContactTime(
    preference: ContactPreference,
    contactTime: ContactPreference["preferredContactTime"],
  ): ContactPreference {
    return {
      ...preference,
      preferredContactTime: contactTime,
      updatedAt: new Date(),
    };
  }
}

export const contactPreferenceService =
  new ContactPreferenceService();