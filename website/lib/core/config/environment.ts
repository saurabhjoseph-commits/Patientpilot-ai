/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Environment Configuration
 * ============================================================
 */

import type {
  CountryCode,
  Environment,
} from "../types/common";

export interface EnvironmentConfig {
  environment: Environment;

  appName: string;

  apiVersion: string;

  defaultCountry: CountryCode;

  defaultLocale: string;

  defaultTimezone: string;

  isDevelopment: boolean;

  isProduction: boolean;

  isStaging: boolean;
}

/**
 * Returns the current runtime environment.
 */
export function getEnvironment(): Environment {
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";

    case "development":
      return "development";

    default:
      return "staging";
  }
}

/**
 * Builds the immutable environment configuration.
 */
export function createEnvironmentConfig(): Readonly<EnvironmentConfig> {
  const environment = getEnvironment();

  return Object.freeze({
    environment,

    appName:
      process.env.NEXT_PUBLIC_APP_NAME ??
      "PatientPilot AI",

    apiVersion:
      process.env.NEXT_PUBLIC_API_VERSION ??
      "v1",

    defaultCountry:
      (process.env
        .NEXT_PUBLIC_DEFAULT_COUNTRY as CountryCode) ??
      "US",

    defaultLocale:
      process.env.NEXT_PUBLIC_DEFAULT_LOCALE ??
      "en-US",

    defaultTimezone:
      process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE ??
      "UTC",

    isDevelopment:
      environment === "development",

    isProduction:
      environment === "production",

    isStaging:
      environment === "staging",
  });
}

/**
 * Shared singleton.
 */
export const environment =
  createEnvironmentConfig();