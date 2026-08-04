/**
 * PP-002 Milestone C
 * Global Application Change Request Domain
 *
 * Reusable enterprise change request
 * definition for governed platform changes.
 */

export type ApplicationChangeRequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "scheduled"
  | "cancelled"
  | "expired";

export type ApplicationChangeRequestType =
  | "application_release"
  | "deployment"
  | "configuration"
  | "database"
  | "infrastructure"
  | "security"
  | "maintenance"
  | "rollback"
  | "hotfix"
  | "feature_flag"
  | "custom";

export type ApplicationChangeRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ApplicationChangeRequestScope {

  applicationId: string;

  environmentIds: string[];

  releaseTrainId?: string;

  deploymentId?: string;

  maintenanceWindowId?: string;

}

export interface ApplicationChangeRequestSchedule {

  plannedStartAt: string;

  plannedEndAt: string;

  timezone: string;

}

export interface ApplicationChangeRequestApproval {

  approvalRequired: boolean;

  minimumApprovers: number;

  approverRoleIds: string[];

  cabApprovalRequired: boolean;

}

export interface ApplicationChangeRequestImpact {

  riskLevel: ApplicationChangeRiskLevel;

  expectedDowntimeMinutes?: number;

  customerImpact: boolean;

  rollbackAvailable: boolean;

}

export interface ApplicationChangeRequestValidation {

  qualityGateIds: string[];

  prerequisiteChangeRequestIds: string[];

  requiresMaintenanceWindow: boolean;

}

export interface ApplicationChangeRequestMetadata {

  title: string;

  description?: string;

  requestedBy: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationChangeRequest {

  id: string;

  code: string;

  status: ApplicationChangeRequestStatus;

  type: ApplicationChangeRequestType;

  scope: ApplicationChangeRequestScope;

  schedule: ApplicationChangeRequestSchedule;

  approval: ApplicationChangeRequestApproval;

  impact: ApplicationChangeRequestImpact;

  validation: ApplicationChangeRequestValidation;

  metadata: ApplicationChangeRequestMetadata;

  createdAt: string;

  updatedAt: string;

}