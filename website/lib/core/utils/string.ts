/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * String Utilities
 * ============================================================
 */

/**
 * Returns true if the value is null, undefined,
 * or contains only whitespace.
 */
export function isBlank(value?: string | null): boolean {
  return value == null || value.trim().length === 0;
}

/**
 * Returns true if the value contains non-whitespace characters.
 */
export function isNotBlank(value?: string | null): boolean {
  return !isBlank(value);
}

/**
 * Trims whitespace safely.
 */
export function safeTrim(value?: string | null): string {
  return value?.trim() ?? "";
}

/**
 * Capitalizes the first character.
 */
export function capitalize(value: string): string {
  if (isBlank(value)) {
    return "";
  }

  const trimmed = safeTrim(value);

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Converts a string to Title Case.
 */
export function toTitleCase(value: string): string {
  return safeTrim(value)
    .toLowerCase()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

/**
 * Removes duplicate whitespace.
 */
export function normalizeWhitespace(value: string): string {
  return safeTrim(value).replace(/\s+/g, " ");
}

/**
 * Truncates text with an ellipsis.
 */
export function truncate(
  value: string,
  maxLength: number
): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}

/**
 * Removes all non-alphanumeric characters except spaces.
 */
export function sanitizeText(value: string): string {
  return normalizeWhitespace(
    value.replace(/[^\p{L}\p{N}\s]/gu, "")
  );
}

/**
 * Converts text into a URL-friendly slug.
 */
export function slugify(value: string): string {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Masks a string while keeping the last N characters visible.
 */
export function mask(
  value: string,
  visibleCharacters = 4
): string {
  if (value.length <= visibleCharacters) {
    return value;
  }

  return (
    "*".repeat(value.length - visibleCharacters) +
    value.slice(-visibleCharacters)
  );
}

/**
 * Returns true if two strings are equal,
 * ignoring case and surrounding whitespace.
 */
export function equalsIgnoreCase(
  first: string,
  second: string
): boolean {
  return safeTrim(first).toLowerCase() ===
         safeTrim(second).toLowerCase();
}