/**
 * PP-002 Milestone C
 * Global Application Environment Promotion Execution Domain
 *
 * Runtime execution of an application
 * environment promotion.
 */

export type ApplicationEnvironmentPromotionExecutionStatus =
  | "scheduled"
  | "waiting_for_approval"
  | "validating"
  | "promoting"
  | "completed"
  | "rolled_back"
  | "cancelled"
  | "failed";

export interface ApplicationEnvironmentPromotionExecutionRequest {

  promotionPolicyId: string;

  applicationId: string;

  releaseTrainExecutionId?: string;

  deploymentExecutionId?: string;

  initiatedBy: string;

  trigger:
    | "manual"
    | "automatic"
    | "pipeline"
    | "api"
    | "schedule";

}

export interface ApplicationEnvironmentPromotionExecutionRoute {

  sourceEnvironmentId: string;

  targetEnvironmentId: string;

}

export interface ApplicationEnvironmentPromotionExecutionApproval {

  required: boolean;

  approved: boolean;

  approvedBy?: string;

  approvedAt?: string;

}

export interface ApplicationEnvironmentPromotionExecutionValidation {

  qualityGateExecutionIds: string[];

  applicationHealthy: boolean;

  deploymentSuccessful: boolean;

  validationPassed: boolean;

}

export interface ApplicationEnvironmentPromotionExecutionTimeline {

  startedAt: string;

  completedAt?: string;

  durationSeconds?: number;

}

export interface ApplicationEnvironmentPromotionExecutionRetry {

  retryCount: number;

  maximumRetries: number;

  rollbackPerformed: boolean;

}

export interface ApplicationEnvironmentPromotionExecutionResult {

  success: boolean;

  summary?: string;

  failureReason?: string;

}

export interface ApplicationEnvironmentPromotionExecutionMetadata {

  pipelineRunId?: string;

  traceId?: string;

  dashboardUrl?: string;

  tags: string[];

}

export interface ApplicationEnvironmentPromotionExecution {

  id: string;

  status: ApplicationEnvironmentPromotionExecutionStatus;

  request: ApplicationEnvironmentPromotionExecutionRequest;

  route: ApplicationEnvironmentPromotionExecutionRoute;

  approval: ApplicationEnvironmentPromotionExecutionApproval;

  validation: ApplicationEnvironmentPromotionExecutionValidation;

  timeline: ApplicationEnvironmentPromotionExecutionTimeline;

  retry: ApplicationEnvironmentPromotionExecutionRetry;

  result: ApplicationEnvironmentPromotionExecutionResult;

  metadata: ApplicationEnvironmentPromotionExecutionMetadata;

  createdAt: string;

  updatedAt: string;

}