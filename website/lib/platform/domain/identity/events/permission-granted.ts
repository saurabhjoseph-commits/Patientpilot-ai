/**
 * ============================================================
 * PatientPilot AI
 * Permission Granted Domain Event
 * ============================================================
 *
 * Published whenever a permission is granted to a role.
 *
 * This event represents the business fact that a role has
 * received a new permission.
 *
 * Framework independent.
 */

import type {
  PermissionId,
  RoleId,
  TenantId,
  UserId,
} from "../identity.types";

export interface PermissionGrantedEvent {
  /**
   * Domain event identifier.
   */
  readonly eventId: string;

  /**
   * Event name.
   */
  readonly eventName: "identity.permission-granted";

  /**
   * Event timestamp.
   */
  readonly occurredAt: Date;

  /**
   * Tenant identifier.
   */
  readonly tenantId: TenantId;

  /**
   * Role receiving the permission.
   */
  readonly roleId: RoleId;

  /**
   * Granted permission.
   */
  readonly permissionId: PermissionId;

  /**
   * User who granted the permission.
   */
  readonly grantedBy: UserId;

  /**
   * Optional reason.
   */
  readonly reason?: string;
}

/**
 * Factory for immutable PermissionGranted events.
 */
export class PermissionGranted {
  static create(
    event: PermissionGrantedEvent,
  ): PermissionGrantedEvent {
    return Object.freeze({
      ...event,
    });
  }
}