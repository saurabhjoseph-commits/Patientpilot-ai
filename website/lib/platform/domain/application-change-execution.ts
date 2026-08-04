/**
 * PP-002 Milestone C
 * Global Application Change Execution Domain
 *
 * Runtime implementation of an approved
 * enterprise application change request.
 */

export type ApplicationChangeExecutionStatus =
  | "scheduled"
  | "preparing"
  | "waiting_for_approval"
  | "implementing"
  | "validating"
  | "completed"
  | "rolled_back"
  | "cancelled"
  | "failed";

export interface ApplicationChangeExecutionRequest {

  changeRequestId: string;

  initiatedBy: string;

  trigger:
    | "manual"
    | "schedule"
    | "pipeline"
    | "api"
    | "emergency";

}

export interface ApplicationChangeExecutionScope {

  applicationId: string;

  environmentIds: string[];

  deploymentExecutionIds: string[];

  promotionExecutionIds: string[];

}

export interface ApplicationChangeExecutionApproval {

  approvedBy: string[];

  cabApproved: boolean;

  finalApprover?: string;

  approvedAt?: string;

}

export interface ApplicationChangeExecutionTimeline {

  scheduledStartAt: string;

  actualStartAt?: string;

  scheduledEndAt?: string;

  actualEndAt?: string;

  durationSeconds?: number;

}

export interface ApplicationChangeExecutionValidation {

  qualityGateExecutionIds: string[];

  postDeploymentHealthCheckIds: string[];

  validationPassed: boolean;

}

export interface ApplicationChangeExecutionRecovery {

  rollbackPerformed: boolean;

  rollbackDeploymentExecutionId?: string;

  recoverySummary?: string;

}

export interface ApplicationChangeExecutionResult {

  success: boolean;

  incidentsCreated: string[];

  summary?: string;

  failureReason?: string;

}

export interface ApplicationChangeExecutionMetadata {

  changeTicket?: string;

  dashboardUrl?: string;

  logsUrl?: string;

  traceId?: string;

  tags: string[];

}

export interface ApplicationChangeExecution {

  id: string;

  status: ApplicationChangeExecutionStatus;

  request: ApplicationChangeExecutionRequest;

  scope: ApplicationChangeExecutionScope;

  approval: ApplicationChangeExecutionApproval;

  timeline: ApplicationChangeExecutionTimeline;

  validation: ApplicationChangeExecutionValidation;

  recovery: ApplicationChangeExecutionRecovery;

  result: ApplicationChangeExecutionResult;

  metadata: ApplicationChangeExecutionMetadata;

  createdAt: string;

  updatedAt: string;

}