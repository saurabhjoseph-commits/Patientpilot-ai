/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Configuration Loader
 * ============================================================
 */

import { createAppConfig, type AppConfig } from "./app.config";
import { validateConfig } from "./validator";

import { logger } from "../logger/logger";

let configuration: Readonly<AppConfig> | null = null;

/**
 * Loads and validates the application configuration.
 *
 * Configuration is loaded only once during application startup.
 */
export function loadConfiguration(): Readonly<AppConfig> {
  if (configuration) {
    return configuration;
  }

  logger.info("Loading application configuration...");

  const config = createAppConfig();

  configuration = validateConfig(config);

  logger.info("Application configuration loaded successfully.", {
    environment: configuration.environment.environment,
    country: configuration.environment.defaultCountry,
    apiVersion: configuration.environment.apiVersion,
  });

  return configuration;
}

/**
 * Returns the initialized configuration.
 *
 * Throws if configuration has not yet been loaded.
 */
export function getConfiguration(): Readonly<AppConfig> {
  if (!configuration) {
    throw new Error(
      "Configuration has not been loaded. Call loadConfiguration() during application startup."
    );
  }

  return configuration;
}

/**
 * Returns true if configuration has already been initialized.
 */
export function isConfigurationLoaded(): boolean {
  return configuration !== null;
}

/**
 * Clears the cached configuration.
 *
 * Intended for unit testing only.
 */
export function resetConfiguration(): void {
  configuration = null;
}