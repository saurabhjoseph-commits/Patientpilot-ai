/**
 * PatientPilot AI
 * Infrastructure Layer
 * Supabase Errors
 *
 * Standardized error types and conversion helpers
 * for Supabase operations.
 */

import { PostgrestError } from "@supabase/supabase-js";

/**
 * Base infrastructure error.
 */
export class InfrastructureError extends Error {
  readonly cause?: unknown;

  constructor(
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name = "InfrastructureError";
    this.cause = cause;
  }
}

/**
 * Database operation error.
 */
export class DatabaseError extends InfrastructureError {
  readonly code?: string;

  constructor(
    message: string,
    code?: string,
    cause?: unknown,
  ) {
    super(message, cause);

    this.name = "DatabaseError";
    this.code = code;
  }
}

/**
 * Entity not found.
 */
export class NotFoundError extends DatabaseError {
  constructor(entity: string, id: string) {
    super(
      `${entity} '${id}' was not found.`,
      "NOT_FOUND",
    );

    this.name = "NotFoundError";
  }
}

/**
 * Duplicate entity.
 */
export class DuplicateRecordError extends DatabaseError {
  constructor(entity: string) {
    super(
      `${entity} already exists.`,
      "DUPLICATE",
    );

    this.name = "DuplicateRecordError";
  }
}

/**
 * Converts a Supabase error into a DatabaseError.
 */
export function mapSupabaseError(
  error: PostgrestError,
): DatabaseError {
  return new DatabaseError(
    error.message,
    error.code,
    error,
  );
}

/**
 * Throws if a Supabase operation returned an error.
 */
export function throwIfSupabaseError(
  error: PostgrestError | null,
): void {
  if (error) {
    throw mapSupabaseError(error);
  }
}