/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Phone Validation
 * ============================================================
 */

/**
 * E.164 phone number format.
 *
 * Examples:
 * +14155552671
 * +919876543210
 * +61412345678
 */
const E164_REGEX = /^\+[1-9]\d{7,14}$/;

/**
 * Removes whitespace, dashes, brackets and dots.
 */
export function normalizePhone(
  value: string
): string {
  return value
    .trim()
    .replace(/[\s().-]/g, "");
}

/**
 * Returns true if the supplied phone number
 * is a valid E.164 number.
 */
export function isValidPhone(
  value: unknown
): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return E164_REGEX.test(normalizePhone(value));
}

/**
 * Validates and returns a normalized phone number.
 */
export function requirePhone(
  value: unknown
): string {
  if (!isValidPhone(value)) {
    throw new Error("Invalid phone number.");
  }

  return normalizePhone(value);
}

/**
 * Returns true if two phone numbers represent
 * the same normalized value.
 */
export function phoneEquals(
  first: string,
  second: string
): boolean {
  return (
    normalizePhone(first) ===
    normalizePhone(second)
  );
}

/**
 * Returns the country calling code.
 *
 * Example:
 * +919876543210 -> +91
 */
export function getCountryCode(
  phone: string
): string | null {
  const normalized = normalizePhone(phone);

  const match = normalized.match(/^\+\d{1,3}/);

  return match?.[0] ?? null;
}