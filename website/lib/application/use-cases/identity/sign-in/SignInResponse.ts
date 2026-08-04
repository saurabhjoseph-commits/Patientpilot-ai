/**
 * ============================================================
 * PatientPilot AI
 * Sign In Response
 * ============================================================
 *
 * Output model returned after successful authentication.
 *
 * This DTO is application-layer only and remains independent
 * of HTTP, Next.js, Supabase, or UI frameworks.
 */

export interface AuthenticatedUser {
  /**
   * User identifier.
   */
  id: string;

  /**
   * Tenant identifier.
   */
  tenantId: string;

  /**
   * Clinic identifier.
   */
  clinicId: string;

  /**
   * User display name.
   */
  fullName: string;

  /**
   * User email address.
   */
  email: string;

  /**
   * Assigned role codes.
   */
  roleCodes: readonly string[];
}

export interface SignInResponse {
  /**
   * JWT access token.
   */
  accessToken: string;

  /**
   * JWT refresh token.
   */
  refreshToken: string;

  /**
   * Session identifier.
   */
  sessionId: string;

  /**
   * Access token expiration time.
   */
  expiresAt: Date;

  /**
   * Authenticated user.
   */
  user: AuthenticatedUser;
}