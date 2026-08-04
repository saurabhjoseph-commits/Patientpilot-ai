/**
 * PatientPilot AI
 * Infrastructure Layer
 * Health Check
 *
 * Centralized health status for infrastructure services.
 */

import configuration from "./config";

export type HealthStatus =
  | "healthy"
  | "degraded"
  | "unhealthy";

export interface HealthCheck {
  readonly name: string;
  readonly status: HealthStatus;
  readonly message?: string;
}

export interface HealthReport {
  readonly status: HealthStatus;
  readonly timestamp: Date;
  readonly checks: readonly HealthCheck[];
}

export interface HealthService {
  check(): Promise<HealthReport>;
}

export class DefaultHealthService
  implements HealthService
{
  async check(): Promise<HealthReport> {
    const checks: HealthCheck[] = [
      {
        name: "application",
        status: "healthy",
      },
      {
        name: "configuration",
        status: configuration.supabase.url
          ? "healthy"
          : "unhealthy",
      },
    ];

    const status = checks.some(
      (check) => check.status === "unhealthy",
    )
      ? "unhealthy"
      : checks.some(
            (check) =>
              check.status === "degraded",
          )
        ? "degraded"
        : "healthy";

    return {
      status,
      timestamp: new Date(),
      checks,
    };
  }
}

/**
 * Creates a Health Service.
 */
export function createHealthService(): HealthService {
  return new DefaultHealthService();
}

/**
 * Shared Health Service.
 */
export const healthService =
  createHealthService();

export default healthService;