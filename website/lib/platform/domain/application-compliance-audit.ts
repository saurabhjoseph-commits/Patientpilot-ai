/**
 * PP-002 Milestone C
 * Global Application Compliance Audit Domain
 *
 * Represents a compliance audit engagement
 * performed against one or more compliance
 * frameworks, applications, or environments.
 */

export type ApplicationComplianceAuditStatus =
  | "planned"
  | "scheduled"
  | "in_progress"
  | "under_review"
  | "completed"
  | "cancelled";

export type ApplicationComplianceAuditType =
  | "internal"
  | "external"
  | "certification"
  | "regulatory"
  | "vendor"
  | "customer"
  | "surveillance"
  | "follow_up"
  | "custom";

export interface ApplicationComplianceAuditScope {

  tenantId: string;

  frameworkIds: string[];

  complianceProgramId?: string;

  applicationIds: string[];

  environmentIds: string[];

  serviceIds: string[];

}

export interface ApplicationComplianceAuditOwnership {

  leadAuditorUserId?: string;

  auditorUserIds: string[];

  reviewerUserIds: string[];

  approvedBy?: string;

}

export interface ApplicationComplianceAuditSchedule {

  plannedStartAt: string;

  plannedEndAt: string;

  actualStartAt?: string;

  actualEndAt?: string;

}

export interface ApplicationComplianceAuditObjectives {

  objectives: string[];

  scopeDescription: string;

  auditCriteria: string[];

  auditStandards: string[];

}

export interface ApplicationComplianceAuditEvidence {

  evidenceIds: string[];

  requestedEvidenceCount?: number;

  submittedEvidenceCount?: number;

}

export interface ApplicationComplianceAuditResults {

  overallResult:
    | "pass"
    | "pass_with_observations"
    | "conditional_pass"
    | "fail"
    | "not_assessed";

  executiveSummary?: string;

  recommendations: string[];

}

export interface ApplicationComplianceAuditRelationships {

  assessmentIds: string[];

  certificationIds: string[];

  findingIds: string[];

  actionItemIds: string[];

}

export interface ApplicationComplianceAuditMetadata {

  title: string;

  description?: string;

  tags: string[];

}

export interface ApplicationComplianceAudit {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceAuditStatus;

  type: ApplicationComplianceAuditType;

  scope: ApplicationComplianceAuditScope;

  ownership: ApplicationComplianceAuditOwnership;

  schedule: ApplicationComplianceAuditSchedule;

  objectives: ApplicationComplianceAuditObjectives;

  evidence: ApplicationComplianceAuditEvidence;

  results: ApplicationComplianceAuditResults;

  relationships: ApplicationComplianceAuditRelationships;

  metadata: ApplicationComplianceAuditMetadata;

  createdAt: string;

  updatedAt: string;

}