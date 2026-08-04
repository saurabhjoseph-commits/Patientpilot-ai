/**
 * PP-002 Milestone C
 * Global Application Compliance Audit Finding Domain
 *
 * Represents a single finding identified during
 * a compliance audit.
 */

export type ApplicationComplianceAuditFindingStatus =
  | "open"
  | "acknowledged"
  | "in_progress"
  | "resolved"
  | "verified"
  | "closed"
  | "accepted_risk";

export type ApplicationComplianceAuditFindingSeverity =
  | "informational"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ApplicationComplianceAuditFindingCategory =
  | "control_gap"
  | "policy_gap"
  | "documentation"
  | "configuration"
  | "security"
  | "privacy"
  | "access_control"
  | "operational"
  | "process"
  | "regulatory"
  | "custom";

export interface ApplicationComplianceAuditFindingScope {

  tenantId: string;

  auditId: string;

  frameworkId?: string;

  requirementId?: string;

  controlId?: string;

  applicationId?: string;

  environmentId?: string;

}

export interface ApplicationComplianceAuditFindingOwnership {

  ownerUserId?: string;

  assignedTeamId?: string;

  reportedBy?: string;

  verifiedBy?: string;

}

export interface ApplicationComplianceAuditFindingDetails {

  title: string;

  description: string;

  category: ApplicationComplianceAuditFindingCategory;

  severity: ApplicationComplianceAuditFindingSeverity;

  businessImpact?: string;

  rootCause?: string;

}

export interface ApplicationComplianceAuditFindingEvidence {

  evidenceIds: string[];

  documentIds: string[];

  assessmentIds: string[];

}

export interface ApplicationComplianceAuditFindingRemediation {

  recommendation: string;

  remediationPlan?: string;

  actionItemIds: string[];

  targetCompletionDate?: string;

  completedAt?: string;

}

export interface ApplicationComplianceAuditFindingRelationships {

  riskId?: string;

  riskAssessmentId?: string;

  exceptionId?: string;

  waiverId?: string;

  controlAssessmentId?: string;

}

export interface ApplicationComplianceAuditFindingMetadata {

  notes?: string;

  tags: string[];

}

export interface ApplicationComplianceAuditFinding {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceAuditFindingStatus;

  scope: ApplicationComplianceAuditFindingScope;

  ownership: ApplicationComplianceAuditFindingOwnership;

  details: ApplicationComplianceAuditFindingDetails;

  evidence: ApplicationComplianceAuditFindingEvidence;

  remediation: ApplicationComplianceAuditFindingRemediation;

  relationships: ApplicationComplianceAuditFindingRelationships;

  metadata: ApplicationComplianceAuditFindingMetadata;

  createdAt: string;

  updatedAt: string;

}