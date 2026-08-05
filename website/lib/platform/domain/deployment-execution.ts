/**
 * PP-002 Milestone C
 * Global Deployment Execution Domain
 *
 * Runtime execution record for
 * software deployments.
 */

export type DeploymentExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "rolled_back";

export interface DeploymentExecutionTarget {

  environmentId: string;

  applicationId?: string;

  serviceId?: string;

}

export interface DeploymentExecutionRequest {

  initiatedBy?: string;

  trigger:
    | "manual"
    | "pipeline"
    | "schedule"
    | "api"
    | "rollback";

  pipelineRunId?: string;

}

export interface DeploymentExecutionTiming {

  queuedAt?: string;

  startedAt?: string;

  completedAt?: string;

  durationMs?: number;

}

export interface DeploymentExecutionMetrics {

  successfulSteps: number;

  failedSteps: number;

  skippedSteps: number;

}

export interface DeploymentExecutionResult {

  success: boolean;

  rollbackPerformed: boolean;

  message?: string;

}

export interface DeploymentExecutionMetadata {

  logsUrl?: string;

  dashboardUrl?: string;

  tags: string[];

}

export interface DeploymentExecution {

  id: string;

  deploymentId: string;

  status: DeploymentExecutionStatus;

  target: DeploymentExecutionTarget;

  request: DeploymentExecutionRequest;

  timing: DeploymentExecutionTiming;

  metrics: DeploymentExecutionMetrics;

  result: DeploymentExecutionResult;

  metadata: DeploymentExecutionMetadata;

  executedAt: string;

}