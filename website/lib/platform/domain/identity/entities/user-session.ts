/**
 * ============================================================
 * PatientPilot AI
 * User Session Entity
 * ============================================================
 *
 * Represents an authenticated user session.
 *
 * Responsibilities
 * - Session lifecycle
 * - Expiration
 * - Revocation
 * - Activity tracking
 * - Device information
 *
 * Framework independent.
 */

import { SessionStatus } from "../enums/session-status";

import type { UserId } from "../identity.types";

import { SessionId } from "../value-objects/session-id";

export interface UserSessionProps {
  id: SessionId;

  userId: UserId;

  refreshTokenId: string;

  status: SessionStatus;

  ipAddress?: string;

  userAgent?: string;

  deviceName?: string;

  createdAt: Date;

  lastActivityAt: Date;

  expiresAt: Date;

  revokedAt?: Date;
}

export class UserSession {
  private props: UserSessionProps;

  constructor(
    props: UserSessionProps,
  ) {
    this.props = {
      ...props,
    };
  }

  /* -------------------------------------------------------------------------- */
  /* Identity                                                                   */
  /* -------------------------------------------------------------------------- */

  get id(): SessionId {
    return this.props.id;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get refreshTokenId(): string {
    return this.props.refreshTokenId;
  }

  /* -------------------------------------------------------------------------- */
  /* Session State                                                              */
  /* -------------------------------------------------------------------------- */

  get status(): SessionStatus {
    return this.props.status;
  }

  isActive(): boolean {
    return (
      this.props.status === SessionStatus.Active &&
      !this.isExpired()
    );
  }

  isExpired(): boolean {
    return (
      new Date() >= this.props.expiresAt
    );
  }

  revoke(): void {
    if (
      this.props.status ===
      SessionStatus.Revoked
    ) {
      return;
    }

    this.props.status =
      SessionStatus.Revoked;

    this.props.revokedAt =
      new Date();
  }

  replace(): void {
    this.props.status =
      SessionStatus.Replaced;
  }

  terminate(): void {
    this.props.status =
      SessionStatus.Terminated;

    this.props.revokedAt =
      new Date();
  }

  expire(): void {
    this.props.status =
      SessionStatus.Expired;
  }

  /* -------------------------------------------------------------------------- */
  /* Activity                                                                   */
  /* -------------------------------------------------------------------------- */

  get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  recordActivity(): void {
    this.props.lastActivityAt =
      new Date();
  }

  /* -------------------------------------------------------------------------- */
  /* Device                                                                      */
  /* -------------------------------------------------------------------------- */

  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  get deviceName(): string | undefined {
    return this.props.deviceName;
  }

  /* -------------------------------------------------------------------------- */
  /* Expiration                                                                 */
  /* -------------------------------------------------------------------------- */

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  extend(
    expiresAt: Date,
  ): void {
    if (
      expiresAt <= this.props.expiresAt
    ) {
      throw new Error(
        "Session expiration must move forward.",
      );
    }

    this.props.expiresAt =
      expiresAt;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  /* -------------------------------------------------------------------------- */
  /* Equality                                                                   */
  /* -------------------------------------------------------------------------- */

  equals(
    other: UserSession,
  ): boolean {
    return this.id === other.id;
  }

  /* -------------------------------------------------------------------------- */
  /* Serialization                                                              */
  /* -------------------------------------------------------------------------- */

  toJSON(): UserSessionProps {
    return {
      ...this.props,
    };
  }
}
