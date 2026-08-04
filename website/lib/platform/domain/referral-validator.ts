/**
 * ============================================================
 * PatientPilot AI
 * Referral Validator
 * ============================================================
 */

import {
  Referral,
  ReferralStatus,
} from "./referral.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateReferral(
  referral: Referral,
): ValidationResult {
  const errors: string[] = [];

  if (!referral.id.trim()) {
    errors.push("Referral ID is required.");
  }

  if (!referral.tenantId.trim()) {
    errors.push("Tenant ID is required.");
  }

  validateReferrer(referral, errors);
  validateRecipient(referral, errors);
  validateCampaign(referral, errors);
  validateConversion(referral, errors);
  validateStatus(referral.status, referral, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateReferrer(
  referral: Referral,
  errors: string[],
): void {
  if (!referral.referrer.customerId.trim()) {
    errors.push("Referrer customer ID is required.");
  }
}

function validateRecipient(
  referral: Referral,
  errors: string[],
): void {
  const recipient = referral.recipient;

  if (
    !recipient.leadId &&
    !recipient.customerId
  ) {
    errors.push(
      "Recipient must reference a lead or customer.",
    );
  }

  if (
    recipient.customerId &&
    recipient.customerId ===
      referral.referrer.customerId
  ) {
    errors.push(
      "A customer cannot refer themselves.",
    );
  }
}

function validateCampaign(
  referral: Referral,
  errors: string[],
): void {
  if (!referral.campaign.source) {
    errors.push(
      "Referral source is required.",
    );
  }
}

function validateConversion(
  referral: Referral,
  errors: string[],
): void {
  const conversion = referral.conversion;

  if (
    conversion.converted &&
    !conversion.convertedAt
  ) {
    errors.push(
      "Converted referrals require convertedAt.",
    );
  }

  if (
    conversion.qualified &&
    !conversion.qualifiedAt
  ) {
    errors.push(
      "Qualified referrals require qualifiedAt.",
    );
  }

  if (
    conversion.converted &&
    !conversion.firstAppointmentId
  ) {
    errors.push(
      "Converted referrals require a first appointment.",
    );
  }
}

function validateStatus(
  status: ReferralStatus,
  referral: Referral,
  errors: string[],
): void {
  switch (status) {
    case "qualified":
      if (!referral.conversion.qualified) {
        errors.push(
          "Qualified status requires qualified conversion.",
        );
      }
      break;

    case "converted":
    case "rewarded":
      if (!referral.conversion.converted) {
        errors.push(
          `${status} status requires a converted referral.`,
        );
      }
      break;
  }
}