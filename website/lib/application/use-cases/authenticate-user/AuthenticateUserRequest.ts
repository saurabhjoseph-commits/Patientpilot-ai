/**
 * ============================================================
 * PatientPilot AI
 * Authenticate User Request
 * ============================================================
 *
 * Request model for user authentication.
 */

export interface AuthenticateUserRequest {
  /**
   * User email address.
   */
  email: string;

  /**
   * Plain-text password.
   */
  password: string;

  /**
   * Optional clinic identifier for multi-tenant login.
   */
  clinicId?: string;

  /**
   * Keep the user signed in.
   */
  rememberMe?: boolean;
}