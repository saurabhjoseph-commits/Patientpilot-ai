import {
  PermissionCode,
  Role,
  RoleCode,
} from "@/lib/platform/domain/identity";

interface SupabaseRoleRow {
  id: string;
  tenant_id: string | null;
  code: string;
  name: string;
  description: string | null;
  permissions: readonly string[] | null;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class IdentityRoleMapper {
  static toDomain(row: SupabaseRoleRow): Role {
    return new Role({
      id: row.id,
      tenantId: row.tenant_id ?? undefined,
      code: RoleCode.create(row.code),
      name: row.name,
      description: row.description ?? undefined,
      permissions: (row.permissions ?? []).map(
        PermissionCode.create,
      ),
      isSystem: row.is_system,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  static toPersistence(role: Role) {
    return {
      id: role.id,
      tenant_id: role.tenantId ?? null,
      code: role.code.value,
      name: role.name,
      description: role.description ?? null,
      permissions: role.permissions.map(
        (permission) => permission.value,
      ),
      is_system: role.isSystem,
      is_active: role.isActive,
      created_at: role.createdAt.toISOString(),
      updated_at: role.updatedAt.toISOString(),
    };
  }
}
