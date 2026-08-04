/**
 * ============================================================
 * PatientPilot AI
 * Application Result
 * ============================================================
 *
 * Standard result object returned by every
 * Application Layer use case.
 */

export interface ApplicationError {
  code: string;

  message: string;

  details?: Record<string, unknown>;
}

export interface ApplicationResult<T> {
  success: boolean;

  data?: T;

  error?: ApplicationError;

  warnings: string[];

  metadata: Record<string, unknown>;
}

export class Result {
  static success<T>(
    data: T,
    metadata: Record<string, unknown> = {},
  ): ApplicationResult<T> {
    return {
      success: true,
      data,
      warnings: [],
      metadata,
    };
  }

  static failure<T = never>(
    code: string,
    message: string,
    details?: Record<string, unknown>,
  ): ApplicationResult<T> {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      warnings: [],
      metadata: {},
    };
  }

  static warning<T>(
    data: T,
    warnings: string[],
    metadata: Record<string, unknown> = {},
  ): ApplicationResult<T> {
    return {
      success: true,
      data,
      warnings,
      metadata,
    };
  }
}