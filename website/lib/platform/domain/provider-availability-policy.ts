/**
 * ============================================================
 * PatientPilot AI
 * Provider Availability Policy
 * ============================================================
 */

import {
  ProviderAvailability,
  ProviderAvailabilityException,
  ProviderAvailabilityRule,
} from "./provider-availability.types";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export class ProviderAvailabilityPolicy {
  static canActivate(
    availability: ProviderAvailability,
  ): PolicyDecision {
    if (availability.status === "active") {
      return {
        allowed: false,
        reason:
          "Availability is already active.",
      };
    }

    return { allowed: true };
  }

  static canDeactivate(
    availability: ProviderAvailability,
  ): PolicyDecision {
    if (availability.status === "inactive") {
      return {
        allowed: false,
        reason:
          "Availability is already inactive.",
      };
    }

    return { allowed: true };
  }

  static canAddRule(
    availability: ProviderAvailability,
    rule: ProviderAvailabilityRule,
  ): PolicyDecision {
    const exists = availability.rules.some(
      (r) => r.id === rule.id,
    );

    if (exists) {
      return {
        allowed: false,
        reason:
          "Availability rule already exists.",
      };
    }

    return { allowed: true };
  }

  static canUpdateRule(
    availability: ProviderAvailability,
    ruleId: string,
  ): PolicyDecision {
    const exists = availability.rules.some(
      (r) => r.id === ruleId,
    );

    if (!exists) {
      return {
        allowed: false,
        reason:
          "Availability rule not found.",
      };
    }

    return { allowed: true };
  }

  static canRemoveRule(
    availability: ProviderAvailability,
    ruleId: string,
  ): PolicyDecision {
    return this.canUpdateRule(
      availability,
      ruleId,
    );
  }

  static canAddException(
    availability: ProviderAvailability,
    exception: ProviderAvailabilityException,
  ): PolicyDecision {
    const exists =
      availability.exceptions.some(
        (e) => e.id === exception.id,
      );

    if (exists) {
      return {
        allowed: false,
        reason:
          "Availability exception already exists.",
      };
    }

    return { allowed: true };
  }

  static canRemoveException(
    availability: ProviderAvailability,
    exceptionId: string,
  ): PolicyDecision {
    const exists =
      availability.exceptions.some(
        (e) => e.id === exceptionId,
      );

    if (!exists) {
      return {
        allowed: false,
        reason:
          "Availability exception not found.",
      };
    }

    return { allowed: true };
  }

  static isWorkingDay(
    availability: ProviderAvailability,
    dayOfWeek: string,
  ): boolean {
    return availability.rules.some(
      (rule) =>
        rule.enabled &&
        rule.type ===
          "working_hours" &&
        rule.dayOfWeek === dayOfWeek,
    );
  }

  static hasException(
    availability: ProviderAvailability,
    date: string,
  ): boolean {
    return availability.exceptions.some(
      (exception) =>
        exception.date === date,
    );
  }

  static isActive(
    availability: ProviderAvailability,
  ): boolean {
    return (
      availability.status ===
      "active"
    );
  }

  static hasRules(
    availability: ProviderAvailability,
  ): boolean {
    return (
      availability.rules.length > 0
    );
  }

  static hasExceptions(
    availability: ProviderAvailability,
  ): boolean {
    return (
      availability.exceptions.length >
      0
    );
  }
}