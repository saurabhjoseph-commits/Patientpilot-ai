/**
 * PP-002 Milestone C
 * Global Application Compliance Program Domain
 *
 * Represents a long-running compliance program
 * managed by a tenant.
 */

export type ApplicationComplianceProgramStatus =
  | "planned"
  | "active"
  | "on_hold"
  | "completed"
  | "archived"
  | "cancelled";

export type ApplicationComplianceProgramPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface ApplicationComplianceProgramScope {

  tenantId: string;

  frameworkIds: string[];

  applicationIds: string[];

  environmentIds: string[];

  serviceIds: string[];

}

export interface ApplicationComplianceProgramOwnership {

  ownerUserId?: string;

  ownerTeamId?: string;

  sponsorUserId?: string;

  executiveOwnerId?: string;

}

export interface ApplicationComplianceProgramSchedule {

  startDate: string;

  targetCompletionDate?: string;

  completedAt?: string;

  reviewFrequency?: string;

  nextReviewAt?: string;

}

export interface ApplicationComplianceProgramObjectives {

  objectives: string[];

  successCriteria: string[];

  keyResults: string[];

}

export interface ApplicationComplianceProgramGovernance {

  obligationIds: string[];

  assessmentIds: string[];

  certificationIds: string[];

  exceptionIds: string[];

  waiverIds: string[];

  actionItemIds: string[];

}

export interface ApplicationComplianceProgramRiskManagement {

  riskIds: string[];

  controlIds: string[];

  policyIds: string[];

}

export interface ApplicationComplianceProgramReporting {

  dashboardEnabled: boolean;

  executiveReporting: boolean;

  reportFrequency?: string;

  lastReportAt?: string;

}

export interface ApplicationComplianceProgramMetadata {

  name: string;

  description?: string;

  tags: string[];

}

export interface ApplicationComplianceProgram {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceProgramStatus;

  priority: ApplicationComplianceProgramPriority;

  scope: ApplicationComplianceProgramScope;

  ownership: ApplicationComplianceProgramOwnership;

  schedule: ApplicationComplianceProgramSchedule;

  objectives: ApplicationComplianceProgramObjectives;

  governance: ApplicationComplianceProgramGovernance;

  riskManagement: ApplicationComplianceProgramRiskManagement;

  reporting: ApplicationComplianceProgramReporting;

  metadata: ApplicationComplianceProgramMetadata;

  createdAt: string;

  updatedAt: string;

}