/**
 * ============================================================
 * PatientPilot AI
 * Role Assignment Repository
 * ============================================================
 *
 * Application Layer contract for User ↔ Role assignments.
 *
 * Implemented by the Infrastructure Layer
 * (Supabase, PostgreSQL, etc.).
 */

import type {
  ClinicId,
  RoleAssignment,
  RoleId,
  TenantId,
  UserId,
} from "@/lib/platform/domain/identity";

export interface AssignRoleData {
  /**
   * Tenant identifier.
   */
  tenantId: TenantId;

  /**
   * Clinic identifier.
   */
  clinicId: ClinicId;

  /**
   * User receiving the role.
   */
  userId: UserId;

  /**
   * Assigned role.
   */
  roleId: RoleId;

  /**
   * User performing the assignment.
   */
  assignedBy?: UserId;

  /**
   * Optional expiration.
   */
  expiresAt?: Date;
}

export interface IRoleAssignmentRepository {
  /**
   * Returns a role assignment by identifier.
   */
  findById(
    assignmentId: string,
  ): Promise<RoleAssignment | null>;

  /**
   * Returns all active role assignments for a user.
   */
  findByUser(
    userId: UserId,
  ): Promise<RoleAssignment[]>;

  /**
   * Returns all users assigned to a role.
   */
  findByRole(
    roleId: RoleId,
  ): Promise<RoleAssignment[]>;

  /**
   * Determines whether a user currently has
   * a specific role.
   */
  hasRole(
    userId: UserId,
    roleId: RoleId,
  ): Promise<boolean>;

  /**
   * Creates a role assignment.
   */
  assign(
    data: AssignRoleData,
  ): Promise<RoleAssignment>;

  /**
   * Persists updates to a role assignment.
   */
  update(
    assignment: RoleAssignment,
  ): Promise<RoleAssignment>;

  /**
   * Revokes a role assignment.
   */
  revoke(
    assignmentId: string,
  ): Promise<void>;

  /**
   * Revokes every role assignment for a user.
   */
  revokeAllForUser(
    userId: UserId,
  ): Promise<void>;
}