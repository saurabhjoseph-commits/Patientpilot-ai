/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Country Constants
 * ============================================================
 */

import type { CountryCode, Currency, Locale } from "../types/common";

export const COUNTRIES = {
  INDIA: "IN",
  UNITED_STATES: "US",
  AUSTRALIA: "AU",
} as const satisfies Record<string, CountryCode>;

export const SUPPORTED_COUNTRIES: readonly CountryCode[] = [
  COUNTRIES.INDIA,
  COUNTRIES.UNITED_STATES,
  COUNTRIES.AUSTRALIA,
] as const;

export interface CountryMetadata {
  code: CountryCode;
  name: string;
  locale: Locale;
  currency: Currency;
  timezone: string;
  phoneCode: string;
}

export const COUNTRY_METADATA: Readonly<
  Record<CountryCode, CountryMetadata>
> = {
  IN: {
    code: "IN",
    name: "India",
    locale: "en-IN",
    currency: "INR",
    timezone: "Asia/Kolkata",
    phoneCode: "+91",
  },

  US: {
    code: "US",
    name: "United States",
    locale: "en-US",
    currency: "USD",
    timezone: "America/New_York",
    phoneCode: "+1",
  },

  AU: {
    code: "AU",
    name: "Australia",
    locale: "en-AU",
    currency: "AUD",
    timezone: "Australia/Sydney",
    phoneCode: "+61",
  },
};

export const DEFAULT_COUNTRY = COUNTRIES.UNITED_STATES;