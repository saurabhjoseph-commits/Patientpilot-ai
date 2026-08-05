/**
 * ============================================================
 * PatientPilot AI
 * Provider Availability Service
 * ============================================================
 */

import {
  ProviderAvailability,
  ProviderAvailabilityException,
  ProviderAvailabilityRule,
  AvailabilityStatus,
  DayOfWeek,
} from "./provider-availability.types";

import {
  validateProviderAvailability,
  ValidationResult,
} from "./provider-availability-validator";

import {
  ProviderAvailabilityPolicy,
  PolicyDecision,
} from "./provider-availability-policy";

export class ProviderAvailabilityService {
  validate(
    availability: ProviderAvailability,
  ): ValidationResult {
    return validateProviderAvailability(
      availability,
    );
  }

  canActivate(
    availability: ProviderAvailability,
  ): PolicyDecision {
    return ProviderAvailabilityPolicy.canActivate(
      availability,
    );
  }

  canDeactivate(
    availability: ProviderAvailability,
  ): PolicyDecision {
    return ProviderAvailabilityPolicy.canDeactivate(
      availability,
    );
  }

  canAddRule(
    availability: ProviderAvailability,
    rule: ProviderAvailabilityRule,
  ): PolicyDecision {
    return ProviderAvailabilityPolicy.canAddRule(
      availability,
      rule,
    );
  }

  canUpdateRule(
  availability: ProviderAvailability,
  ruleId: string,
): PolicyDecision {
  return ProviderAvailabilityPolicy.canUpdateRule(
    availability,
    ruleId,
  );
}

  canRemoveRule(
    availability: ProviderAvailability,
    ruleId: string,
  ): PolicyDecision {
    return ProviderAvailabilityPolicy.canRemoveRule(
      availability,
      ruleId,
    );
  }

  canAddException(
    availability: ProviderAvailability,
    exceptionItem: ProviderAvailabilityException,
  ): PolicyDecision {
    return ProviderAvailabilityPolicy.canAddException(
      availability,
      exceptionItem,
    );
  }

  canRemoveException(
    availability: ProviderAvailability,
    exceptionId: string,
  ): PolicyDecision {
    return ProviderAvailabilityPolicy.canRemoveException(
      availability,
      exceptionId,
    );
  }

  activate(
    availability: ProviderAvailability,
  ): ProviderAvailability {
    return {
      ...availability,
      status: "active",
      updatedAt: new Date().toISOString(),
    };
  }

  deactivate(
    availability: ProviderAvailability,
  ): ProviderAvailability {
    return {
      ...availability,
      status: "inactive",
      updatedAt: new Date().toISOString(),
    };
  }

  addRule(
    availability: ProviderAvailability,
    rule: ProviderAvailabilityRule,
  ): ProviderAvailability {
    return {
      ...availability,
      rules: [
        ...availability.rules,
        rule,
      ],
      updatedAt: new Date().toISOString(),
    };
  }

  updateRule(
    availability: ProviderAvailability,
    rule: ProviderAvailabilityRule,
  ): ProviderAvailability {
    return {
      ...availability,
      rules: availability.rules.map(
        (existing) =>
          existing.id === rule.id
            ? rule
            : existing,
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  removeRule(
    availability: ProviderAvailability,
    ruleId: string,
  ): ProviderAvailability {
    return {
      ...availability,
      rules: availability.rules.filter(
        (rule) => rule.id !== ruleId,
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  addException(
    availability: ProviderAvailability,
    exceptionItem: ProviderAvailabilityException,
  ): ProviderAvailability {
    return {
      ...availability,
      exceptions: [
        ...availability.exceptions,
        exceptionItem,
      ],
      updatedAt: new Date().toISOString(),
    };
  }

  removeException(
    availability: ProviderAvailability,
    exceptionId: string,
  ): ProviderAvailability {
    return {
      ...availability,
      exceptions:
        availability.exceptions.filter(
          (item) =>
            item.id !== exceptionId,
        ),
      updatedAt: new Date().toISOString(),
    };
  }

  updateStatus(
    availability: ProviderAvailability,
    status: AvailabilityStatus,
  ): ProviderAvailability {
    return {
      ...availability,
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  isWorkingDay(
    availability: ProviderAvailability,
    dayOfWeek: DayOfWeek,
  ): boolean {
    return ProviderAvailabilityPolicy.isWorkingDay(
      availability,
      dayOfWeek,
    );
  }

  hasException(
    availability: ProviderAvailability,
    date: string,
  ): boolean {
    return ProviderAvailabilityPolicy.hasException(
      availability,
      date,
    );
  }

  isActive(
    availability: ProviderAvailability,
  ): boolean {
    return ProviderAvailabilityPolicy.isActive(
      availability,
    );
  }

  hasRules(
    availability: ProviderAvailability,
  ): boolean {
    return ProviderAvailabilityPolicy.hasRules(
      availability,
    );
  }

  hasExceptions(
    availability: ProviderAvailability,
  ): boolean {
    return ProviderAvailabilityPolicy.hasExceptions(
      availability,
    );
  }
}

export const providerAvailabilityService =
  new ProviderAvailabilityService();