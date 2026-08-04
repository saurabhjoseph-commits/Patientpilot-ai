/**
 * ============================================================
 * PatientPilot AI
 * User Status
 * ============================================================
 *
 * Defines the lifecycle of a platform user account.
 *
 * This enum belongs to the Domain Layer and must remain
 * framework-independent.
 */

/**
 * Current status of a user account.
 */
export enum UserStatus {
  /**
   * User has been invited but has not yet activated
   * their account.
   */
  Invited = "invited",

  /**
   * User account is active and can authenticate.
   */
  Active = "active",

  /**
   * User account has been temporarily disabled
   * by an administrator.
   */
  Inactive = "inactive",

  /**
   * User account has been suspended.
   * Authentication is not permitted until restored.
   */
  Suspended = "suspended",

  /**
   * User account has been locked automatically
   * due to security policies (e.g. failed logins).
   */
  Locked = "locked",

  /**
   * User account has been archived.
   * Historical data is preserved but login
   * is permanently disabled.
   */
  Archived = "archived",
}

/**
 * User statuses that are allowed to authenticate.
 */
export const AUTHENTICATABLE_USER_STATUSES: readonly UserStatus[] = [
  UserStatus.Active,
] as const;

/**
 * User statuses that prevent authentication.
 */
export const BLOCKED_USER_STATUSES: readonly UserStatus[] = [
  UserStatus.Invited,
  UserStatus.Inactive,
  UserStatus.Suspended,
  UserStatus.Locked,
  UserStatus.Archived,
] as const;