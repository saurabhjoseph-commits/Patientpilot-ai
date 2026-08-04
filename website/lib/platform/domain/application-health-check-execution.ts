/**
 * PP-002 Milestone C
 * Global Application Health Check Execution Domain
 *
 * Runtime execution of an application
 * health check.
 */

export type ApplicationHealthCheckExecutionStatus =
  | "pending"
  | "running"
  | "healthy"
  | "degraded"
  | "unhealthy"
  | "timed_out"
  | "cancelled"
  | "failed";

export interface ApplicationHealthCheckExecutionRequest {

  initiatedBy?: string;

  trigger:
    | "scheduler"
    | "deployment"
    | "manual"
    | "api"
    | "startup"
    | "monitoring";

  attempt: number;

}

export interface ApplicationHealthCheckExecutionTiming {

  queuedAt?: string;

  startedAt?: string;

  completedAt?: string;

  durationMs?: number;

}

export interface ApplicationHealthCheckExecutionResponse {

  success: boolean;

  httpStatusCode?: number;

  responseTimeMs?: number;

  responseSizeBytes?: number;

}

export interface ApplicationHealthCheckExecutionResult {

  message?: string;

  errorCode?: string;

  errorDetails?: string;

}

export interface ApplicationHealthCheckExecutionMetadata {

  traceId?: string;

  logsUrl?: string;

  tags: string[];

}

export interface ApplicationHealthCheckExecution {

  id: string;

  applicationHealthCheckId: string;

  applicationId: string;

  status: ApplicationHealthCheckExecutionStatus;

  request: ApplicationHealthCheckExecutionRequest;

  timing: ApplicationHealthCheckExecutionTiming;

  response: ApplicationHealthCheckExecutionResponse;

  result: ApplicationHealthCheckExecutionResult;

  metadata: ApplicationHealthCheckExecutionMetadata;

  executedAt: string;

}