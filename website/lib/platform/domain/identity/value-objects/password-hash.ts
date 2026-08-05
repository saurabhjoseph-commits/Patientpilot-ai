/**
 * ============================================================
 * PatientPilot AI
 * Password Hash Value Object
 * ============================================================
 *
 * Represents a validated password hash.
 *
 * IMPORTANT:
 * - Never stores plain-text passwords.
 * - Never performs hashing.
 * - Never verifies passwords.
 *
 * Hashing is the responsibility of the Infrastructure Layer
 * through IPasswordHasher.
 */

export class PasswordHash {
  /**
   * Supported hash prefixes.
   *
   * Allows future migration from bcrypt to Argon2 without
   * changing the domain model.
   */
  private static readonly SUPPORTED_PREFIXES = [
    "$2a$", // bcrypt
    "$2b$", // bcrypt
    "$2y$", // bcrypt
    "$argon2i$",
    "$argon2id$",
    "$argon2d$",
  ] as const;

  /**
   * Password hash value.
   */
  public readonly value: string;

  private constructor(
    value: string,
  ) {
    this.value = value;
    Object.freeze(this);
  }

  /**
   * Creates a validated password hash.
   */
  static create(
    value: string,
  ): PasswordHash {
    const normalized = value.trim();

    if (!PasswordHash.isValid(normalized)) {
      throw new Error(
        "Invalid password hash.",
      );
    }

    return new PasswordHash(normalized);
  }

  /**
   * Returns true if the supplied value appears to be
   * a supported password hash.
   */
  static isValid(
    value: string,
  ): boolean {
    if (!value) {
      return false;
    }

    if (value.length < 20) {
      return false;
    }

    return PasswordHash.SUPPORTED_PREFIXES.some(
      (prefix) => value.startsWith(prefix),
    );
  }

  /**
   * Compares two password hashes.
   */
  equals(
    other: PasswordHash,
  ): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the underlying hash.
   */
  toString(): string {
    return this.value;
  }

  /**
   * Used automatically by JSON.stringify().
   */
  toJSON(): string {
    return this.value;
  }
}