/**
 * ============================================================
 * PatientPilot AI
 * Authenticate User Response
 * ============================================================
 *
 * Response returned after successful authentication.
 */

export interface AuthenticateUserResponse {
  /**
   * JWT access token.
   */
  accessToken: string;

  /**
   * JWT refresh token.
   */
  refreshToken: string;

  /**
   * Access token expiration.
   */
  expiresAt: Date;

  /**
   * Authenticated user information.
   */
  user: {
    id: string;
    clinicId: string;
    email: string;
    fullName: string;
    roleCodes: readonly string[];
  };
}