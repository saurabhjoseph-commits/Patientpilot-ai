/**
 * ============================================================
 * PatientPilot AI
 * Role Entity
 * ============================================================
 *
 * Represents an authorization role within the Identity Domain.
 *
 * Responsibilities
 * - Role identity
 * - Role metadata
 * - Permission management
 * - Activation state
 *
 * Framework independent.
 */

import type {
  RoleId,
  TenantId,
} from "../identity.types";

import { PermissionCode } from "../value-objects/permission-code";
import { RoleCode } from "../value-objects/role-code";

export interface RoleProps {
  id: RoleId;

  tenantId?: TenantId;

  code: RoleCode;

  name: string;

  description?: string;

  permissions: readonly PermissionCode[];

  isSystem: boolean;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export class Role {
  private props: RoleProps;

  constructor(
    props: RoleProps,
  ) {
    this.props = {
      ...props,
      permissions: [...props.permissions],
    };
  }

  /* -------------------------------------------------------------------------- */
  /* Identity                                                                   */
  /* -------------------------------------------------------------------------- */

  get id(): RoleId {
    return this.props.id;
  }

  get tenantId(): TenantId | undefined {
    return this.props.tenantId;
  }

  get code(): RoleCode {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  /* -------------------------------------------------------------------------- */
  /* State                                                                      */
  /* -------------------------------------------------------------------------- */

  get isSystem(): boolean {
    return this.props.isSystem;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  activate(): void {
    this.props.isActive = true;

    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;

    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Permissions                                                                */
  /* -------------------------------------------------------------------------- */

  get permissions(): readonly PermissionCode[] {
    return [...this.props.permissions];
  }

  hasPermission(
    permission: PermissionCode,
  ): boolean {
    return this.props.permissions.some(
      (existing) =>
        existing.equals(permission),
    );
  }

  addPermission(
    permission: PermissionCode,
  ): void {
    if (this.hasPermission(permission)) {
      return;
    }

    this.props.permissions = [
      ...this.props.permissions,
      permission,
    ];

    this.touch();
  }

  removePermission(
    permission: PermissionCode,
  ): void {
    this.props.permissions =
      this.props.permissions.filter(
        (existing) =>
          !existing.equals(permission),
      );

    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Metadata                                                                   */
  /* -------------------------------------------------------------------------- */

  rename(
    name: string,
  ): void {
    const value = name.trim();

    if (!value) {
      throw new Error(
        "Role name is required.",
      );
    }

    this.props.name = value;

    this.touch();
  }

  updateDescription(
    description?: string,
  ): void {
    this.props.description =
      description?.trim() || undefined;

    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Audit                                                                      */
  /* -------------------------------------------------------------------------- */

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private touch(): void {
    this.props.updatedAt =
      new Date();
  }

  /* -------------------------------------------------------------------------- */
  /* Serialization                                                              */
  /* -------------------------------------------------------------------------- */

  toJSON(): RoleProps {
    return {
      ...this.props,
      permissions: [...this.props.permissions],
    };
  }
}