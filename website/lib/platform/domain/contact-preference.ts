/**
 * ============================================================
 * PatientPilot AI
 * Contact Preference Aggregate Root
 * ============================================================
 */

import {
  AICommunicationPreference,
  ChannelPreference,
  CommunicationChannel,
  CommunicationPurpose,
  ConsentPreference,
  ContactPreference,
  ContactTimePreference,
  LanguagePreference,
} from "./contact-preference.types";

export class ContactPreferenceAggregate {
  static create(
    params: {
      id: string;
      tenantId: string;
      customerId: string;
      timezone: string;
      preferredLanguage?: LanguagePreference;
      preferredContactTime?: ContactTimePreference;
    },
  ): ContactPreference {
    const now = new Date();

    return {
      id: params.id,
      tenantId: params.tenantId,
      customerId: params.customerId,

      timezone: params.timezone,

      preferredLanguage:
        params.preferredLanguage ?? "en",

      preferredContactTime:
        params.preferredContactTime ?? "anytime",

      preferredChannels: [],

      consents: [],

      ai: defaultAISettings(),

      doNotDisturb: false,

      createdAt: now,

      updatedAt: now,
    };
  }

  static addChannel(
    preference: ContactPreference,
    channel: ChannelPreference,
  ): ContactPreference {
    const exists = preference.preferredChannels.some(
      (c) => c.channel === channel.channel,
    );

    if (exists) {
      return preference;
    }

    return {
      ...preference,
      preferredChannels: [
        ...preference.preferredChannels,
        channel,
      ],
      updatedAt: new Date(),
    };
  }

  static removeChannel(
    preference: ContactPreference,
    channel: CommunicationChannel,
  ): ContactPreference {
    return {
      ...preference,
      preferredChannels:
        preference.preferredChannels.filter(
          (c) => c.channel !== channel,
        ),
      updatedAt: new Date(),
    };
  }

  static upsertConsent(
    preference: ContactPreference,
    consent: ConsentPreference,
  ): ContactPreference {
    return {
      ...preference,
      consents: [
        ...preference.consents.filter(
          (c) => c.purpose !== consent.purpose,
        ),
        consent,
      ],
      updatedAt: new Date(),
    };
  }

  static revokeConsent(
    preference: ContactPreference,
    purpose: CommunicationPurpose,
  ): ContactPreference {
    return {
      ...preference,
      consents: preference.consents.map((c) =>
        c.purpose === purpose
          ? {
              ...c,
              status: "withdrawn",
              withdrawnAt: new Date(),
            }
          : c,
      ),
      updatedAt: new Date(),
    };
  }

  static enableDoNotDisturb(
    preference: ContactPreference,
    start: string,
    end: string,
  ): ContactPreference {
    return {
      ...preference,
      doNotDisturb: true,
      doNotDisturbStart: start,
      doNotDisturbEnd: end,
      updatedAt: new Date(),
    };
  }

  static disableDoNotDisturb(
    preference: ContactPreference,
  ): ContactPreference {
    return {
      ...preference,
      doNotDisturb: false,
      doNotDisturbStart: undefined,
      doNotDisturbEnd: undefined,
      updatedAt: new Date(),
    };
  }

  static updateAISettings(
    preference: ContactPreference,
    ai: Partial<AICommunicationPreference>,
  ): ContactPreference {
    return {
      ...preference,
      ai: {
        ...preference.ai,
        ...ai,
      },
      updatedAt: new Date(),
    };
  }
}

function defaultAISettings(): AICommunicationPreference {
  return {
    allowAIVoiceCalls: true,
    allowAIChat: true,
    allowAISMS: true,
    allowAIEmail: true,
    allowAIAppointmentScheduling: true,
  };
}