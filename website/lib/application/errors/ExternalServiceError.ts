/**
 * ============================================================
 * PatientPilot AI
 * External Service Error
 * ============================================================
 *
 * Represents failures originating from external services.
 *
 * These errors should be returned through ApplicationResult
 * rather than thrown for expected integration failures.
 */

import type { ApplicationError } from "./ApplicationError";

export type ExternalService =
  | "OPENAI"
  | "TWILIO"
  | "SUPABASE"
  | "GOOGLE_CALENDAR"
  | "MICROSOFT_365"
  | "STRIPE"
  | "SMTP"
  | "SMS_PROVIDER"
  | "EMAIL_PROVIDER"
  | "WEBHOOK"
  | "UNKNOWN";

export type ExternalServiceFailureReason =
  | "UNAVAILABLE"
  | "TIMEOUT"
  | "AUTHENTICATION_FAILED"
  | "AUTHORIZATION_FAILED"
  | "RATE_LIMITED"
  | "INVALID_RESPONSE"
  | "NETWORK_ERROR"
  | "CONFIGURATION_ERROR"
  | "UNKNOWN";

export interface ExternalServiceError extends ApplicationError {
  readonly code: "EXTERNAL_SERVICE_ERROR";

  readonly service: ExternalService;

  readonly reason: ExternalServiceFailureReason;

  readonly retryable: boolean;

  readonly statusCode?: number;
}

export class ExternalServiceErrorFactory {
  static create(
    service: ExternalService,
    reason: ExternalServiceFailureReason,
    message: string,
    options?: {
      retryable?: boolean;
      statusCode?: number;
      details?: Record<string, unknown>;
    },
  ): ExternalServiceError {
    return {
      code: "EXTERNAL_SERVICE_ERROR",
      service,
      reason,
      message,
      retryable: options?.retryable ?? false,
      statusCode: options?.statusCode,
      details: options?.details,
    };
  }

  static timeout(
    service: ExternalService,
  ): ExternalServiceError {
    return this.create(
      service,
      "TIMEOUT",
      `${service} request timed out.`,
      {
        retryable: true,
      },
    );
  }

  static unavailable(
    service: ExternalService,
  ): ExternalServiceError {
    return this.create(
      service,
      "UNAVAILABLE",
      `${service} is currently unavailable.`,
      {
        retryable: true,
      },
    );
  }

  static rateLimited(
    service: ExternalService,
    statusCode = 429,
  ): ExternalServiceError {
    return this.create(
      service,
      "RATE_LIMITED",
      `${service} rate limit exceeded.`,
      {
        retryable: true,
        statusCode,
      },
    );
  }

  static authenticationFailed(
    service: ExternalService,
  ): ExternalServiceError {
    return this.create(
      service,
      "AUTHENTICATION_FAILED",
      `${service} authentication failed.`,
      {
        retryable: false,
      },
    );
  }

  static configurationError(
    service: ExternalService,
    message: string,
  ): ExternalServiceError {
    return this.create(
      service,
      "CONFIGURATION_ERROR",
      message,
      {
        retryable: false,
      },
    );
  }

  static networkError(
    service: ExternalService,
  ): ExternalServiceError {
    return this.create(
      service,
      "NETWORK_ERROR",
      `${service} network communication failed.`,
      {
        retryable: true,
      },
    );
  }
}