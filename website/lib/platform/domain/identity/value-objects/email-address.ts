/**
 * ============================================================
 * PatientPilot AI
 * Email Address Value Object
 * ============================================================
 *
 * Represents a validated and normalized email address.
 *
 * Domain Rules:
 * - Immutable
 * - Normalized to lowercase
 * - Trimmed
 * - Validated before creation
 * - Framework independent
 */

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailAddress {
  /**
   * Normalized email value.
   */
  public readonly value: string;

  private constructor(
    value: string,
  ) {
    this.value = value;
    Object.freeze(this);
  }

  /**
   * Creates a validated email address.
   */
  static create(
    value: string,
  ): EmailAddress {
    const normalized =
      EmailAddress.normalize(value);

    if (!EmailAddress.isValid(normalized)) {
      throw new Error(
        `Invalid email address: "${value}".`,
      );
    }

    return new EmailAddress(normalized);
  }

  /**
   * Normalizes an email address.
   */
  static normalize(
    value: string,
  ): string {
    return value.trim().toLowerCase();
  }

  /**
   * Checks whether a string is a valid email.
   */
  static isValid(
    value: string,
  ): boolean {
    if (!value) {
      return false;
    }

    if (value.length > 320) {
      return false;
    }

    return EMAIL_PATTERN.test(value);
  }

  /**
   * Compares two email addresses.
   */
  equals(
    other: EmailAddress,
  ): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the email as a string.
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