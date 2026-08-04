/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Configuration Validator
 * ============================================================
 */

import type { AppConfig } from "./app.config";

import { ConfigurationError } from "../errors/ConfigurationError";
import { isSupportedCountry } from "../validation/country";

/**
 * Valid runtime environments.
 */
const VALID_ENVIRONMENTS = [
  "development",
  "staging",
  "production",
] as const;

/**
 * Validates the application configuration.
 *
 * Throws ConfigurationError if validation fails.
 */
export function validateConfig(
  config: AppConfig
): Readonly<AppConfig> {
  validateEnvironment(config);

  validateApplication(config);

  validateCountry(config);

  return Object.freeze(config);
}

/**
 * Validate runtime environment.
 */
function validateEnvironment(
  config: AppConfig
): void {
  const env = config.environment.environment;

  if (!VALID_ENVIRONMENTS.includes(env)) {
    throw new ConfigurationError(
      `Unsupported environment: ${env}`,
      {
        key: "environment",
        value: env,
      }
    );
  }
}

/**
 * Validate application settings.
 */
function validateApplication(
  config: AppConfig
): void {
  if (!config.environment.appName.trim()) {
    throw new ConfigurationError(
      "Application name cannot be empty.",
      {
        key: "appName",
      }
    );
  }

  if (!config.environment.apiVersion.trim()) {
    throw new ConfigurationError(
      "API version cannot be empty.",
      {
        key: "apiVersion",
      }
    );
  }
}

/**
 * Validate default country.
 */
function validateCountry(
  config: AppConfig
): void {
  const country =
    config.environment.defaultCountry;

  if (!isSupportedCountry(country)) {
    throw new ConfigurationError(
      `Unsupported default country: ${country}`,
      {
        key: "defaultCountry",
        value: country,
      }
    );
  }
}