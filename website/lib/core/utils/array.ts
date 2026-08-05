/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Array Utilities
 * ============================================================
 */

/**
 * Returns true if the array is null, undefined,
 * or contains no items.
 */
export function isEmpty<T>(
  array?: readonly T[] | null
): boolean {
  return !array || array.length === 0;
}

/**
 * Returns true if the array contains one or more items.
 */
export function isNotEmpty<T>(
  array?: readonly T[] | null
): boolean {
  return !isEmpty(array);
}

/**
 * Returns the first element.
 */
export function first<T>(
  array: readonly T[]
): T | undefined {
  return array[0];
}

/**
 * Returns the last element.
 */
export function last<T>(
  array: readonly T[]
): T | undefined {
  return array[array.length - 1];
}

/**
 * Removes duplicate values.
 */
export function unique<T>(
  array: readonly T[]
): T[] {
  return [...new Set(array)];
}

/**
 * Returns a new array without null or undefined values.
 */
export function compact<T>(
  array: readonly (T | null | undefined)[]
): T[] {
  return array.filter(
    (item): item is T => item != null
  );
}

/**
 * Splits an array into chunks.
 */
export function chunk<T>(
  array: readonly T[],
  size: number
): T[][] {
  if (size <= 0) {
    throw new Error("Chunk size must be greater than zero.");
  }

  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

/**
 * Returns a new array without duplicate objects
 * based on the supplied key selector.
 */
export function uniqueBy<T, K>(
  array: readonly T[],
  selector: (item: T) => K
): T[] {
  const seen = new Set<K>();

  return array.filter(item => {
    const key = selector(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

/**
 * Groups an array by a key.
 */
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  selector: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = selector(item);

    (groups[key] ??= []).push(item);

    return groups;
  }, {} as Record<K, T[]>);
}

/**
 * Sorts an array without mutating it.
 */
export function sortBy<T>(
  array: readonly T[],
  selector: (item: T) => string | number
): T[] {
  return [...array].sort((a, b) => {
    const left = selector(a);
    const right = selector(b);

    if (left < right) return -1;
    if (left > right) return 1;

    return 0;
  });
}

/**
 * Returns a new array with falsy values removed.
 */
export function truthy<T>(
  array: readonly T[]
): NonNullable<T>[] {
  return array.filter(Boolean) as NonNullable<T>[];
}