// website/lib/core/bootstrap/StartupContext.ts

import type { Container } from "@/lib/core/container";
import type {
  AppConfig,
  EnvironmentConfig,
} from "@/lib/core/config";

/**
 * ============================================================
 * PatientPilot AI
 * Startup Context
 * ============================================================
 *
 * Shared context passed to every bootstrap step.
 * Contains all runtime objects required during
 * application initialization.
 */

export interface StartupContext {
  /**
   * Dependency Injection container.
   */
  container: Container;

  /**
   * Immutable application configuration.
   */
  config: AppConfig;

  /**
   * Environment configuration.
   */
  environment: EnvironmentConfig;

  /**
   * Bootstrap start time.
   */
  startedAt: Date;
}