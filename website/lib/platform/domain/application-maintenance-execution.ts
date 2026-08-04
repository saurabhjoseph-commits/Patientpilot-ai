/**
 * PP-002 Milestone C
 * Global Application Maintenance Execution Domain
 *
 * Runtime execution of a planned
 * maintenance window.
 */

export type ApplicationMaintenanceExecutionStatus =
  | "scheduled"
  | "starting"
  | "running"
  | "completed"
  | "cancelled"
  | "failed";

export interface ApplicationMaintenanceExecutionRequest {

  maintenanceWindowId: string;

  initiatedBy: string;

  trigger:
    | "schedule"
    | "manual"
    | "api"
    | "emergency";

}

export interface ApplicationMaintenanceExecutionScope {

  environmentId?: string;

  deploymentId?: string;

  applicationIds: string[];

  tenantIds?: string[];

}

export interface ApplicationMaintenanceExecutionTimeline {

  scheduledStartAt: string;

  actualStartAt?: string;

  scheduledEndAt: string;

  actualEndAt?: string;

  durationSeconds?: number;

}

export interface ApplicationMaintenanceExecutionActions {

  alertsSuppressed: boolean;

  notificationsSuppressed: boolean;

  deploymentsPaused: boolean;

  healthChecksPaused: boolean;

  maintenanceModeEnabled: boolean;

}

export interface ApplicationMaintenanceExecutionResult {

  success: boolean;

  summary?: string;

  failureReason?: string;

  rollbackPerformed: boolean;

}

export interface ApplicationMaintenanceExecutionMetadata {

  changeRequestId?: string;

  incidentId?: string;

  runbookUrl?: string;

  logsUrl?: string;

  tags: string[];

}

export interface ApplicationMaintenanceExecution {

  id: string;

  status: ApplicationMaintenanceExecutionStatus;

  request: ApplicationMaintenanceExecutionRequest;

  scope: ApplicationMaintenanceExecutionScope;

  timeline: ApplicationMaintenanceExecutionTimeline;

  actions: ApplicationMaintenanceExecutionActions;

  result: ApplicationMaintenanceExecutionResult;

  metadata: ApplicationMaintenanceExecutionMetadata;

  createdAt: string;

  updatedAt: string;

}