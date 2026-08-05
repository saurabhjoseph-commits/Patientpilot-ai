/**
 * ============================================================
 * PatientPilot AI
 * Customer Policy
 * ============================================================
 */

import { Customer } from "./customer.types";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export class CustomerPolicy {
  static canScheduleAppointment(
    customer: Customer,
  ): PolicyDecision {
    if (customer.status !== "active") {
      return {
        allowed: false,
        reason: "Customer is not active.",
      };
    }

    if (customer.flags.doNotSchedule) {
      return {
        allowed: false,
        reason: "Scheduling is disabled for this customer.",
      };
    }

    if (customer.flags.collectionsHold) {
      return {
        allowed: false,
        reason: "Outstanding balance prevents scheduling.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canReceiveRecall(
    customer: Customer,
  ): PolicyDecision {
    if (customer.status !== "active") {
      return {
        allowed: false,
        reason: "Inactive customers cannot receive recalls.",
      };
    }

    if (!customer.recall.nextRecallAt) {
      return {
        allowed: false,
        reason: "Recall date has not been scheduled.",
      };
    }

    return {
      allowed: true,
    };
  }

  static requiresManualApproval(
    customer: Customer,
  ): boolean {
    return customer.flags.requiresManualApproval;
  }

  static isVIP(
    customer: Customer,
  ): boolean {
    return (
      customer.flags.vip ||
      customer.loyaltyTier === "gold" ||
      customer.loyaltyTier === "platinum"
    );
  }

  static isHighRisk(
    customer: Customer,
  ): boolean {
    return customer.riskLevel === "high";
  }

  static isRecallOverdue(
    customer: Customer,
    today: Date = new Date(),
  ): boolean {
    const recallDate = customer.recall.nextRecallAt;

    if (!recallDate) {
      return false;
    }

    return recallDate < today;
  }

  static canArchive(
    customer: Customer,
  ): PolicyDecision {
    if (customer.status === "archived") {
      return {
        allowed: false,
        reason: "Customer is already archived.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canActivate(
    customer: Customer,
  ): PolicyDecision {
    if (customer.status === "active") {
      return {
        allowed: false,
        reason: "Customer is already active.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canDeactivate(
    customer: Customer,
  ): PolicyDecision {
    if (customer.status !== "active") {
      return {
        allowed: false,
        reason: "Only active customers can be deactivated.",
      };
    }

    return {
      allowed: true,
    };
  }
}