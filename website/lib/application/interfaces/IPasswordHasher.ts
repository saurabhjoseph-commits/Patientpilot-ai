/**
 * ============================================================
 * PatientPilot AI
 * Password Hasher
 * ============================================================
 *
 * Application Layer contract for password hashing.
 *
 * Implemented by the Infrastructure Layer.
 *
 * Possible implementations:
 * - bcrypt
 * - Argon2
 * - Azure Identity
 * - Auth0
 * - Supabase Auth
 */

export interface IPasswordHasher {
  /**
   * Creates a secure hash for a plain-text password.
   */
  hash(
    password: string,
  ): Promise<string>;

  /**
   * Verifies a plain-text password against a stored hash.
   */
  verify(
    password: string,
    passwordHash: string,
  ): Promise<boolean>;

  /**
   * Determines whether an existing password hash
   * should be upgraded.
   *
   * Useful when increasing bcrypt cost or migrating
   * to a stronger algorithm.
   */
  needsRehash?(
    passwordHash: string,
  ): Promise<boolean>;
}