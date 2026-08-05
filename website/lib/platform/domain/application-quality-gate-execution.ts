/**
 * PP-002 Milestone C
 * Global Application Quality Gate Execution Domain
 *
 * Runtime execution of an application
 * quality gate.
 */

export type ApplicationQualityGateExecutionStatus =
  | "pending"
  | "running"
  | "passed"
  | "failed"
  | "overridden"
  | "cancelled"
  | "timed_out";

export interface ApplicationQualityGateExecutionRequest {

  qualityGateId: string;

  applicationId: string;

  deploymentExecutionId?: string;

  releaseTrainExecutionId?: string;

  initiatedBy: string;

  trigger:
    | "deployment"
    | "release_train"
    | "manual"
    | "api"
    | "pipeline";

}

export interface ApplicationQualityGateConditionResult {

  conditionIndex: number;

  metricName: string;

  expectedValue: string;

  actualValue: string;

  passed: boolean;

  message?: string;

}

export interface ApplicationQualityGateExecutionTiming {

  startedAt: string;

  completedAt?: string;

  durationSeconds?: number;

}

export interface ApplicationQualityGateExecutionOverride {

  overridden: boolean;

  overriddenBy?: string;

  overrideReason?: string;

  approvedAt?: string;

}

export interface ApplicationQualityGateExecutionEvidence {

  reportUrls: string[];

  artifactUrls: string[];

  logUrls: string[];

}

export interface ApplicationQualityGateExecutionResult {

  success: boolean;

  totalConditions: number;

  passedConditions: number;

  failedConditions: number;

  summary?: string;

}

export interface ApplicationQualityGateExecutionMetadata {

  pipelineRunId?: string;

  traceId?: string;

  tags: string[];

}

export interface ApplicationQualityGateExecution {

  id: string;

  status: ApplicationQualityGateExecutionStatus;

  request: ApplicationQualityGateExecutionRequest;

  conditionResults: ApplicationQualityGateConditionResult[];

  timing: ApplicationQualityGateExecutionTiming;

  override: ApplicationQualityGateExecutionOverride;

  evidence: ApplicationQualityGateExecutionEvidence;

  result: ApplicationQualityGateExecutionResult;

  metadata: ApplicationQualityGateExecutionMetadata;

  createdAt: string;

  updatedAt: string;

}