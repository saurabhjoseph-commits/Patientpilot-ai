/**
 * ============================================================
 * PatientPilot AI
 * Application Error
 * ============================================================
 *
 * Base error hierarchy for the Application Layer.
 *
 * These errors represent expected business failures and are
 * intended to be returned via ApplicationResult rather than
 * thrown as exceptions.
 */

export type ApplicationErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BUSINESS_RULE_VIOLATION"
  | "EXTERNAL_SERVICE_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "CONCURRENCY_ERROR"
  | "INTERNAL_ERROR";

export interface ApplicationError {
  readonly code: ApplicationErrorCode;

  readonly message: string;

  readonly details?: Record<string, unknown>;
}

export class ErrorFactory {
  static validation(
    message: string,
    details?: Record<string, unknown>,
  ): ApplicationError {
    return {
      code: "VALIDATION_ERROR",
      message,
      details,
    };
  }

  static unauthorized(
    message = "Authentication is required.",
  ): ApplicationError {
    return {
      code: "UNAUTHORIZED",
      message,
    };
  }

  static forbidden(
    message = "Access denied.",
  ): ApplicationError {
    return {
      code: "FORBIDDEN",
      message,
    };
  }

  static notFound(
    resource: string,
  ): ApplicationError {
    return {
      code: "NOT_FOUND",
      message: `${resource} was not found.`,
    };
  }

  static conflict(
    message: string,
  ): ApplicationError {
    return {
      code: "CONFLICT",
      message,
    };
  }

  static businessRule(
    message: string,
    details?: Record<string, unknown>,
  ): ApplicationError {
    return {
      code: "BUSINESS_RULE_VIOLATION",
      message,
      details,
    };
  }

  static externalService(
    service: string,
    details?: Record<string, unknown>,
  ): ApplicationError {
    return {
      code: "EXTERNAL_SERVICE_ERROR",
      message: `${service} is currently unavailable.`,
      details,
    };
  }

  static rateLimit(
    message = "Rate limit exceeded.",
  ): ApplicationError {
    return {
      code: "RATE_LIMIT_EXCEEDED",
      message,
    };
  }

  static concurrency(
    message = "The resource was modified by another operation.",
  ): ApplicationError {
    return {
      code: "CONCURRENCY_ERROR",
      message,
    };
  }

  static internal(
    message = "An unexpected application error occurred.",
    details?: Record<string, unknown>,
  ): ApplicationError {
    return {
      code: "INTERNAL_ERROR",
      message,
      details,
    };
  }
}