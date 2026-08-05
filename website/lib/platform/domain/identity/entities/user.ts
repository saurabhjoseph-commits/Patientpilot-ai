/**
 * ============================================================
 * PatientPilot AI
 * User Entity
 * ============================================================
 *
 * Aggregate Root for the Identity Domain.
 *
 * Responsibilities
 * - User lifecycle
 * - Account status
 * - Activation / suspension
 * - Login tracking
 * - Email verification
 *
 * This entity is framework independent.
 */

import { AuthenticationProvider } from "../enums/authentication-provider";
import { UserStatus } from "../enums/user-status";

import type {
  ClinicId,
  TenantId,
  UserId,
} from "../identity.types";

import { EmailAddress } from "../value-objects/email-address";

export interface UserProps {
  id: UserId;

  tenantId: TenantId;

  clinicId: ClinicId;

  fullName: string;

  email: EmailAddress;

  status: UserStatus;

  authenticationProvider: AuthenticationProvider;

  emailVerified: boolean;

  lastLoginAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export class User {
  private readonly props: UserProps;

  constructor(
    props: UserProps,
  ) {
    this.props = {
      ...props,
    };
  }

  /* -------------------------------------------------------------------------- */
  /* Identity                                                                   */
  /* -------------------------------------------------------------------------- */

  get id(): UserId {
    return this.props.id;
  }

  get tenantId(): TenantId {
    return this.props.tenantId;
  }

  get clinicId(): ClinicId {
    return this.props.clinicId;
  }

  /* -------------------------------------------------------------------------- */
  /* Profile                                                                     */
  /* -------------------------------------------------------------------------- */

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): EmailAddress {
    return this.props.email;
  }

  updateName(
    fullName: string,
  ): void {
    const value = fullName.trim();

    if (!value) {
      throw new Error(
        "Full name is required.",
      );
    }

    this.props.fullName = value;

    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Status                                                                      */
  /* -------------------------------------------------------------------------- */

  get status(): UserStatus {
    return this.props.status;
  }

  isActive(): boolean {
    return (
      this.props.status ===
      UserStatus.Active
    );
  }

  activate(): void {
    this.props.status =
      UserStatus.Active;

    this.touch();
  }

  deactivate(): void {
    this.props.status =
      UserStatus.Inactive;

    this.touch();
  }

  suspend(): void {
    this.props.status =
      UserStatus.Suspended;

    this.touch();
  }

  lock(): void {
    this.props.status =
      UserStatus.Locked;

    this.touch();
  }

  archive(): void {
    this.props.status =
      UserStatus.Archived;

    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Authentication                                                              */
  /* -------------------------------------------------------------------------- */

  get authenticationProvider(): AuthenticationProvider {
    return this.props.authenticationProvider;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  verifyEmail(): void {
    this.props.emailVerified = true;

    this.touch();
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  recordSuccessfulLogin(): void {
    this.props.lastLoginAt =
      new Date();

    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Audit                                                                       */
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
  /* Serialization                                                               */
  /* -------------------------------------------------------------------------- */

  toJSON(): UserProps {
    return {
      ...this.props,
    };
  }
}