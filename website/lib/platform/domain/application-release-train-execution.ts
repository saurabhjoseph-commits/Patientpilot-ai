/**
 * PP-002 Milestone C
 * Global Application Release Train Execution Domain
 *
 * Runtime execution of a coordinated
 * enterprise release train.
 */

export type ApplicationReleaseTrainExecutionStatus =
  | "scheduled"
  | "preparing"
  | "running"
  | "completed"
  | "partially_completed"
  | "rolled_back"
  | "cancelled"
  | "failed";

export interface ApplicationReleaseTrainExecutionRequest {

  releaseTrainId: string;

  initiatedBy: string;

  trigger:
    | "schedule"
    | "manual"
    | "api"
    | "pipeline";

}

export interface ApplicationReleaseTrainExecutionScope {

  applicationIds: string[];

  environmentIds: string[];

  deploymentIds: string[];

  applicationVersionIds: string[];

}

export interface ApplicationReleaseTrainExecutionTimeline {

  scheduledStartAt: string;

  actualStartAt?: string;

  scheduledEndAt?: string;

  actualEndAt?: string;

  durationSeconds?: number;

}

export interface ApplicationReleaseTrainExecutionGovernance {

  approvedBy?: string;

  approvedAt?: string;

  changeRequestId?: string;

  qualityGatePassed: boolean;

}

export interface ApplicationReleaseTrainExecutionProgress {

  totalDeployments: number;

  successfulDeployments: number;

  failedDeployments: number;

  skippedDeployments: number;

}

export interface ApplicationReleaseTrainExecutionResult {

  success: boolean;

  rollbackPerformed: boolean;

  summary?: string;

  failureReason?: string;

}

export interface ApplicationReleaseTrainExecutionMetadata {

  dashboardUrl?: string;

  pipelineRunId?: string;

  releaseNotesUrl?: string;

  tags: string[];

}

export interface ApplicationReleaseTrainExecution {

  id: string;

  status: ApplicationReleaseTrainExecutionStatus;

  request: ApplicationReleaseTrainExecutionRequest;

  scope: ApplicationReleaseTrainExecutionScope;

  timeline: ApplicationReleaseTrainExecutionTimeline;

  governance: ApplicationReleaseTrainExecutionGovernance;

  progress: ApplicationReleaseTrainExecutionProgress;

  result: ApplicationReleaseTrainExecutionResult;

  metadata: ApplicationReleaseTrainExecutionMetadata;

  createdAt: string;

  updatedAt: string;

}