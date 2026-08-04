/**
 * PatientPilot AI
 * Application Layer
 * Service Result
 *
 * Standard response wrapper for application services.
 */

export interface ServiceError {
  readonly code: string;
  readonly message: string;
}

export interface ServiceResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly errors: readonly ServiceError[];
}

export function success<T>(
  data: T,
): ServiceResult<T> {
  return {
    success: true,
    data,
    errors: [],
  };
}

export function failure<T = never>(
  code: string,
  message: string,
): ServiceResult<T> {
  return {
    success: false,
    errors: [
      {
        code,
        message,
      },
    ],
  };
}

export function validationFailure<T = never>(
  message: string,
): ServiceResult<T> {
  return failure(
    "VALIDATION_ERROR",
    message,
  );
}

export function notFound<T = never>(
  entity: string,
): ServiceResult<T> {
  return failure(
    "NOT_FOUND",
    `${entity} was not found.`,
  );
}

export function unexpectedError<T = never>(
  error: unknown,
): ServiceResult<T> {
  return failure(
    "UNEXPECTED_ERROR",
    error instanceof Error
      ? error.message
      : "Unexpected error.",
  );
}