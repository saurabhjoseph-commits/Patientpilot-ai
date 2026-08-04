/**
 * ============================================================
 * PatientPilot AI
 * Referral Service
 * ============================================================
 */

import {
  Referral,
  ReferralStatus,
} from "./referral.types";

import {
  validateReferral,
  ValidationResult,
} from "./referral-validator";

import {
  ReferralPolicy,
  PolicyDecision,
} from "./referral-policy";

export class ReferralService {
  validate(
    referral: Referral,
  ): ValidationResult {
    return validateReferral(referral);
  }

  canQualify(
    referral: Referral,
  ): PolicyDecision {
    return ReferralPolicy.canQualify(referral);
  }

  canConvert(
    referral: Referral,
  ): PolicyDecision {
    return ReferralPolicy.canConvert(referral);
  }

  canReward(
    referral: Referral,
  ): PolicyDecision {
    return ReferralPolicy.canReward(referral);
  }

  canCancel(
    referral: Referral,
  ): PolicyDecision {
    return ReferralPolicy.canCancel(referral);
  }

  canExpire(
    referral: Referral,
  ): PolicyDecision {
    return ReferralPolicy.canExpire(referral);
  }

  qualify(
    referral: Referral,
  ): Referral {
    return {
      ...referral,
      status: "qualified",
      conversion: {
        ...referral.conversion,
        qualified: true,
        qualifiedAt: new Date(),
      },
      updatedAt: new Date(),
    };
  }

  convert(
    referral: Referral,
    firstAppointmentId: string,
    dealId?: string,
  ): Referral {
    return {
      ...referral,
      status: "converted",
      conversion: {
        ...referral.conversion,
        converted: true,
        convertedAt: new Date(),
        firstAppointmentId,
        dealId,
      },
      updatedAt: new Date(),
    };
  }

  reward(
    referral: Referral,
  ): Referral {
    return {
      ...referral,
      status: "rewarded",
      updatedAt: new Date(),
    };
  }

  cancel(
    referral: Referral,
  ): Referral {
    return {
      ...referral,
      status: "cancelled",
      updatedAt: new Date(),
    };
  }

  expire(
    referral: Referral,
  ): Referral {
    return {
      ...referral,
      status: "expired",
      updatedAt: new Date(),
    };
  }

  updateStatus(
    referral: Referral,
    status: ReferralStatus,
  ): Referral {
    return {
      ...referral,
      status,
      updatedAt: new Date(),
    };
  }

  addNotes(
    referral: Referral,
    notes: string,
  ): Referral {
    return {
      ...referral,
      notes,
      updatedAt: new Date(),
    };
  }

  isCompleted(
    referral: Referral,
  ): boolean {
    return ReferralPolicy.isCompleted(referral);
  }

  isPending(
    referral: Referral,
  ): boolean {
    return ReferralPolicy.isPending(referral);
  }

  isExpired(
    referral: Referral,
    today?: Date,
    expiryDays?: number,
  ): boolean {
    return ReferralPolicy.isExpired(
      referral,
      today,
      expiryDays,
    );
  }
}

export const referralService =
  new ReferralService();