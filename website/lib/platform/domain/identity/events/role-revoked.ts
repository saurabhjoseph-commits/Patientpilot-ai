/**
 * ============================================================
 * PatientPilot AI
 * Role Revoked Domain Event
 * ============================================================
 *
 * Published whenever a role is revoked from a user.
 *
 * This event represents the business fact that a user's
 * authorization has been reduced.
 *
 * Framework independent.
 */

import type {
  ClinicId,
  RoleId,
  TenantId,
  UserId,
} from "../identity.types";

export interface RoleRevokedEvent {
  /**
   * Domain event identifier.
   */
  readonly eventId: string;

  /**
   * Event name.
   */
  readonly eventName: "identity.role-revoked";

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
   * User losing the role.
   */
  readonly userId: UserId;

  /**
   * Revoked role.
   */
  readonly roleId: RoleId;

  /**
   * User that performed the revocation.
   */
  readonly revokedBy: UserId;

  /**
   * Reason for the revocation.
   *
   * Examples:
   * - administrator
   * - employment_ended
   * - temporary_access_expired
   * - security
   * - clinic_transfer
   */
  readonly reason?: string;
}

/**
 * Factory for immutable RoleRevoked events.
 */
export class RoleRevoked {
  static create(
    event: RoleRevokedEvent,
  ): RoleRevokedEvent {
    return Object.freeze({
      ...event,
    });
  }
}