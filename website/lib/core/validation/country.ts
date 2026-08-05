/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Country Validation
 * ============================================================
 */

import type { CountryCode } from "../types/common";
import {
  COUNTRIES,
  SUPPORTED_COUNTRIES,
} from "../constants/countries";

/**
 * Returns true if the supplied value is a supported country.
 */
export function isValidCountry(
  value: unknown
): value is CountryCode {
  return (
    typeof value === "string" &&
    SUPPORTED_COUNTRIES.includes(value as CountryCode)
  );
}

/**
 * Validates and returns a supported country code.
 */
export function requireCountry(
  value: unknown
): CountryCode {
  if (!isValidCountry(value)) {
    throw new Error("Unsupported country.");
  }

  return value;
}

/**
 * Returns the default country.
 */
export function getDefaultCountry(): CountryCode {
  return COUNTRIES.UNITED_STATES;
}

/**
 * Returns true if the country is supported.
 */
export function isSupportedCountry(
  country: CountryCode
): boolean {
  return SUPPORTED_COUNTRIES.includes(country);
}

/**
 * Returns all supported countries.
 */
export function getSupportedCountries(): readonly CountryCode[] {
  return SUPPORTED_COUNTRIES;
}