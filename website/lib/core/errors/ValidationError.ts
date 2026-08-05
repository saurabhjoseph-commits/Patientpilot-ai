/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Validation Error
 * ============================================================
 */

import {
  AppError,
  type ErrorContext,
} from "./AppError";

export interface ValidationIssue {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationErrorOptions {
  field?: string;
  value?: unknown;
  context?: ErrorContext;
  issues?: ValidationIssue[];
  cause?: unknown;
}

/**
 * Thrown when one or more validation rules fail.
 */
export class ValidationError extends AppError {
  public readonly issues: readonly ValidationIssue[];

  constructor(
    message = "Validation failed.",
    options: ValidationErrorOptions = {}
  ) {
    super(message, {
      code: "VALIDATION_ERROR",
      statusCode: 400,
      context: {
        ...options.context,
        ...(options.field && { field: options.field }),
        ...(options.value !== undefined && {
          value: options.value,
        }),
      },
      cause: options.cause,
    });

    this.issues = options.issues ?? [];
  }

  /**
   * Returns true if the error contains
   * one or more validation issues.
   */
  get hasIssues(): boolean {
    return this.issues.length > 0;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      issues: this.issues,
    };
  }
}