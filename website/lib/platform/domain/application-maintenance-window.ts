/**
 * PP-002 Milestone C
 * Global Application Maintenance Window Domain
 *
 * Planned operational maintenance period
 * for applications and infrastructure.
 */

export type ApplicationMaintenanceWindowStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled";

export type ApplicationMaintenanceWindowType =
  | "planned"
  | "emergency"
  | "upgrade"
  | "deployment"
  | "security"
  | "database"
  | "infrastructure"
  | "custom";

export interface ApplicationMaintenanceWindowScope {

  environmentId?: string;

  deploymentId?: string;

  applicationIds: string[];

  tenantIds?: string[];

}

export interface ApplicationMaintenanceWindowSchedule {

  startsAt: string;

  endsAt: string;

  timezone: string;

  recurrence?:
    | "none"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly";

}

export interface ApplicationMaintenanceWindowBehavior {

  suppressAlerts: boolean;

  suppressNotifications: boolean;

  pauseDeployments: boolean;

  pauseHealthChecks: boolean;

  maintenanceMode: boolean;

}

export interface ApplicationMaintenanceWindowApproval {

  requestedBy: string;

  approvedBy?: string;

  approvedAt?: string;

}

export interface ApplicationMaintenanceWindowMetadata {

  title: string;

  description?: string;

  changeRequestId?: string;

  runbookUrl?: string;

  tags: string[];

}

export interface ApplicationMaintenanceWindow {

  id: string;

  code: string;

  status: ApplicationMaintenanceWindowStatus;

  type: ApplicationMaintenanceWindowType;

  scope: ApplicationMaintenanceWindowScope;

  schedule: ApplicationMaintenanceWindowSchedule;

  behavior: ApplicationMaintenanceWindowBehavior;

  approval: ApplicationMaintenanceWindowApproval;

  metadata: ApplicationMaintenanceWindowMetadata;

  createdAt: string;

  updatedAt: string;

}