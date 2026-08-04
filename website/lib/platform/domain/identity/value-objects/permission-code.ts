/**
 * ============================================================
 * PatientPilot AI
 * Permission Code Value Object
 * ============================================================
 *
 * Represents a validated permission code.
 *
 * Examples:
 *
 * patients.read
 * patients.write
 * appointments.manage
 * users.invite
 * analytics.view
 *
 * Domain Rules:
 * - Immutable
 * - Lowercase
 * - Dot-separated
 * - Comparable
 * - Framework independent
 */

const PERMISSION_CODE_PATTERN =
  /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/;

export class PermissionCode {
  /**
   * Normalized permission code.
   */
  public readonly value: string;

  private constructor(
    value: string,
  ) {
    this.value = value;

    Object.freeze(this);
  }

  /**
   * Creates a validated permission code.
   */
  static create(
    value: string,
  ): PermissionCode {
    const normalized =
      PermissionCode.normalize(value);

    if (!PermissionCode.isValid(normalized)) {
      throw new Error(
        `Invalid permission code: "${value}".`,
      );
    }

    return new PermissionCode(normalized);
  }

  /**
   * Normalizes a permission code.
   */
  static normalize(
    value: string,
  ): string {
    return value
      .trim()
      .toLowerCase();
  }

  /**
   * Returns true when the supplied permission
   * code follows the required naming convention.
   */
  static isValid(
    value: string,
  ): boolean {
    if (!value) {
      return false;
    }

    if (value.length > 100) {
      return false;
    }

    return PERMISSION_CODE_PATTERN.test(
      value,
    );
  }

  /**
   * Returns true when both permission codes
   * represent the same permission.
   */
  equals(
    other: PermissionCode,
  ): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the permission code.
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

  /**
   * Returns the resource portion.
   *
   * Example:
   * patients.read -> patients
   */
  get resource(): string {
    return this.value.split(".")[0];
  }

  /**
   * Returns the action portion.
   *
   * Example:
   * patients.read -> read
   */
  get action(): string {
    return this.value.split(".").slice(1).join(".");
  }
}