/**
 * ============================================================
 * PatientPilot AI
 * Validation Error
 * ============================================================
 *
 * Represents one or more validation failures in the
 * Application Layer.
 */

import type { ApplicationError } from "./ApplicationError";

export interface ValidationFailure {
  field: string;

  message: string;

  code?: string;

  attemptedValue?: unknown;
}

export interface ValidationError extends ApplicationError {
  readonly code: "VALIDATION_ERROR";

  readonly failures: ValidationFailure[];
}

export class ValidationErrorFactory {
  static create(
    failures: ValidationFailure[],
    message = "Validation failed.",
  ): ValidationError {
    return {
      code: "VALIDATION_ERROR",
      message,
      failures,
      details: {
        fieldCount: failures.length,
      },
    };
  }

  static single(
    field: string,
    message: string,
    attemptedValue?: unknown,
    code?: string,
  ): ValidationError {
    return this.create([
      {
        field,
        message,
        code,
        attemptedValue,
      },
    ]);
  }
}