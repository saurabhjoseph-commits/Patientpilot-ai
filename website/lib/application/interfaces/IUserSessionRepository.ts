/**
 * ============================================================
 * PatientPilot AI
 * User Session Repository
 * ============================================================
 *
 * Application Layer contract for authenticated user sessions.
 *
 * Implemented by the Infrastructure Layer
 * (Supabase, PostgreSQL, Redis, etc.).
 */

import type {
  SessionId,
  User,
  UserId,
  UserSession,
} from "@/lib/platform/domain/identity";

export interface CreateUserSessionData {
  /**
   * Authenticated user.
   */
  user: User;

  refreshTokenId: string;

  /**
   * Optional client IP.
   */
  ipAddress?: string;

  /**
   * Optional browser / device information.
   */
  userAgent?: string;

  /**
   * Optional device name.
   */
  deviceName?: string;
}

export interface IUserSessionRepository {
  /**
   * Returns a session by identifier.
   */
  findById(
    sessionId: SessionId,
  ): Promise<UserSession | null>;

  /**
   * Returns the active session for a refresh token.
   */
  findByRefreshTokenId(
    refreshTokenId: string,
  ): Promise<UserSession | null>;

  /**
   * Returns all active sessions for a user.
   */
  findActiveByUser(
    userId: UserId,
  ): Promise<UserSession[]>;

  /**
   * Creates a new authenticated session.
   */
  create(
    data: CreateUserSessionData,
  ): Promise<UserSession>;

  /**
   * Persists changes to an existing session.
   */
  update(
    session: UserSession,
  ): Promise<UserSession>;

  /**
   * Revokes a single session.
   */
  revoke(
    sessionId: SessionId,
  ): Promise<void>;

  /**
   * Revokes all active sessions for a user.
   */
  revokeAllForUser(
    userId: UserId,
  ): Promise<void>;

  /**
   * Deletes expired sessions.
   */
  deleteExpired(): Promise<number>;
}
