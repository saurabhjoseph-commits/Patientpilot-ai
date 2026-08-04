/**
 * ============================================================
 * PatientPilot AI
 * Identity Role Assignment Mapper
 * ============================================================
 *
 * Maps persistence models to the Identity RoleAssignment
 * entity and vice versa.
 *
 * Responsibilities
 * - Database → Domain
 * - Domain → Persistence
 *
 * Contains no business logic.
 */

import {
  RoleAssignment,
} from "@/lib/platform/domain/identity";

interface SupabaseRoleAssignmentRow {
  id: string;

  tenant_id: string;

  clinic_id: string;

  user_id: string;

  role_id: string;

  assigned_by: string | null;

  assigned_at: string;

  expires_at: string | null;

  revoked_at: string | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}

export class IdentityRoleAssignmentMapper {
  /**
   * Maps a persistence row to a RoleAssignment entity.
   */
  static toDomain(
    row: SupabaseRoleAssignmentRow,
  ): RoleAssignment {
    return new RoleAssignment({
      id: row.id,

      tenantId: row.tenant_id,

      clinicId: row.clinic_id,

      userId: row.user_id,

      roleId: row.role_id,

      assignedBy:
        row.assigned_by ?? undefined,

      assignedAt:
        new Date(row.assigned_at),

      expiresAt:
        row.expires_at
          ? new Date(row.expires_at)
          : undefined,

      revokedAt:
        row.revoked_at
          ? new Date(row.revoked_at)
          : undefined,

      isActive:
        row.is_active,

      createdAt:
        new Date(row.created_at),

      updatedAt:
        new Date(row.updated_at),
    });
  }

  /**
   * Maps a RoleAssignment entity back to persistence.
   */
  static toPersistence(
    assignment: RoleAssignment,
  ) {
    return {
      id: assignment.id,

      tenant_id:
        assignment.tenantId,

      clinic_id:
        assignment.clinicId,

      user_id:
        assignment.userId,

      role_id:
        assignment.roleId,

      assigned_by:
        assignment.assignedBy ?? null,

      assigned_at:
        assignment.assignedAt.toISOString(),

      expires_at:
        assignment.expiresAt?.toISOString() ??
        null,

      revoked_at:
        assignment.revokedAt?.toISOString() ??
        null,

      is_active:
        assignment.isActive,

      created_at:
        assignment.createdAt.toISOString(),

      updated_at:
        assignment.updatedAt.toISOString(),
    };
  }
}