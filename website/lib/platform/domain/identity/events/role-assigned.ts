/**
 * ============================================================
 * PatientPilot AI
 * Role Assigned Domain Event
 * ============================================================
 *
 * Published whenever a role is assigned to a user.
 *
 * This event represents the business fact that a user has
 * received a new authorization role.
 *
 * Framework independent.
 */

import type {
  ClinicId,
  RoleId,
  TenantId,
  UserId,
} from "../identity.types";

export interface RoleAssignedEvent {
  /**
   * Domain event identifier.
   */
  readonly eventId: string;

  /**
   * Event name.
   */
  readonly eventName: "identity.role-assigned";

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
   * User receiving the role.
   */
  readonly userId: UserId;

  /**
   * Assigned role.
   */
  readonly roleId: RoleId;

  /**
   * User who performed the assignment.
   */
  readonly assignedBy: UserId;

  /**
   * Optional expiration date for the assignment.
   */
  readonly expiresAt?: Date;
}

/**
 * Factory for immutable RoleAssigned events.
 */
export class RoleAssigned {
  static create(
    event: RoleAssignedEvent,
  ): RoleAssignedEvent {
    return Object.freeze({
      ...event,
    });
  }
}