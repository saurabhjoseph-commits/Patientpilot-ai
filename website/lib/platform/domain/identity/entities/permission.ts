/**
 * ============================================================
 * PatientPilot AI
 * Permission Entity
 * ============================================================
 *
 * Represents a permission within the Identity Domain.
 *
 * Responsibilities
 * - Permission identity
 * - Permission metadata
 * - Activation state
 * - Audit information
 *
 * Framework independent.
 */

import type {
  PermissionId,
  TenantId,
} from "../identity.types";

import { PermissionCode } from "../value-objects/permission-code";

export interface PermissionProps {
  id: PermissionId;

  tenantId?: TenantId;

  code: PermissionCode;

  name: string;

  description?: string;

  isSystem: boolean;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export class Permission {
  private props: PermissionProps;

  constructor(
    props: PermissionProps,
  ) {
    this.props = {
      ...props,
    };
  }

  /* -------------------------------------------------------------------------- */
  /* Identity                                                                   */
  /* -------------------------------------------------------------------------- */

  get id(): PermissionId {
    return this.props.id;
  }

  get tenantId(): TenantId | undefined {
    return this.props.tenantId;
  }

  get code(): PermissionCode {
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
  /* Metadata                                                                   */
  /* -------------------------------------------------------------------------- */

  rename(
    name: string,
  ): void {
    const value = name.trim();

    if (!value) {
      throw new Error(
        "Permission name is required.",
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
  /* Equality                                                                   */
  /* -------------------------------------------------------------------------- */

  equals(
    other: Permission,
  ): boolean {
    return this.id === other.id;
  }

  /* -------------------------------------------------------------------------- */
  /* Serialization                                                              */
  /* -------------------------------------------------------------------------- */

  toJSON(): PermissionProps {
    return {
      ...this.props,
    };
  }
}