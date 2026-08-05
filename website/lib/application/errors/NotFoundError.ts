/**
 * ============================================================
 * PatientPilot AI
 * Not Found Error
 * ============================================================
 *
 * Represents a requested resource that could not be found.
 *
 * This is an expected application outcome and should be
 * returned through ApplicationResult instead of throwing
 * an exception.
 */

import type { ApplicationError } from "./ApplicationError";

export interface NotFoundError extends ApplicationError {
  readonly code: "NOT_FOUND";

  /**
   * Type of resource that was requested.
   */
  readonly resource: string;

  /**
   * Optional identifier used during lookup.
   */
  readonly identifier?: string;
}

export class NotFoundErrorFactory {
  static create(
    resource: string,
    identifier?: string,
    message?: string,
  ): NotFoundError {
    return {
      code: "NOT_FOUND",
      message:
        message ??
        `${resource} was not found.`,
      resource,
      identifier,
      details: identifier
        ? {
            identifier,
          }
        : undefined,
    };
  }

  static clinic(
    clinicId: string,
  ): NotFoundError {
    return this.create(
      "Clinic",
      clinicId,
    );
  }

  static patient(
    patientId: string,
  ): NotFoundError {
    return this.create(
      "Patient",
      patientId,
    );
  }

  static appointment(
    appointmentId: string,
  ): NotFoundError {
    return this.create(
      "Appointment",
      appointmentId,
    );
  }

  static provider(
    providerId: string,
  ): NotFoundError {
    return this.create(
      "Provider",
      providerId,
    );
  }

  static user(
    userId: string,
  ): NotFoundError {
    return this.create(
      "User",
      userId,
    );
  }

  static conversation(
    conversationId: string,
  ): NotFoundError {
    return this.create(
      "Conversation",
      conversationId,
    );
  }
}