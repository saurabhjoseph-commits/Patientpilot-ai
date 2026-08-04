/**
 * ============================================================
 * PatientPilot AI
 * Contact Preference Validator
 * ============================================================
 */

import {
  ContactPreference,
  ChannelPreference,
  ConsentPreference,
} from "./contact-preference.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateContactPreference(
  preference: ContactPreference,
): ValidationResult {
  const errors: string[] = [];

  if (!preference.id.trim()) {
    errors.push("Contact preference ID is required.");
  }

  if (!preference.tenantId.trim()) {
    errors.push("Tenant ID is required.");
  }

  if (!preference.customerId.trim()) {
    errors.push("Customer ID is required.");
  }

  if (!preference.timezone.trim()) {
    errors.push("Timezone is required.");
  }

  if (preference.preferredChannels.length === 0) {
    errors.push("At least one communication channel is required.");
  }

  validateChannels(preference.preferredChannels, errors);
  validateConsents(preference.consents, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateChannels(
  channels: ChannelPreference[],
  errors: string[],
): void {
  const primaryChannels = channels.filter((c) => c.primary);

  if (primaryChannels.length === 0) {
    errors.push("One primary communication channel is required.");
  }

  if (primaryChannels.length > 1) {
    errors.push("Only one primary communication channel is allowed.");
  }

  const duplicates = new Set<string>();

  for (const channel of channels) {
    if (duplicates.has(channel.channel)) {
      errors.push(
        `Duplicate communication channel: ${channel.channel}.`,
      );
    }

    duplicates.add(channel.channel);
  }
}

function validateConsents(
  consents: ConsentPreference[],
  errors: string[],
): void {
  const purposes = new Set<string>();

  for (const consent of consents) {
    if (purposes.has(consent.purpose)) {
      errors.push(
        `Duplicate consent for purpose: ${consent.purpose}.`,
      );
    }

    purposes.add(consent.purpose);

    if (
      consent.status === "granted" &&
      !consent.grantedAt
    ) {
      errors.push(
        `Granted consent requires grantedAt (${consent.purpose}).`,
      );
    }

    if (
      consent.status === "withdrawn" &&
      !consent.withdrawnAt
    ) {
      errors.push(
        `Withdrawn consent requires withdrawnAt (${consent.purpose}).`,
      );
    }
  }
}