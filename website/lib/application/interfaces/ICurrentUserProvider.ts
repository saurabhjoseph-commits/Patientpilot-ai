/**
 * ============================================================
 * PatientPilot AI
 * Current User Provider
 * ============================================================
 *
 * Application Layer contract for accessing the
 * currently authenticated user.
 *
 * Implemented by the Infrastructure Layer.
 *
 * Possible implementations:
 * - Next.js Middleware
 * - JWT Claims
 * - Supabase Auth
 * - Auth0
 * - Azure AD
 */

export interface CurrentUser {
  /**
   * Authenticated user identifier.
   */
  userId: string;

  /**
   * Current clinic (tenant).
   */
  clinicId: string;

  /**
   * User email.
   */
  email: string;

  /**
   * Display name.
   */
  fullName: string;

  /**
   * Assigned role codes.
   */
  roleCodes: readonly string[];

  /**
   * True when the user is authenticated.
   */
  isAuthenticated: boolean;
}

export interface ICurrentUserProvider {
  /**
   * Returns the currently authenticated user.
   *
   * Returns null when no authenticated user exists.
   */
  getCurrentUser(): Promise<CurrentUser | null>;

  /**
   * Returns true when a user is authenticated.
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Returns true when the current user belongs
   * to the specified role.
   */
  isInRole(
    roleCode: string,
  ): Promise<boolean>;

  /**
   * Returns true when the current user belongs
   * to any of the supplied roles.
   */
  isInAnyRole(
    roleCodes: readonly string[],
  ): Promise<boolean>;
}