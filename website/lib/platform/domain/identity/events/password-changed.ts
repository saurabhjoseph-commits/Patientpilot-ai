/**
 * ============================================================
 * PatientPilot AI
 * Password Changed Domain Event
 * ============================================================
 *
 * Published whenever a user's password is successfully changed.
 *
 * This event represents the business fact that authentication
 * credentials have been updated.
 *
 * Framework independent.
 */

import type {
  ClinicId,
  TenantId,
  UserId,
} from "../identity.types";

export interface PasswordChangedEvent {
  /**
   * Domain event identifier.
   */
  readonly eventId: string;

  /**
   * Event name.
   */
  readonly eventName: "identity.password-changed";

  /**
   * Event timestamp.
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
   * User whose password changed.
   */
  readonly userId: UserId;

  /**
   * User that initiated the password change.
   *
   * For self-service password changes this equals userId.
   * Administrators may change another user's password.
   */
  readonly changedBy: UserId;

  /**
   * Reason for the password change.
   *
   * Examples:
   * - user_request
   * - password_reset
   * - administrator
   * - security_policy
   */
  readonly reason: string;

  /**
   * Indicates whether all existing sessions should
   * be revoked after the password change.
   */
  readonly revokeExistingSessions: boolean;
}

/**
 * Factory for immutable PasswordChanged events.
 */
export class PasswordChanged {
  static create(
    event: PasswordChangedEvent,
  ): PasswordChangedEvent {
    return Object.freeze({
      ...event,
    });
  }
}