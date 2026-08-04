/**
 * ============================================================
 * PatientPilot AI
 * Referral Reward Domain Types
 * ============================================================
 */

export type ReferralRewardStatus =
  | "pending"
  | "approved"
  | "issued"
  | "redeemed"
  | "expired"
  | "cancelled";

export type ReferralRewardType =
  | "account_credit"
  | "gift_card"
  | "discount"
  | "loyalty_points"
  | "free_service"
  | "cash"
  | "custom";

export interface RewardValue {
  amount?: number;

  currency?: string;

  points?: number;

  description?: string;
}

export interface RewardRedemption {
  redeemed: boolean;

  redeemedAt?: Date;

  redeemedBy?: string;

  redemptionReference?: string;
}

export interface RewardExpiration {
  expiresAt?: Date;

  expired: boolean;
}

export interface ReferralReward {
  id: string;

  tenantId: string;

  referralId: string;

  customerId: string;

  type: ReferralRewardType;

  status: ReferralRewardStatus;

  value: RewardValue;

  redemption: RewardRedemption;

  expiration: RewardExpiration;

  issuedAt?: Date;

  approvedAt?: Date;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}