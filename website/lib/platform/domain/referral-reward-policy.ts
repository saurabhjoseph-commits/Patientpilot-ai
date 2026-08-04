/**
 * ============================================================
 * PatientPilot AI
 * Referral Reward Policy
 * ============================================================
 */

import { ReferralReward } from "./referral-reward.types";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export class ReferralRewardPolicy {
  static canApprove(
    reward: ReferralReward,
  ): PolicyDecision {
    if (reward.status !== "pending") {
      return {
        allowed: false,
        reason:
          "Only pending rewards can be approved.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canIssue(
    reward: ReferralReward,
  ): PolicyDecision {
    if (reward.status !== "approved") {
      return {
        allowed: false,
        reason:
          "Reward must be approved before issuing.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canRedeem(
    reward: ReferralReward,
  ): PolicyDecision {
    if (reward.status !== "issued") {
      return {
        allowed: false,
        reason:
          "Only issued rewards can be redeemed.",
      };
    }

    if (reward.redemption.redeemed) {
      return {
        allowed: false,
        reason:
          "Reward has already been redeemed.",
      };
    }

    if (this.isExpired(reward)) {
      return {
        allowed: false,
        reason:
          "Reward has expired.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canExpire(
    reward: ReferralReward,
  ): PolicyDecision {
    if (
      reward.status === "redeemed" ||
      reward.redemption.redeemed
    ) {
      return {
        allowed: false,
        reason:
          "Redeemed rewards cannot expire.",
      };
    }

    if (reward.expiration.expired) {
      return {
        allowed: false,
        reason:
          "Reward is already expired.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canCancel(
    reward: ReferralReward,
  ): PolicyDecision {
    if (
      reward.status === "redeemed" ||
      reward.redemption.redeemed
    ) {
      return {
        allowed: false,
        reason:
          "Redeemed rewards cannot be cancelled.",
      };
    }

    return {
      allowed: true,
    };
  }

  static isExpired(
    reward: ReferralReward,
    today: Date = new Date(),
  ): boolean {
    if (!reward.expiration.expiresAt) {
      return false;
    }

    return (
      today >= reward.expiration.expiresAt ||
      reward.expiration.expired
    );
  }

  static isCompleted(
    reward: ReferralReward,
  ): boolean {
    return (
      reward.status === "redeemed" ||
      reward.redemption.redeemed
    );
  }

  static isActive(
    reward: ReferralReward,
  ): boolean {
    return (
      reward.status === "issued" &&
      !this.isExpired(reward) &&
      !reward.redemption.redeemed
    );
  }
}