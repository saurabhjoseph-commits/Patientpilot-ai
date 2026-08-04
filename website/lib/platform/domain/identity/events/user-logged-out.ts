/**
 * ============================================================
 * PatientPilot AI
 * User Logged Out Domain Event
 * ============================================================
 *
 * Published when a user successfully logs out.
 *
 * This event represents the business fact that an authenticated
 * session has been terminated by the user or by the system.
 *
 * Framework independent.
 */

import type {
  ClinicId,
  SessionIdValue,
  TenantId,
  UserId,
} from "../identity.types";

export interface UserLoggedOutEvent {
  /**
   * Domain event identifier.
   */
  readonly eventId: string;

  /**
   * Event name.
   */
  readonly eventName: "identity.user-logged-out";

  /**
   * When the logout occurred.
   */
  readonly occurredAt: Date;

  /**
   * Tenant identifier.
   */
  readonly tenantId: TenantId;

  /**
   * Clinic identifier.
   */
  readonly clinicId: ClinicId;

  /**
   * User identifier.
   */
  readonly userId: UserId;

  /**
   * Session that was terminated.
   */
  readonly sessionId: SessionIdValue;

  /**
   * Reason for logout.
   *
   * Examples:
   * - user
   * - timeout
   * - revoked
   * - password_changed
   * - administrator
   */
  readonly reason: string;
}

/**
 * Factory for creating immutable logout events.
 */
export class UserLoggedOut {
  static create(
    event: UserLoggedOutEvent,
  ): UserLoggedOutEvent {
    return Object.freeze({
      ...event,
    });
  }
}
