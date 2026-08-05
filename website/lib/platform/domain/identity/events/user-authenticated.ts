/**
 * ============================================================
 * PatientPilot AI
 * User Authenticated Domain Event
 * ============================================================
 *
 * Published after a successful user authentication.
 *
 * This event represents a business fact that a user has
 * successfully authenticated with the platform.
 *
 * Framework independent.
 */

import type {
  ClinicId,
  SessionIdValue,
  TenantId,
  UserId,
} from "../identity.types";

export interface UserAuthenticatedEvent {
  /**
   * Domain event identifier.
   */
  readonly eventId: string;

  /**
   * Event name.
   */
  readonly eventName: "identity.user-authenticated";

  /**
   * When the event occurred.
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
   * Authenticated user.
   */
  readonly userId: UserId;

  /**
   * Session identifier.
   */
  readonly sessionId: SessionIdValue;

  /**
   * Authentication source.
   */
  readonly provider: string;

  /**
   * Optional client IP.
   */
  readonly ipAddress?: string;

  /**
   * Optional browser / device information.
   */
  readonly userAgent?: string;
}

/**
 * Factory for creating authentication events.
 */
export class UserAuthenticated {
  static create(
    event: UserAuthenticatedEvent,
  ): UserAuthenticatedEvent {
    return Object.freeze({
      ...event,
    });
  }
}
