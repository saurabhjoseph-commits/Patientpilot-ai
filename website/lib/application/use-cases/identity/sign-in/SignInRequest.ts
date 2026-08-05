/**
 * ============================================================
 * PatientPilot AI
 * Sign In Request
 * ============================================================
 *
 * Input model for the SignIn use case.
 *
 * This object is application-layer only and remains independent
 * of HTTP, Next.js, Supabase, or UI frameworks.
 */

export interface SignInRequest {
  /**
   * User email address.
   */
  email: string;

  /**
   * Plain-text password supplied by the user.
   *
   * The password is verified by the PasswordHasher
   * inside the application workflow. It is never
   * stored in the domain model.
   */
  password: string;

  /**
   * Optional client IP address.
   *
   * Used for:
   * - Audit logging
   * - Security monitoring
   * - Login analytics
   */
  ipAddress?: string;

  /**
   * Optional browser / device information.
   *
   * Used for:
   * - Session management
   * - Device recognition
   * - Security analysis
   */
  userAgent?: string;
}