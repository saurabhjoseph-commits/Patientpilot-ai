/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Not Found Error
 * ============================================================
 */

import {
  AppError,
  type ErrorContext,
} from "./AppError";

export interface NotFoundErrorOptions {
  resource: string;
  resourceId?: string;
  context?: ErrorContext;
  cause?: unknown;
}

/**
 * Thrown when a requested resource cannot be found.
 */
export class NotFoundError extends AppError {
  public readonly resource: string;

  public readonly resourceId?: string;

  constructor(
    message?: string,
    options?: NotFoundErrorOptions
  ) {
    const resource = options?.resource ?? "Resource";

    super(
      message ?? `${resource} not found.`,
      {
        code: "NOT_FOUND",
        statusCode: 404,
        context: {
          ...options?.context,
          resource,
          ...(options?.resourceId && {
            resourceId: options.resourceId,
          }),
        },
        cause: options?.cause,
      }
    );

    this.resource = resource;
    this.resourceId = options?.resourceId;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource,
      resourceId: this.resourceId,
    };
  }
}