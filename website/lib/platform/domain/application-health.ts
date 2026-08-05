/**
 * PP-002 Milestone C
 * Global Application Health Domain
 *
 * Current operational health state
 * of an application.
 */

export type ApplicationHealthStatus =
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "maintenance"
  | "unknown";

export interface ApplicationHealthChecks {

  liveness: boolean;

  readiness: boolean;

  startup: boolean;

}

export interface ApplicationHealthDependencies {

  total: number;

  healthy: number;

  degraded: number;

  unhealthy: number;

}

export interface ApplicationHealthAvailability {

  available: boolean;

  uptimePercentage?: number;

  lastDowntimeAt?: string;

  recoveredAt?: string;

}

export interface ApplicationHealthPerformance {

  averageResponseTimeMs?: number;

  requestsPerMinute?: number;

  errorRatePercentage?: number;

}

export interface ApplicationHealthMetadata {

  evaluatedBy?: string;

  message?: string;

  tags: string[];

}

export interface ApplicationHealth {

  id: string;

  applicationId: string;

  status: ApplicationHealthStatus;

  checks: ApplicationHealthChecks;

  dependencies: ApplicationHealthDependencies;

  availability: ApplicationHealthAvailability;

  performance: ApplicationHealthPerformance;

  metadata: ApplicationHealthMetadata;

  evaluatedAt: string;

}