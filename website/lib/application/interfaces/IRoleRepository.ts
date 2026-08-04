/**
 * ============================================================
 * PatientPilot AI
 * Role Repository
 * ============================================================
 *
 * Application Layer contract for role persistence.
 *
 * Implemented by the Infrastructure Layer
 * (Supabase, PostgreSQL, etc.).
 */

import type {
  ClinicId,
  PermissionCode,
  Role,
  RoleCode,
  RoleId,
  TenantId,
  UserId,
} from "@/lib/platform/domain/identity";

export interface CreateRoleData {
  tenantId: TenantId;

  clinicId: ClinicId;

  code: RoleCode;

  name: string;

  description?: string;

  permissions: readonly PermissionCode[];
}

export interface UpdateRoleData {
  name?: string;

  description?: string;

  permissions?: readonly PermissionCode[];

  isActive?: boolean;
}

export interface IRoleRepository {
  /**
   * Returns a role by identifier.
   */
  findById(
    roleId: RoleId,
  ): Promise<Role | null>;

  /**
   * Returns a role by unique code.
   */
  findByCode(
    code: RoleCode,
  ): Promise<Role | null>;

  /**
   * Returns every available role.
   */
  findAll(): Promise<Role[]>;

  /**
   * Returns every role assigned to a user.
   */
  findByUser(
    userId: UserId,
  ): Promise<Role[]>;

  /**
   * Creates a role.
   */
  create(
    data: CreateRoleData,
  ): Promise<Role>;

  /**
   * Updates an existing role.
   */
  update(
    roleId: RoleId,
    data: UpdateRoleData,
  ): Promise<Role>;

  /**
   * Deletes a role.
   */
  delete(
    roleId: RoleId,
  ): Promise<void>;
}
