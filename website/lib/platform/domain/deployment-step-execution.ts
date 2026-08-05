/**
 * PP-002 Milestone C
 * Global Deployment Step Execution Domain
 *
 * Runtime execution of a deployment
 * pipeline step.
 */

export type DeploymentStepExecutionStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "skipped"
  | "timed_out";

export interface DeploymentStepExecutionRequest {

  attempt: number;

  initiatedBy?: string;

}

export interface DeploymentStepExecutionTiming {

  queuedAt?: string;

  startedAt?: string;

  completedAt?: string;

  durationMs?: number;

}

export interface DeploymentStepExecutionRetry {

  retryCount: number;

  maxRetries: number;

  lastRetryAt?: string;

}

export interface DeploymentStepExecutionResult {

  success: boolean;

  exitCode?: number;

  message?: string;

  errorCode?: string;

}

export interface DeploymentStepExecutionArtifacts {

  logsUrl?: string;

  artifactUrls: string[];

}

export interface DeploymentStepExecutionMetadata {

  tags: string[];

}

export interface DeploymentStepExecution {

  id: string;

  deploymentExecutionId: string;

  deploymentStepId: string;

  status: DeploymentStepExecutionStatus;

  request: DeploymentStepExecutionRequest;

  timing: DeploymentStepExecutionTiming;

  retry: DeploymentStepExecutionRetry;

  result: DeploymentStepExecutionResult;

  artifacts: DeploymentStepExecutionArtifacts;

  metadata: DeploymentStepExecutionMetadata;

  executedAt: string;

}