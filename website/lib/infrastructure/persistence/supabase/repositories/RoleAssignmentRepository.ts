/**
 * ============================================================
 * PatientPilot AI
 * Supabase Role Assignment Repository
 * ============================================================
 *
 * Infrastructure implementation of
 * IRoleAssignmentRepository.
 *
 * Responsibilities
 * - Persistence only
 * - No business logic
 * - Maps database rows to RoleAssignment entities
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AssignRoleData,
  IRoleAssignmentRepository,
} from "@/lib/application/interfaces/IRoleAssignmentRepository";

import type {
  RoleAssignment,
  RoleId,
  UserId,
} from "@/lib/platform/domain/identity";

import { IdentityRoleAssignmentMapper } from "../mappers/IdentityRoleAssignmentMapper";

export class RoleAssignmentRepository
  implements IRoleAssignmentRepository
{
  constructor(
    private readonly db: SupabaseClient,
  ) {}

  async findById(
    assignmentId: string,
  ): Promise<RoleAssignment | null> {
    const { data, error } =
      await this.db
        .from("role_assignments")
        .select("*")
        .eq("id", assignmentId)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return IdentityRoleAssignmentMapper.toDomain(
      data,
    );
  }

  async findByUser(
    userId: UserId,
  ): Promise<RoleAssignment[]> {
    const { data, error } =
      await this.db
        .from("role_assignments")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true);

    if (error) {
      throw error;
    }

    return (data ?? []).map(
      IdentityRoleAssignmentMapper.toDomain,
    );
  }

  async findByRole(
    roleId: RoleId,
  ): Promise<RoleAssignment[]> {
    const { data, error } =
      await this.db
        .from("role_assignments")
        .select("*")
        .eq("role_id", roleId)
        .eq("is_active", true);

    if (error) {
      throw error;
    }

    return (data ?? []).map(
      IdentityRoleAssignmentMapper.toDomain,
    );
  }

  async hasRole(
    userId: UserId,
    roleId: RoleId,
  ): Promise<boolean> {
    const { count, error } =
      await this.db
        .from("role_assignments")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId)
        .eq("role_id", roleId)
        .eq("is_active", true);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  }

  async assign(
    data: AssignRoleData,
  ): Promise<RoleAssignment> {
    const { data: created, error } =
      await this.db
        .from("role_assignments")
        .insert({
          tenant_id: data.tenantId,
          clinic_id: data.clinicId,
          user_id: data.userId,
          role_id: data.roleId,
          assigned_by: data.assignedBy ?? null,
          assigned_at: new Date().toISOString(),
          expires_at:
            data.expiresAt?.toISOString() ??
            null,
          is_active: true,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityRoleAssignmentMapper.toDomain(
      created,
    );
  }

  async update(
    assignment: RoleAssignment,
  ): Promise<RoleAssignment> {
    const persistence =
      IdentityRoleAssignmentMapper.toPersistence(
        assignment,
      );

    const { data, error } =
      await this.db
        .from("role_assignments")
        .update(persistence)
        .eq("id", assignment.id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityRoleAssignmentMapper.toDomain(
      data,
    );
  }

  async revoke(
    assignmentId: string,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("role_assignments")
        .update({
          is_active: false,
          revoked_at:
            new Date().toISOString(),
        })
        .eq("id", assignmentId);

    if (error) {
      throw error;
    }
  }

  async revokeAllForUser(
    userId: UserId,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("role_assignments")
        .update({
          is_active: false,
          revoked_at:
            new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("is_active", true);

    if (error) {
      throw error;
    }
  }
}