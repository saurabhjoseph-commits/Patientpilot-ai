/**
 * ============================================================
 * PatientPilot AI
 * Conflict Error
 * ============================================================
 *
 * Represents a resource conflict.
 *
 * A conflict occurs when the request is valid, but cannot
 * be completed because of the current state of the system.
 */

import type { ApplicationError } from "./ApplicationError";

export type ConflictReason =
  | "DUPLICATE_RESOURCE"
  | "RESOURCE_ALREADY_EXISTS"
  | "RESOURCE_ALREADY_ASSIGNED"
  | "RESOURCE_ALREADY_BOOKED"
  | "CONCURRENT_MODIFICATION"
  | "VERSION_MISMATCH"
  | "UNIQUE_CONSTRAINT";

export interface ConflictError extends ApplicationError {
  readonly code: "CONFLICT";

  readonly reason: ConflictReason;

  readonly resource: string;

  readonly identifier?: string;
}

export class ConflictErrorFactory {
  static create(
    reason: ConflictReason,
    resource: string,
    message: string,
    identifier?: string,
  ): ConflictError {
    return {
      code: "CONFLICT",
      reason,
      resource,
      identifier,
      message,
      details: identifier
        ? {
            identifier,
          }
        : undefined,
    };
  }

  static duplicate(
    resource: string,
    identifier?: string,
  ): ConflictError {
    return this.create(
      "DUPLICATE_RESOURCE",
      resource,
      `${resource} already exists.`,
      identifier,
    );
  }

  static alreadyBooked(
    resource = "Appointment Slot",
    identifier?: string,
  ): ConflictError {
    return this.create(
      "RESOURCE_ALREADY_BOOKED",
      resource,
      `${resource} has already been booked.`,
      identifier,
    );
  }

  static concurrentModification(
    resource: string,
    identifier?: string,
  ): ConflictError {
    return this.create(
      "CONCURRENT_MODIFICATION",
      resource,
      `${resource} was modified by another operation.`,
      identifier,
    );
  }

  static versionMismatch(
    resource: string,
    identifier?: string,
  ): ConflictError {
    return this.create(
      "VERSION_MISMATCH",
      resource,
      `${resource} version does not match the latest version.`,
      identifier,
    );
  }

  static uniqueConstraint(
    resource: string,
    identifier?: string,
  ): ConflictError {
    return this.create(
      "UNIQUE_CONSTRAINT",
      resource,
      `${resource} violates a unique constraint.`,
      identifier,
    );
  }
}