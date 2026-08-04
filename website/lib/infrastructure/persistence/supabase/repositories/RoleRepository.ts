/**
 * ============================================================
 * PatientPilot AI
 * Supabase Role Repository
 * ============================================================
 *
 * Infrastructure implementation of IRoleRepository.
 *
 * Responsibilities
 * - Role persistence
 * - Role lookup
 * - No business logic
 * - Maps database rows to Identity Role entities
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateRoleData,
  IRoleRepository,
  UpdateRoleData,
} from "@/lib/application/interfaces/IRoleRepository";

import type {
  Role,
  RoleCode,
  RoleId,
  UserId,
} from "@/lib/platform/domain/identity";

import { IdentityRoleMapper } from "../mappers/IdentityRoleMapper";

export class RoleRepository
  implements IRoleRepository
{
  constructor(
    private readonly db: SupabaseClient,
  ) {}

  async findById(
    roleId: RoleId,
  ): Promise<Role | null> {
    const { data, error } =
      await this.db
        .from("roles")
        .select("*")
        .eq("id", roleId)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return IdentityRoleMapper.toDomain(
      data,
    );
  }

  async findByCode(
    code: RoleCode,
  ): Promise<Role | null> {
    const { data, error } =
      await this.db
        .from("roles")
        .select("*")
        .eq("code", code.value)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return IdentityRoleMapper.toDomain(
      data,
    );
  }

  async findAll(): Promise<Role[]> {
    const { data, error } =
      await this.db
        .from("roles")
        .select("*")
        .order("name");

    if (error) {
      throw error;
    }

    return (data ?? []).map(
      IdentityRoleMapper.toDomain,
    );
  }

  async findByUser(
    userId: UserId,
  ): Promise<Role[]> {
    const { data, error } =
      await this.db
        .from("role_assignments")
        .select(`
          roles (*)
        `)
        .eq("user_id", userId)
        .eq("is_active", true);

    if (error) {
      throw error;
    }

    return (data ?? [])
      .flatMap((row) => row.roles)
      .map(IdentityRoleMapper.toDomain);
  }

  async create(
    data: CreateRoleData,
  ): Promise<Role> {
    const { data: created, error } =
      await this.db
        .from("roles")
        .insert({
          tenant_id: data.tenantId,
          clinic_id: data.clinicId,
          code: data.code.value,
          name: data.name,
          description:
            data.description ?? null,
          permissions: data.permissions.map(
            (permission) => permission.value,
          ),
          is_system: false,
          is_active: true,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityRoleMapper.toDomain(
      created,
    );
  }

  async update(
    roleId: RoleId,
    data: UpdateRoleData,
  ): Promise<Role> {
    const { data: updated, error } =
      await this.db
        .from("roles")
        .update({
          name: data.name,
          description:
            data.description,
          permissions: data.permissions?.map(
            (permission) => permission.value,
          ),
          is_active:
            data.isActive,
        })
        .eq("id", roleId)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityRoleMapper.toDomain(
      updated,
    );
  }

  async delete(
    roleId: RoleId,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("roles")
        .delete()
        .eq("id", roleId);

    if (error) {
      throw error;
    }
  }
}
