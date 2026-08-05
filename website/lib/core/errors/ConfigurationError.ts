/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Configuration Error
 * ============================================================
 */

import {
  AppError,
  type ErrorContext,
} from "./AppError";

export interface ConfigurationErrorOptions {
  key?: string;
  value?: unknown;
  context?: ErrorContext;
  cause?: unknown;
}

/**
 * Thrown when the application configuration
 * is invalid or incomplete.
 */
export class ConfigurationError extends AppError {
  public readonly key?: string;

  public readonly value?: unknown;

  constructor(
    message = "Configuration error.",
    options: ConfigurationErrorOptions = {}
  ) {
    super(message, {
      code: "CONFIGURATION_ERROR",
      statusCode: 500,
      context: {
        ...options.context,
        ...(options.key && {
          configurationKey: options.key,
        }),
        ...(options.value !== undefined && {
          configurationValue: options.value,
        }),
      },
      cause: options.cause,
    });

    this.key = options.key;
    this.value = options.value;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      key: this.key,
      value: this.value,
    };
  }
}