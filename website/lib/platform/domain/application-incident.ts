/**
 * PP-002 Milestone C
 * Global Application Incident Domain
 *
 * Runtime operational incident affecting
 * one or more applications.
 */

export type ApplicationIncidentStatus =
  | "open"
  | "acknowledged"
  | "investigating"
  | "mitigating"
  | "monitoring"
  | "resolved"
  | "closed"
  | "cancelled";

export type ApplicationIncidentSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "informational";

export type ApplicationIncidentCategory =
  | "availability"
  | "performance"
  | "security"
  | "deployment"
  | "database"
  | "network"
  | "infrastructure"
  | "configuration"
  | "integration"
  | "data"
  | "custom";

export interface ApplicationIncidentScope {

  applicationId: string;

  environmentId?: string;

  deploymentExecutionId?: string;

  changeExecutionId?: string;

  maintenanceExecutionId?: string;

}

export interface ApplicationIncidentTrigger {

  alertId?: string;

  healthCheckExecutionId?: string;

  metricMeasurementId?: string;

  detectedBy:
    | "monitoring"
    | "user"
    | "support"
    | "automation"
    | "manual";

  detectedAt: string;

}

export interface ApplicationIncidentOwnership {

  assignedTeamId?: string;

  assignedUserId?: string;

  acknowledgedBy?: string;

  acknowledgedAt?: string;

}

export interface ApplicationIncidentImpact {

  affectedServices: string[];

  affectedTenants: string[];

  affectedUsers?: number;

  customerVisible: boolean;

  serviceUnavailable: boolean;

}

export interface ApplicationIncidentResolution {

  resolvedBy?: string;

  resolvedAt?: string;

  rootCause?: string;

  workaround?: string;

  resolutionSummary?: string;

}

export interface ApplicationIncidentMetadata {

  title: string;

  description?: string;

  dashboardUrl?: string;

  runbookUrl?: string;

  tags: string[];

}

export interface ApplicationIncident {

  id: string;

  code: string;

  status: ApplicationIncidentStatus;

  severity: ApplicationIncidentSeverity;

  category: ApplicationIncidentCategory;

  scope: ApplicationIncidentScope;

  trigger: ApplicationIncidentTrigger;

  ownership: ApplicationIncidentOwnership;

  impact: ApplicationIncidentImpact;

  resolution: ApplicationIncidentResolution;

  metadata: ApplicationIncidentMetadata;

  createdAt: string;

  updatedAt: string;

}