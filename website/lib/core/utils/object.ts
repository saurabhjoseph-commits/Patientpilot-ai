/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Object Utilities
 * ============================================================
 */

/**
 * Returns true if the value is a plain object.
 */
export function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * Returns true if the object has no own properties.
 */
export function isEmptyObject(
  value: Record<string, unknown>
): boolean {
  return Object.keys(value).length === 0;
}

/**
 * Returns a shallow copy of the object.
 */
export function clone<T extends object>(
  object: T
): T {
  return { ...object };
}

/**
 * Freezes an object to make it immutable.
 */
export function freeze<T extends object>(
  object: T
): Readonly<T> {
  return Object.freeze(object);
}

/**
 * Returns a new object with undefined values removed.
 */
export function removeUndefined<T extends object>(
  object: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined
    )
  ) as Partial<T>;
}

/**
 * Returns a new object with null and undefined values removed.
 */
export function removeNil<T extends object>(
  object: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined
    )
  ) as Partial<T>;
}