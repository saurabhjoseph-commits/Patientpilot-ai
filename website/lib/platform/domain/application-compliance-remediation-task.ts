/**
 * PP-002 Milestone C
 * Global Application Compliance Remediation Task Domain
 *
 * Represents an executable remediation task that
 * implements corrective actions for compliance,
 * audit, risk, or control deficiencies.
 */

export type ApplicationComplianceRemediationTaskStatus =
  | "planned"
  | "assigned"
  | "in_progress"
  | "blocked"
  | "under_review"
  | "completed"
  | "verified"
  | "cancelled";

export type ApplicationComplianceRemediationTaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ApplicationComplianceRemediationTaskType =
  | "control_implementation"
  | "policy_update"
  | "documentation"
  | "configuration_change"
  | "training"
  | "risk_mitigation"
  | "process_improvement"
  | "verification"
  | "custom";

export interface ApplicationComplianceRemediationTaskScope {

  tenantId: string;

  remediationPlanId: string;

  applicationId?: string;

  environmentId?: string;

}

export interface ApplicationComplianceRemediationTaskOwnership {

  assignedUserId?: string;

  assignedTeamId?: string;

  createdBy?: string;

  reviewerUserIds: string[];

  verifiedBy?: string;

}

export interface ApplicationComplianceRemediationTaskSchedule {

  plannedStartAt?: string;

  dueAt?: string;

  startedAt?: string;

  completedAt?: string;

  verifiedAt?: string;

}

export interface ApplicationComplianceRemediationTaskWork {

  title: string;

  description: string;

  type: ApplicationComplianceRemediationTaskType;

  estimatedEffortHours?: number;

  actualEffortHours?: number;

}

export interface ApplicationComplianceRemediationTaskRelationships {

  auditFindingIds: string[];

  riskIds: string[];

  riskAssessmentIds: string[];

  controlIds: string[];

  controlAssessmentIds: string[];

  obligationIds: string[];

  requirementIds: string[];

  requirementAssessmentIds: string[];

  evidenceIds: string[];

  actionItemIds: string[];

}

export interface ApplicationComplianceRemediationTaskVerification {

  verificationRequired: boolean;

  verificationMethod?:
    | "manual_review"
    | "control_test"
    | "audit"
    | "automated_validation"
    | "custom";

  verificationNotes?: string;

}

export interface ApplicationComplianceRemediationTaskMetadata {

  notes?: string;

  tags: string[];

}

export interface ApplicationComplianceRemediationTask {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceRemediationTaskStatus;

  priority: ApplicationComplianceRemediationTaskPriority;

  scope: ApplicationComplianceRemediationTaskScope;

  ownership: ApplicationComplianceRemediationTaskOwnership;

  schedule: ApplicationComplianceRemediationTaskSchedule;

  work: ApplicationComplianceRemediationTaskWork;

  relationships: ApplicationComplianceRemediationTaskRelationships;

  verification: ApplicationComplianceRemediationTaskVerification;

  metadata: ApplicationComplianceRemediationTaskMetadata;

  createdAt: string;

  updatedAt: string;

}