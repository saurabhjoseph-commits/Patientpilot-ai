// website/lib/core/bootstrap/BootstrapResult.ts

/**
 * ============================================================
 * PatientPilot AI
 * Bootstrap Result
 * ============================================================
 *
 * Returned by the application bootstrap process.
 */

export interface BootstrapResult {
  /**
   * Indicates whether startup completed successfully.
   */
  success: boolean;

  /**
   * Startup completion time.
   */
  startedAt: Date;

  /**
   * Startup duration in milliseconds.
   */
  durationMs: number;

  /**
   * Application version.
   */
  version: string;

  /**
   * Environment.
   */
  environment: string;

  /**
   * Registered modules.
   */
  modules: readonly string[];

  /**
   * Startup warnings.
   */
  warnings: readonly string[];
}