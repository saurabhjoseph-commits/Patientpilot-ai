/**
 * ============================================================
 * PatientPilot AI
 * Provider Availability Aggregate
 * ============================================================
 */

import {
  ProviderAvailability,
  ProviderAvailabilityException,
  ProviderAvailabilityRule,
  DayOfWeek,
} from "./provider-availability.types";

import { providerAvailabilityService } from "./provider-availability-service";

export class ProviderAvailabilityAggregate {
  constructor(
    private readonly availability: ProviderAvailability,
  ) {}

  static create(
    availability: ProviderAvailability,
  ): ProviderAvailabilityAggregate {
    const validation =
      providerAvailabilityService.validate(
        availability,
      );

    if (!validation.valid) {
      throw new Error(
        validation.errors.join("\n"),
      );
    }

    return new ProviderAvailabilityAggregate(
      availability,
    );
  }

  get value(): ProviderAvailability {
    return this.availability;
  }

  activate(): ProviderAvailabilityAggregate {
    const decision =
      providerAvailabilityService.canActivate(
        this.availability,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new ProviderAvailabilityAggregate(
      providerAvailabilityService.activate(
        this.availability,
      ),
    );
  }

  deactivate(): ProviderAvailabilityAggregate {
    const decision =
      providerAvailabilityService.canDeactivate(
        this.availability,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new ProviderAvailabilityAggregate(
      providerAvailabilityService.deactivate(
        this.availability,
      ),
    );
  }

  addRule(
    rule: ProviderAvailabilityRule,
  ): ProviderAvailabilityAggregate {
    const decision =
      providerAvailabilityService.canAddRule(
        this.availability,
        rule,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new ProviderAvailabilityAggregate(
      providerAvailabilityService.addRule(
        this.availability,
        rule,
      ),
    );
  }

  updateRule(
    rule: ProviderAvailabilityRule,
  ): ProviderAvailabilityAggregate {
    const decision =
      providerAvailabilityService.canUpdateRule(
        this.availability,
        rule.id,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new ProviderAvailabilityAggregate(
      providerAvailabilityService.updateRule(
        this.availability,
        rule,
      ),
    );
  }

  removeRule(
    ruleId: string,
  ): ProviderAvailabilityAggregate {
    const decision =
      providerAvailabilityService.canRemoveRule(
        this.availability,
        ruleId,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new ProviderAvailabilityAggregate(
      providerAvailabilityService.removeRule(
        this.availability,
        ruleId,
      ),
    );
  }

  addException(
    exception: ProviderAvailabilityException,
  ): ProviderAvailabilityAggregate {
    const decision =
      providerAvailabilityService.canAddException(
        this.availability,
        exception,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new ProviderAvailabilityAggregate(
      providerAvailabilityService.addException(
        this.availability,
        exception,
      ),
    );
  }

  removeException(
    exceptionId: string,
  ): ProviderAvailabilityAggregate {
    const decision =
      providerAvailabilityService.canRemoveException(
        this.availability,
        exceptionId,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new ProviderAvailabilityAggregate(
      providerAvailabilityService.removeException(
        this.availability,
        exceptionId,
      ),
    );
  }

  isActive(): boolean {
    return providerAvailabilityService.isActive(
      this.availability,
    );
  }

  isWorkingDay(
  dayOfWeek: DayOfWeek,
): boolean {
  return providerAvailabilityService.isWorkingDay(
    this.availability,
    dayOfWeek,
  );
}   

  hasException(
    date: string,
  ): boolean {
    return providerAvailabilityService.hasException(
      this.availability,
      date,
    );
  }

  hasRules(): boolean {
    return providerAvailabilityService.hasRules(
      this.availability,
    );
  }

  hasExceptions(): boolean {
    return providerAvailabilityService.hasExceptions(
      this.availability,
    );
  }
}