/**
 * ============================================================
 * PatientPilot AI
 * Provider Availability Validator
 * ============================================================
 */

import {
  ProviderAvailability,
  ProviderAvailabilityException,
  ProviderAvailabilityRule,
} from "./provider-availability.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateProviderAvailability(
  availability: ProviderAvailability,
): ValidationResult {
  const errors: string[] = [];

  validateIdentity(
    availability,
    errors,
  );

  validateConfiguration(
    availability,
    errors,
  );

  validateRules(
    availability.rules,
    errors,
  );

  validateExceptions(
    availability.exceptions,
    errors,
  );

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateIdentity(
  availability: ProviderAvailability,
  errors: string[],
): void {
  if (!availability.id.trim()) {
    errors.push(
      "Availability ID is required.",
    );
  }

  if (!availability.tenantId.trim()) {
    errors.push(
      "Tenant ID is required.",
    );
  }

  if (!availability.clinicId.trim()) {
    errors.push(
      "Clinic ID is required.",
    );
  }

  if (!availability.providerId.trim()) {
    errors.push(
      "Provider ID is required.",
    );
  }
}

function validateConfiguration(
  availability: ProviderAvailability,
  errors: string[],
): void {
  if (!availability.timezone.trim()) {
    errors.push(
      "Timezone is required.",
    );
  }

  if (
    availability.slotDurationMinutes <=
    0
  ) {
    errors.push(
      "Slot duration must be greater than zero.",
    );
  }
}

function validateRules(
  rules: ProviderAvailabilityRule[],
  errors: string[],
): void {
  const ids = new Set<string>();

  for (const rule of rules) {
    if (!rule.id.trim()) {
      errors.push(
        "Availability rule ID is required.",
      );
    }

    if (ids.has(rule.id)) {
      errors.push(
        `Duplicate availability rule '${rule.id}'.`,
      );
    }

    ids.add(rule.id);

    validateTimeRange(
      rule.timeRange.startsAt,
      rule.timeRange.endsAt,
      `Rule '${rule.id}'`,
      errors,
    );
  }
}

function validateExceptions(
  exceptions: ProviderAvailabilityException[],
  errors: string[],
): void {
  const ids = new Set<string>();

  for (const exception of exceptions) {
    if (!exception.id.trim()) {
      errors.push(
        "Availability exception ID is required.",
      );
    }

    if (ids.has(exception.id)) {
      errors.push(
        `Duplicate availability exception '${exception.id}'.`,
      );
    }

    ids.add(exception.id);

    if (!exception.date.trim()) {
      errors.push(
        `Exception '${exception.id}' requires a date.`,
      );
    }

    if (exception.timeRange) {
      validateTimeRange(
        exception.timeRange.startsAt,
        exception.timeRange.endsAt,
        `Exception '${exception.id}'`,
        errors,
      );
    }
  }
}

function validateTimeRange(
  startsAt: string,
  endsAt: string,
  context: string,
  errors: string[],
): void {
  if (!startsAt.trim()) {
    errors.push(
      `${context}: start time is required.`,
    );
  }

  if (!endsAt.trim()) {
    errors.push(
      `${context}: end time is required.`,
    );
  }

  if (
    startsAt.trim() &&
    endsAt.trim() &&
    startsAt >= endsAt
  ) {
    errors.push(
      `${context}: start time must be before end time.`,
    );
  }
}