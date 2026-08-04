/**
 * ============================================================
 * PatientPilot AI
 * Referral Policy
 * ============================================================
 */

import { Referral } from "./referral.types";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export class ReferralPolicy {
  static canQualify(
    referral: Referral,
  ): PolicyDecision {
    if (referral.status !== "registered") {
      return {
        allowed: false,
        reason:
          "Only registered referrals can be qualified.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canConvert(
    referral: Referral,
  ): PolicyDecision {
    if (!referral.conversion.qualified) {
      return {
        allowed: false,
        reason:
          "Referral must be qualified before conversion.",
      };
    }

    if (referral.conversion.converted) {
      return {
        allowed: false,
        reason:
          "Referral has already been converted.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canReward(
    referral: Referral,
  ): PolicyDecision {
    if (!referral.conversion.converted) {
      return {
        allowed: false,
        reason:
          "Referral must be converted before rewarding.",
      };
    }

    if (referral.status === "rewarded") {
      return {
        allowed: false,
        reason:
          "Referral has already been rewarded.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canCancel(
    referral: Referral,
  ): PolicyDecision {
    if (
      referral.status === "rewarded" ||
      referral.status === "converted"
    ) {
      return {
        allowed: false,
        reason:
          "Converted or rewarded referrals cannot be cancelled.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canExpire(
    referral: Referral,
  ): PolicyDecision {
    if (
      referral.status === "converted" ||
      referral.status === "rewarded"
    ) {
      return {
        allowed: false,
        reason:
          "Completed referrals cannot expire.",
      };
    }

    return {
      allowed: true,
    };
  }

  static isCompleted(
    referral: Referral,
  ): boolean {
    return (
      referral.status === "converted" ||
      referral.status === "rewarded"
    );
  }

  static isPending(
    referral: Referral,
  ): boolean {
    return (
      referral.status === "pending" ||
      referral.status === "invited" ||
      referral.status === "registered"
    );
  }

  static isExpired(
    referral: Referral,
    today: Date = new Date(),
    expiryDays = 90,
  ): boolean {
    const expiresAt = new Date(
      referral.createdAt,
    );

    expiresAt.setDate(
      expiresAt.getDate() + expiryDays,
    );

    return (
      today >= expiresAt &&
      !this.isCompleted(referral)
    );
  }
}