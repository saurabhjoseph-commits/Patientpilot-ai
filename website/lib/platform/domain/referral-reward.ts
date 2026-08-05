/**
 * ============================================================
 * PatientPilot AI
 * Referral Reward Aggregate Root
 * ============================================================
 */

import {
  ReferralReward,
  ReferralRewardStatus,
  ReferralRewardType,
  RewardExpiration,
  RewardRedemption,
  RewardValue,
} from "./referral-reward.types";

export interface CreateReferralRewardParams {
  id: string;
  tenantId: string;
  referralId: string;
  customerId: string;
  type: ReferralRewardType;
  value: RewardValue;
  expiresAt?: Date;
}

export class ReferralRewardAggregate {
  static create(
    params: CreateReferralRewardParams,
  ): ReferralReward {
    const now = new Date();

    return {
      id: params.id,

      tenantId: params.tenantId,

      referralId: params.referralId,

      customerId: params.customerId,

      type: params.type,

      status: "pending",

      value: {
        ...params.value,
      },

      redemption: defaultRedemption(),

      expiration: defaultExpiration(
        params.expiresAt,
      ),

      approvedAt: undefined,

      issuedAt: undefined,

      notes: undefined,

      createdAt: now,

      updatedAt: now,
    };
  }

  static updateStatus(
    reward: ReferralReward,
    status: ReferralRewardStatus,
  ): ReferralReward {
    return {
      ...reward,
      status,
      updatedAt: new Date(),
    };
  }

  static updateValue(
    reward: ReferralReward,
    value: Partial<RewardValue>,
  ): ReferralReward {
    return {
      ...reward,
      value: {
        ...reward.value,
        ...value,
      },
      updatedAt: new Date(),
    };
  }

  static updateExpiration(
    reward: ReferralReward,
    expiration: Partial<RewardExpiration>,
  ): ReferralReward {
    return {
      ...reward,
      expiration: {
        ...reward.expiration,
        ...expiration,
      },
      updatedAt: new Date(),
    };
  }

  static updateRedemption(
    reward: ReferralReward,
    redemption: Partial<RewardRedemption>,
  ): ReferralReward {
    return {
      ...reward,
      redemption: {
        ...reward.redemption,
        ...redemption,
      },
      updatedAt: new Date(),
    };
  }

  static updateNotes(
    reward: ReferralReward,
    notes?: string,
  ): ReferralReward {
    return {
      ...reward,
      notes,
      updatedAt: new Date(),
    };
  }
}

function defaultRedemption(): RewardRedemption {
  return {
    redeemed: false,
    redeemedAt: undefined,
    redeemedBy: undefined,
    redemptionReference: undefined,
  };
}

function defaultExpiration(
  expiresAt?: Date,
): RewardExpiration {
  return {
    expiresAt,
    expired: false,
  };
}