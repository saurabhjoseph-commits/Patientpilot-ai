/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * UUID Validation
 * ============================================================
 */

import type { UUID } from "../types/common";
import { isValidUUID } from "../utils/id";

/**
 * Validates that a value is a UUID.
 */
export function validateUUID(value: unknown): value is UUID {
  return typeof value === "string" && isValidUUID(value);
}

/**
 * Returns a validated UUID or throws an error.
 */
export function requireUUID(value: unknown): UUID {
  if (!validateUUID(value)) {
    throw new Error("Invalid UUID.");
  }

  return value;
}

/**
 * Validates an array of UUIDs.
 */
export function validateUUIDArray(
  values: readonly unknown[]
): values is readonly UUID[] {
  return values.every(validateUUID);
}