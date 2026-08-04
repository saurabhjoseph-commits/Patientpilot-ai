/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Date Utilities
 * ============================================================
 */

import type { ISODate, Timestamp } from "../types/common";

/**
 * Returns the current date/time as an ISO-8601 timestamp (UTC).
 */
export function now(): Timestamp {
  return new Date().toISOString();
}

/**
 * Alias for now().
 */
export function currentTimestamp(): Timestamp {
  return now();
}

/**
 * Returns today's date in YYYY-MM-DD format (UTC).
 */
export function today(): ISODate {
  return now().split("T")[0] as ISODate;
}

/**
 * Converts a Date into an ISO timestamp.
 */
export function toISOString(date: Date): Timestamp {
  return date.toISOString();
}

/**
 * Parses an ISO string into a Date object.
 */
export function parseDate(value: ISODate | Timestamp): Date {
  return new Date(value);
}

/**
 * Returns true if the supplied value is a valid date.
 */
export function isValidDate(value: string): boolean {
  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

/**
 * Returns the difference between two dates in milliseconds.
 */
export function differenceInMilliseconds(
  start: Date,
  end: Date
): number {
  return end.getTime() - start.getTime();
}

/**
 * Returns the difference between two dates in minutes.
 */
export function differenceInMinutes(
  start: Date,
  end: Date
): number {
  return Math.floor(
    differenceInMilliseconds(start, end) / 60000
  );
}

/**
 * Returns the difference between two dates in hours.
 */
export function differenceInHours(
  start: Date,
  end: Date
): number {
  return Math.floor(
    differenceInMilliseconds(start, end) / 3600000
  );
}

/**
 * Returns true if two dates fall on the same UTC day.
 */
export function isSameDay(
  first: Date,
  second: Date
): boolean {
  return (
    first.getUTCFullYear() === second.getUTCFullYear() &&
    first.getUTCMonth() === second.getUTCMonth() &&
    first.getUTCDate() === second.getUTCDate()
  );
}

/**
 * Adds minutes to a date.
 */
export function addMinutes(
  date: Date,
  minutes: number
): Date {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * Adds hours to a date.
 */
export function addHours(
  date: Date,
  hours: number
): Date {
  return new Date(date.getTime() + hours * 3600000);
}

/**
 * Adds days to a date.
 */
export function addDays(
  date: Date,
  days: number
): Date {
  return new Date(date.getTime() + days * 86400000);
}

/**
 * Returns true if the date is in the past.
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Returns true if the date is in the future.
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}