/**
 * ============================================================
 * PatientPilot AI
 * Authorization Domain Service
 * ============================================================
 *
 * Central authorization logic for the Identity Domain.
 *
 * Responsibilities
 * - Permission evaluation
 * - Role evaluation
 * - Authorization decisions
 *
 * Framework independent.
 */

import { PermissionCode } from "../value-objects/permission-code";
import { RoleCode } from "../value-objects/role-code";

import { Permission } from "../entities/permission";
import { Role } from "../entities/role";
import { RoleAssignment } from "../entities/role-assignment";

export class AuthorizationService {
  /**
   * Returns true when the user has the specified role.
   */
  hasRole(
    roleAssignments: readonly RoleAssignment[],
    roles: readonly Role[],
    roleCode: RoleCode,
  ): boolean {
    return roles.some((role) => {
      if (!role.code.equals(roleCode)) {
        return false;
      }

      return roleAssignments.some(
        (assignment) =>
          assignment.roleId === role.id &&
          assignment.isActive,
      );
    });
  }

  /**
   * Returns true when the supplied role grants
   * the specified permission.
   */
  roleHasPermission(
    role: Role,
    permission: PermissionCode,
  ): boolean {
    if (!role.isActive) {
      return false;
    }

    return role.hasPermission(permission);
  }

  /**
   * Returns true when the user has the permission.
   */
  hasPermission(
    roleAssignments: readonly RoleAssignment[],
    roles: readonly Role[],
    permission: PermissionCode,
  ): boolean {
    for (const assignment of roleAssignments) {
      if (!assignment.isActive) {
        continue;
      }

      const role = roles.find(
        (candidate) =>
          candidate.id === assignment.roleId,
      );

      if (!role) {
        continue;
      }

      if (!role.isActive) {
        continue;
      }

      if (role.hasPermission(permission)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns every effective permission for a user.
   */
  getPermissions(
    roleAssignments: readonly RoleAssignment[],
    roles: readonly Role[],
  ): PermissionCode[] {
    const permissions = new Map<
      string,
      PermissionCode
    >();

    for (const assignment of roleAssignments) {
      if (!assignment.isActive) {
        continue;
      }

      const role = roles.find(
        (candidate) =>
          candidate.id === assignment.roleId,
      );

      if (!role || !role.isActive) {
        continue;
      }

      for (const permission of role.permissions) {
        permissions.set(
          permission.value,
          permission,
        );
      }
    }

    return [...permissions.values()];
  }

  /**
   * Returns every effective role.
   */
  getRoles(
    roleAssignments: readonly RoleAssignment[],
    roles: readonly Role[],
  ): Role[] {
    return roles.filter((role) =>
      roleAssignments.some(
        (assignment) =>
          assignment.isActive &&
          assignment.roleId === role.id,
      ),
    );
  }

  /**
   * Throws when authorization fails.
   */
  ensurePermission(
    roleAssignments: readonly RoleAssignment[],
    roles: readonly Role[],
    permission: PermissionCode,
  ): void {
    if (
      !this.hasPermission(
        roleAssignments,
        roles,
        permission,
      )
    ) {
      throw new Error(
        `Permission denied: ${permission.value}`,
      );
    }
  }

  /**
   * Throws when the required role is missing.
   */
  ensureRole(
    roleAssignments: readonly RoleAssignment[],
    roles: readonly Role[],
    roleCode: RoleCode,
  ): void {
    if (
      !this.hasRole(
        roleAssignments,
        roles,
        roleCode,
      )
    ) {
      throw new Error(
        `Role required: ${roleCode.value}`,
      );
    }
  }
}