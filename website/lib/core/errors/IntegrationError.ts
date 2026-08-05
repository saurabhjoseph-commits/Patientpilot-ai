/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Integration Error
 * ============================================================
 */

import {
  AppError,
  type ErrorContext,
} from "./AppError";

export interface IntegrationErrorOptions {
  provider: string;
  operation?: string;
  statusCode?: number;
  retryable?: boolean;
  externalErrorCode?: string;
  context?: ErrorContext;
  cause?: unknown;
}

/**
 * Thrown when an external integration fails.
 */
export class IntegrationError extends AppError {
  public readonly provider: string;

  public readonly operation?: string;

  public readonly retryable: boolean;

  public readonly externalErrorCode?: string;

  constructor(
    message = "External integration failed.",
    options: IntegrationErrorOptions
  ) {
    super(message, {
      code: "INTEGRATION_ERROR",
      statusCode: options.statusCode ?? 502,
      context: {
        ...options.context,
        provider: options.provider,
        ...(options.operation && {
          operation: options.operation,
        }),
        retryable: options.retryable ?? false,
        ...(options.externalErrorCode && {
          externalErrorCode: options.externalErrorCode,
        }),
      },
      cause: options.cause,
    });

    this.provider = options.provider;
    this.operation = options.operation;
    this.retryable = options.retryable ?? false;
    this.externalErrorCode = options.externalErrorCode;
  }

  /**
   * Indicates whether the failed operation
   * can safely be retried.
   */
  get canRetry(): boolean {
    return this.retryable;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      provider: this.provider,
      operation: this.operation,
      retryable: this.retryable,
      externalErrorCode: this.externalErrorCode,
    };
  }
}