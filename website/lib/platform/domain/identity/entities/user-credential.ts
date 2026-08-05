/**
 * ============================================================
 * PatientPilot AI
 * User Credential Entity
 * ============================================================
 *
 * Represents authentication credentials for a user.
 *
 * Responsibilities
 * - Password hash
 * - Authentication provider
 * - Password lifecycle
 * - Failed login tracking
 * - Account lock state
 *
 * Framework independent.
 */

import { AuthenticationProvider } from "../enums/authentication-provider";

import type {
  UserId,
} from "../identity.types";

import { PasswordHash } from "../value-objects/password-hash";

export interface UserCredentialProps {
  id: string;

  userId: UserId;

  authenticationProvider: AuthenticationProvider;

  passwordHash?: PasswordHash;

  failedLoginAttempts: number;

  lockedUntil?: Date;

  passwordChangedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export class UserCredential {
  private props: UserCredentialProps;

  constructor(
    props: UserCredentialProps,
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

  get userId(): UserId {
    return this.props.userId;
  }

  get authenticationProvider(): AuthenticationProvider {
    return this.props.authenticationProvider;
  }

  /* -------------------------------------------------------------------------- */
  /* Password                                                                    */
  /* -------------------------------------------------------------------------- */

  get passwordHash(): PasswordHash | undefined {
    return this.props.passwordHash;
  }

  hasPassword(): boolean {
    return this.props.passwordHash !== undefined;
  }

  changePassword(
    hash: PasswordHash,
  ): void {
    this.props.passwordHash = hash;
    this.props.passwordChangedAt = new Date();
    this.resetFailedLoginAttempts();
    this.unlock();
    this.touch();
  }

  get passwordChangedAt(): Date | undefined {
    return this.props.passwordChangedAt;
  }

  /* -------------------------------------------------------------------------- */
  /* Failed Login Attempts                                                      */
  /* -------------------------------------------------------------------------- */

  get failedLoginAttempts(): number {
    return this.props.failedLoginAttempts;
  }

  recordFailedLogin(): void {
    this.props.failedLoginAttempts += 1;
    this.touch();
  }

  resetFailedLoginAttempts(): void {
    this.props.failedLoginAttempts = 0;
    this.touch();
  }

  /* -------------------------------------------------------------------------- */
  /* Lock State                                                                 */
  /* -------------------------------------------------------------------------- */

  isLocked(): boolean {
    if (!this.props.lockedUntil) {
      return false;
    }

    return this.props.lockedUntil > new Date();
  }

  lockUntil(
    until: Date,
  ): void {
    this.props.lockedUntil = until;
    this.touch();
  }

  unlock(): void {
    this.props.lockedUntil = undefined;
    this.touch();
  }

  get lockedUntil(): Date | undefined {
    return this.props.lockedUntil;
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
    other: UserCredential,
  ): boolean {
    return this.id === other.id;
  }

  /* -------------------------------------------------------------------------- */
  /* Serialization                                                              */
  /* -------------------------------------------------------------------------- */

  toJSON(): UserCredentialProps {
    return {
      ...this.props,
    };
  }
}