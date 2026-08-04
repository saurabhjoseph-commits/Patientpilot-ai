/**
 * ============================================================
 * PatientPilot AI
 * Session Status
 * ============================================================
 *
 * Defines the lifecycle of an authenticated user session.
 *
 * This enum belongs to the Domain Layer and must remain
 * framework-independent.
 */

/**
 * Current status of a user session.
 */
export enum SessionStatus {
  /**
   * Session is valid and may be used for authentication.
   */
  Active = "active",

  /**
   * Session has expired because its lifetime elapsed.
   */
  Expired = "expired",

  /**
   * Session was explicitly revoked.
   *
   * Examples:
   * - User logged out
   * - Logout from all devices
   * - Administrator revoked access
   */
  Revoked = "revoked",

  /**
   * Session has been invalidated because a refresh token
   * was rotated or replaced.
   */
  Replaced = "replaced",

  /**
   * Session has been terminated due to a security event.
   *
   * Examples:
   * - Password changed
   * - Suspicious activity detected
   * - Account compromised
   */
  Terminated = "terminated",
}

/**
 * Session statuses that are considered valid.
 */
export const ACTIVE_SESSION_STATUSES: readonly SessionStatus[] = [
  SessionStatus.Active,
] as const;

/**
 * Session statuses that are no longer valid for authentication.
 */
export const INACTIVE_SESSION_STATUSES: readonly SessionStatus[] = [
  SessionStatus.Expired,
  SessionStatus.Revoked,
  SessionStatus.Replaced,
  SessionStatus.Terminated,
] as const;

/**
 * Returns true if the session can be used for authentication.
 */
export function isSessionActive(
  status: SessionStatus,
): boolean {
  return ACTIVE_SESSION_STATUSES.includes(status);
}