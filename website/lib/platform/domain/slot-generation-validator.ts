/**
 * ============================================================
 * PatientPilot AI
 * Slot Generation Validator
 * ============================================================
 */

import {
  SlotGeneration,
  SlotGenerationStatus,
} from "./slot-generation.types";

export interface ValidationResult {
  valid: boolean;

  errors: string[];
}

export function validateSlotGeneration(
  generation: SlotGeneration,
): ValidationResult {
  const errors: string[] = [];

  validateIdentity(
    generation,
    errors,
  );

  validateRange(
    generation,
    errors,
  );

  validateAvailability(
    generation,
    errors,
  );

  validateOptions(
    generation,
    errors,
  );

  validateStatus(
    generation.status,
    generation,
    errors,
  );

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateIdentity(
  generation: SlotGeneration,
  errors: string[],
): void {
  if (!generation.id.trim()) {
    errors.push(
      "Generation ID is required.",
    );
  }

  if (!generation.tenantId.trim()) {
    errors.push(
      "Tenant ID is required.",
    );
  }

  if (!generation.clinicId.trim()) {
    errors.push(
      "Clinic ID is required.",
    );
  }

  if (!generation.providerId.trim()) {
    errors.push(
      "Provider ID is required.",
    );
  }
}

function validateRange(
  generation: SlotGeneration,
  errors: string[],
): void {
  const { startsAt, endsAt } =
    generation.range;

  if (startsAt >= endsAt) {
    errors.push(
      "Generation range must have a valid start and end time.",
    );
  }
}

function validateAvailability(
  generation: SlotGeneration,
  errors: string[],
): void {
  if (
    generation.availability.providerId !==
    generation.providerId
  ) {
    errors.push(
      "Availability provider does not match generation provider.",
    );
  }

  if (
    generation.availability.clinicId !==
    generation.clinicId
  ) {
    errors.push(
      "Availability clinic does not match generation clinic.",
    );
  }

  if (
    generation.availability.tenantId !==
    generation.tenantId
  ) {
    errors.push(
      "Availability tenant does not match generation tenant.",
    );
  }
}

function validateOptions(
  generation: SlotGeneration,
  errors: string[],
): void {
  const {
    overwriteExisting,
    includeExceptions,
    includeBreaks,
    generateFutureOnly,
  } = generation.options;

  void overwriteExisting;
  void includeExceptions;
  void includeBreaks;
  void generateFutureOnly;

  // Reserved for future option consistency rules.
}

function validateStatus(
  status: SlotGenerationStatus,
  generation: SlotGeneration,
  errors: string[],
): void {
  switch (status) {
    case "pending":
      if (
        generation.startedAt ||
        generation.completedAt
      ) {
        errors.push(
          "Pending generation cannot have timestamps.",
        );
      }
      break;

    case "running":
      if (!generation.startedAt) {
        errors.push(
          "Running generation requires a start time.",
        );
      }

      if (generation.completedAt) {
        errors.push(
          "Running generation cannot have a completion time.",
        );
      }
      break;

    case "completed":
      if (!generation.startedAt) {
        errors.push(
          "Completed generation requires a start time.",
        );
      }

      if (!generation.completedAt) {
        errors.push(
          "Completed generation requires a completion time.",
        );
      }

      if (!generation.result) {
        errors.push(
          "Completed generation requires a result.",
        );
      }
      break;

    case "failed":
      if (!generation.startedAt) {
        errors.push(
          "Failed generation requires a start time.",
        );
      }
      break;

    default:
      assertNever(status);
  }
}

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unhandled slot generation status: ${value}`,
  );
}