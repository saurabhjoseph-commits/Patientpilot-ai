/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Application Configuration
 * ============================================================
 */

import { APP, API, PLATFORM, SECURITY } from "../constants/app";
import { environment } from "./environment";

export interface AppConfig {
  app: Readonly<typeof APP>;

  api: Readonly<typeof API>;

  platform: Readonly<typeof PLATFORM>;

  security: Readonly<typeof SECURITY>;

  environment: Readonly<typeof environment>;
}

/**
 * Creates the immutable application configuration.
 */
export function createAppConfig(): Readonly<AppConfig> {
  return Object.freeze({
    app: APP,

    api: API,

    platform: PLATFORM,

    security: SECURITY,

    environment,
  });
}

/**
 * Global application configuration.
 *
 * This should be the only configuration object
 * consumed by business modules.
 */
export const config = createAppConfig();