/**
 * ============================================================
 * PatientPilot AI
 * Role Assignment Entity
 * ============================================================
 *
 * Represents the assignment of a role to a user.
 *
 * Responsibilities
 * - User ↔ Role relationship
 * - Assignment lifecycle
 * - Activation state
 * - Audit information
 *
 * Framework independent.
 */

import type {
  ClinicId,
  RoleId,
  TenantId,
  UserId,
} from "../identity.types";

export interface RoleAssignmentProps {
  id: string;

  tenantId: TenantId;

  clinicId: ClinicId;

  userId: UserId;

  roleId: RoleId;

  isActive: boolean;

  assignedAt: Date;

  assignedBy?: UserId;

  expiresAt?: Date;

  revokedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export class RoleAssignment {
  private props: RoleAssignmentProps;

  constructor(
    props: RoleAssignmentProps,
  ) {
    this.props = {
      ...props,
    };
  }

  /* -------------------------------------------------------------------------- */
  /* Identity                                                                   */
  /* -------------------------------------------------------------------------- */

  get id(): string {
    return this.props.id;
  }

  get tenantId(): TenantId {
    return this.props.tenantId;
  }

  get clinicId(): ClinicId {
    return this.props.clinicId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get roleId(): RoleId {
    return this.props.roleId;
  }

  /* -------------------------------------------------------------------------- */
  /* Assignment State                                                           */
  /* -------------------------------------------------------------------------- */

  get isActive(): boolean {
    return (
      this.props.isActive &&
      !this.isExpired()
    );
  }

  isExpired(): boolean {
    if (!this.props.expiresAt) {
      return false;
    }

    return new Date() >= this.props.expiresAt;
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  revoke(): void {
    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;
    this.props.revokedAt = new Date();

    this.touch();
  }

  extend(
    expiresAt: Date,
  ): void {
    if (
      this.props.expiresAt &&
      expiresAt <= this.props.expiresAt
    ) {
      throw new Error(
        "Expiration must move forward.",
      );
    }

    this.props.expiresAt = expiresAt;

    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Metadata                                                                   */
  /* -------------------------------------------------------------------------- */

  get assignedAt(): Date {
    return this.props.assignedAt;
  }

  get assignedBy(): UserId | undefined {
    return this.props.assignedBy;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
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
    this.props.updatedAt = new Date();
  }

  /* -------------------------------------------------------------------------- */
  /* Equality                                                                   */
  /* -------------------------------------------------------------------------- */

  equals(
    other: RoleAssignment,
  ): boolean {
    return this.id === other.id;
  }

  /* -------------------------------------------------------------------------- */
  /* Serialization                                                              */
  /* -------------------------------------------------------------------------- */

  toJSON(): RoleAssignmentProps {
    return {
      ...this.props,
    };
  }
}