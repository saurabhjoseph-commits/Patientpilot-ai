/**
 * ============================================================
 * PatientPilot AI
 * Referral Reward Service
 * ============================================================
 */

import {
  ReferralReward,
  ReferralRewardStatus,
} from "./referral-reward.types";

import {
  validateReferralReward,
  ValidationResult,
} from "./referral-reward-validator";

import {
  ReferralRewardPolicy,
  PolicyDecision,
} from "./referral-reward-policy";

export class ReferralRewardService {
  validate(
    reward: ReferralReward,
  ): ValidationResult {
    return validateReferralReward(reward);
  }

  canApprove(
    reward: ReferralReward,
  ): PolicyDecision {
    return ReferralRewardPolicy.canApprove(reward);
  }

  canIssue(
    reward: ReferralReward,
  ): PolicyDecision {
    return ReferralRewardPolicy.canIssue(reward);
  }

  canRedeem(
    reward: ReferralReward,
  ): PolicyDecision {
    return ReferralRewardPolicy.canRedeem(reward);
  }

  canExpire(
    reward: ReferralReward,
  ): PolicyDecision {
    return ReferralRewardPolicy.canExpire(reward);
  }

  canCancel(
    reward: ReferralReward,
  ): PolicyDecision {
    return ReferralRewardPolicy.canCancel(reward);
  }

  approve(
    reward: ReferralReward,
  ): ReferralReward {
    return {
      ...reward,
      status: "approved",
      approvedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  issue(
    reward: ReferralReward,
  ): ReferralReward {
    return {
      ...reward,
      status: "issued",
      issuedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  redeem(
    reward: ReferralReward,
    redeemedBy: string,
    redemptionReference?: string,
  ): ReferralReward {
    return {
      ...reward,
      status: "redeemed",
      redemption: {
        ...reward.redemption,
        redeemed: true,
        redeemedAt: new Date(),
        redeemedBy,
        redemptionReference,
      },
      updatedAt: new Date(),
    };
  }

  expire(
    reward: ReferralReward,
  ): ReferralReward {
    return {
      ...reward,
      status: "expired",
      expiration: {
        ...reward.expiration,
        expired: true,
        expiresAt:
          reward.expiration.expiresAt ?? new Date(),
      },
      updatedAt: new Date(),
    };
  }

  cancel(
    reward: ReferralReward,
  ): ReferralReward {
    return {
      ...reward,
      status: "cancelled",
      updatedAt: new Date(),
    };
  }

  updateStatus(
    reward: ReferralReward,
    status: ReferralRewardStatus,
  ): ReferralReward {
    return {
      ...reward,
      status,
      updatedAt: new Date(),
    };
  }

  updateNotes(
    reward: ReferralReward,
    notes?: string,
  ): ReferralReward {
    return {
      ...reward,
      notes,
      updatedAt: new Date(),
    };
  }

  isCompleted(
    reward: ReferralReward,
  ): boolean {
    return ReferralRewardPolicy.isCompleted(
      reward,
    );
  }

  isActive(
    reward: ReferralReward,
  ): boolean {
    return ReferralRewardPolicy.isActive(
      reward,
    );
  }

  isExpired(
    reward: ReferralReward,
    today?: Date,
  ): boolean {
    return ReferralRewardPolicy.isExpired(
      reward,
      today,
    );
  }
}

export const referralRewardService =
  new ReferralRewardService();