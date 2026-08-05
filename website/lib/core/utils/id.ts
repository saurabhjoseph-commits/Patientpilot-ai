/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * ID Utilities
 * ============================================================
 */

import type { UUID } from "../types/common";

/**
 * Generates a UUID.
 *
 * Uses the native Web Crypto API available in modern
 * browsers and Node.js (Next.js runtime).
 */
export function generateId(): UUID {
  return crypto.randomUUID();
}

/**
 * Type-safe alias for generateId().
 */
export function generateUUID(): UUID {
  return generateId();
}

/**
 * Returns true if the supplied value is a valid UUID.
 */
export function isValidUUID(value: string): value is UUID {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);
}

/**
 * Ensures a UUID is valid.
 *
 * Throws an Error if invalid.
 */
export function assertUUID(value: string): asserts value is UUID {
  if (!isValidUUID(value)) {
    throw new Error(`Invalid UUID: ${value}`);
  }
}

/**
 * Removes dashes from a UUID.
 */
export function compactUUID(id: UUID): string {
  return id.replace(/-/g, "");
}

/**
 * Adds dashes back to a compact UUID.
 *
 * Returns null if the input is invalid.
 */
export function expandUUID(value: string): UUID | null {
  if (value.length !== 32) {
    return null;
  }

  const formatted = value.replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
    "$1-$2-$3-$4-$5"
  );

  return isValidUUID(formatted) ? formatted : null;
}