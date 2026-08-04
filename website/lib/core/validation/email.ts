/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Email Validation
 * ============================================================
 */

/**
 * Simple email validation pattern suitable for
 * application-level validation.
 */
const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns true if the supplied value is a valid email.
 */
export function isValidEmail(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    EMAIL_REGEX.test(value.trim())
  );
}

/**
 * Validates and normalizes an email address.
 *
 * Returns the normalized email or throws an error.
 */
export function requireEmail(
  value: unknown
): string {
  if (!isValidEmail(value)) {
    throw new Error("Invalid email address.");
  }

  return value.trim().toLowerCase();
}

/**
 * Normalizes an email address.
 */
export function normalizeEmail(
  email: string
): string {
  return email.trim().toLowerCase();
}

/**
 * Returns true if two email addresses are equal,
 * ignoring whitespace and case.
 */
export function emailEquals(
  first: string,
  second: string
): boolean {
  return (
    normalizeEmail(first) ===
    normalizeEmail(second)
  );
}