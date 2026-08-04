/**
 * ============================================================
 * PatientPilot AI
 * Permission Revoked Domain Event
 * ============================================================
 *
 * Published whenever a permission is revoked from a role.
 *
 * This event represents the business fact that a role has
 * lost one of its permissions.
 *
 * Framework independent.
 */

import type {
  PermissionId,
  RoleId,
  TenantId,
  UserId,
} from "../identity.types";

export interface PermissionRevokedEvent {
  /**
   * Domain event identifier.
   */
  readonly eventId: string;

  /**
   * Event name.
   */
  readonly eventName: "identity.permission-revoked";

  /**
   * Event timestamp.
   */
  readonly occurredAt: Date;

  /**
   * Tenant identifier.
   */
  readonly tenantId: TenantId;

  /**
   * Role losing the permission.
   */
  readonly roleId: RoleId;

  /**
   * Permission that was revoked.
   */
  readonly permissionId: PermissionId;

  /**
   * User performing the revocation.
   */
  readonly revokedBy: UserId;

  /**
   * Optional reason for revocation.
   *
   * Examples:
   * - administrator
   * - security_policy
   * - role_cleanup
   * - compliance
   */
  readonly reason?: string;
}

/**
 * Factory for immutable PermissionRevoked events.
 */
export class PermissionRevoked {
  static create(
    event: PermissionRevokedEvent,
  ): PermissionRevokedEvent {
    return Object.freeze({
      ...event,
    });
  }
}