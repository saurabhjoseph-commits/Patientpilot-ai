/**
 * ============================================================
 * PatientPilot AI
 * Referral Reward Validator
 * ============================================================
 */

import {
  ReferralReward,
  ReferralRewardStatus,
} from "./referral-reward.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateReferralReward(
  reward: ReferralReward,
): ValidationResult {
  const errors: string[] = [];

  if (!reward.id.trim()) {
    errors.push("Referral reward ID is required.");
  }

  if (!reward.tenantId.trim()) {
    errors.push("Tenant ID is required.");
  }

  if (!reward.referralId.trim()) {
    errors.push("Referral ID is required.");
  }

  if (!reward.customerId.trim()) {
    errors.push("Customer ID is required.");
  }

  validateRewardValue(reward, errors);
  validateRedemption(reward, errors);
  validateExpiration(reward, errors);
  validateStatus(reward.status, reward, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateRewardValue(
  reward: ReferralReward,
  errors: string[],
): void {
  const value = reward.value;

  if (
    value.amount !== undefined &&
    value.amount < 0
  ) {
    errors.push(
      "Reward amount cannot be negative.",
    );
  }

  if (
    value.points !== undefined &&
    value.points < 0
  ) {
    errors.push(
      "Reward points cannot be negative.",
    );
  }

  if (
    value.amount !== undefined &&
    !value.currency?.trim()
  ) {
    errors.push(
      "Currency is required when a reward amount is specified.",
    );
  }

  if (
    value.amount === undefined &&
    value.points === undefined &&
    !value.description?.trim()
  ) {
    errors.push(
      "Reward must define an amount, points, or description.",
    );
  }
}

function validateRedemption(
  reward: ReferralReward,
  errors: string[],
): void {
  const redemption = reward.redemption;

  if (
    redemption.redeemed &&
    !redemption.redeemedAt
  ) {
    errors.push(
      "Redeemed rewards require redeemedAt.",
    );
  }

  if (
    redemption.redeemed &&
    !redemption.redeemedBy?.trim()
  ) {
    errors.push(
      "Redeemed rewards require redeemedBy.",
    );
  }
}

function validateExpiration(
  reward: ReferralReward,
  errors: string[],
): void {
  const expiration = reward.expiration;

  if (
    expiration.expired &&
    !expiration.expiresAt
  ) {
    errors.push(
      "Expired rewards require expiresAt.",
    );
  }

  if (
    expiration.expiresAt &&
    expiration.expiresAt < reward.createdAt
  ) {
    errors.push(
      "Expiration date cannot be earlier than the creation date.",
    );
  }
}

function validateStatus(
  status: ReferralRewardStatus,
  reward: ReferralReward,
  errors: string[],
): void {
  switch (status) {
    case "approved":
      if (!reward.approvedAt) {
        errors.push(
          "Approved rewards require approvedAt.",
        );
      }
      break;

    case "issued":
      if (!reward.issuedAt) {
        errors.push(
          "Issued rewards require issuedAt.",
        );
      }
      break;

    case "redeemed":
      if (!reward.redemption.redeemed) {
        errors.push(
          "Redeemed status requires redemption to be completed.",
        );
      }
      break;

    case "expired":
      if (!reward.expiration.expired) {
        errors.push(
          "Expired status requires expiration to be marked.",
        );
      }
      break;
  }
}