/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Configuration System
 * Public API
 * ============================================================
 */

// Environment
export {
  environment,
  createEnvironmentConfig,
  getEnvironment,
} from "./environment";

export type {
  EnvironmentConfig,
} from "./environment";

// Application Configuration
export {
  config,
  createAppConfig,
} from "./app.config";

export type {
  AppConfig,
} from "./app.config";

// Loader
export {
  loadConfiguration,
  getConfiguration,
  isConfigurationLoaded,
  resetConfiguration,
} from "./loader";

// Validator
export {
  validateConfig,
} from "./validator";