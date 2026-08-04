/**
 * ============================================================
 * PatientPilot AI
 * Role Code Value Object
 * ============================================================
 *
 * Represents a validated role code.
 *
 * Examples:
 *
 * owner
 * administrator
 * practice-manager
 * dentist
 * receptionist
 * hygienist
 * support
 * ai-agent
 *
 * Domain Rules:
 * - Immutable
 * - Lowercase
 * - Kebab-case
 * - Comparable
 * - Framework independent
 */

const ROLE_CODE_PATTERN =
  /^[a-z][a-z0-9-]*$/;

export class RoleCode {
  /**
   * Normalized role code.
   */
  public readonly value: string;

  private constructor(
    value: string,
  ) {
    this.value = value;

    Object.freeze(this);
  }

  /**
   * Creates a validated role code.
   */
  static create(
    value: string,
  ): RoleCode {
    const normalized =
      RoleCode.normalize(value);

    if (!RoleCode.isValid(normalized)) {
      throw new Error(
        `Invalid role code: "${value}".`,
      );
    }

    return new RoleCode(normalized);
  }

  /**
   * Normalizes a role code.
   */
  static normalize(
    value: string,
  ): string {
    return value
      .trim()
      .toLowerCase();
  }

  /**
   * Validates the role code.
   */
  static isValid(
    value: string,
  ): boolean {
    if (!value) {
      return false;
    }

    if (value.length > 50) {
      return false;
    }

    return ROLE_CODE_PATTERN.test(value);
  }

  /**
   * Compares two role codes.
   */
  equals(
    other: RoleCode,
  ): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the role code.
   */
  toString(): string {
    return this.value;
  }

  /**
   * JSON serialization.
   */
  toJSON(): string {
    return this.value;
  }
}