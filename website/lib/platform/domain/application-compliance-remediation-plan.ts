/**
 * PP-002 Milestone C
 * Global Application Compliance Remediation Plan Domain
 *
 * Represents a coordinated remediation initiative
 * that addresses one or more compliance findings,
 * risks, control deficiencies, or assessment results.
 */

export type ApplicationComplianceRemediationPlanStatus =
  | "planned"
  | "approved"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ApplicationComplianceRemediationPlanPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ApplicationComplianceRemediationPlanScope {

  tenantId: string;

  complianceProgramId?: string;

  frameworkIds: string[];

  applicationIds: string[];

  environmentIds: string[];

}

export interface ApplicationComplianceRemediationPlanOwnership {

  ownerUserId?: string;

  ownerTeamId?: string;

  sponsorUserId?: string;

  reviewerUserIds: string[];

  approvedBy?: string;

}

export interface ApplicationComplianceRemediationPlanSchedule {

  plannedStartAt: string;

  plannedEndAt: string;

  actualStartAt?: string;

  actualCompletedAt?: string;

}

export interface ApplicationComplianceRemediationPlanObjectives {

  title: string;

  description?: string;

  objectives: string[];

  successCriteria: string[];

}

export interface ApplicationComplianceRemediationPlanRelationships {

  auditIds: string[];

  auditFindingIds: string[];

  complianceAssessmentIds: string[];

  requirementAssessmentIds: string[];

  riskIds: string[];

  riskAssessmentIds: string[];

  controlAssessmentIds: string[];

  obligationIds: string[];

  actionItemIds: string[];

}

export interface ApplicationComplianceRemediationPlanMetrics {

  estimatedEffortHours?: number;

  completionPercentage: number;

  openItems: number;

  completedItems: number;

}

export interface ApplicationComplianceRemediationPlanMetadata {

  notes?: string;

  tags: string[];

}

export interface ApplicationComplianceRemediationPlan {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceRemediationPlanStatus;

  priority: ApplicationComplianceRemediationPlanPriority;

  scope: ApplicationComplianceRemediationPlanScope;

  ownership: ApplicationComplianceRemediationPlanOwnership;

  schedule: ApplicationComplianceRemediationPlanSchedule;

  objectives: ApplicationComplianceRemediationPlanObjectives;

  relationships: ApplicationComplianceRemediationPlanRelationships;

  metrics: ApplicationComplianceRemediationPlanMetrics;

  metadata: ApplicationComplianceRemediationPlanMetadata;

  createdAt: string;

  updatedAt: string;

}