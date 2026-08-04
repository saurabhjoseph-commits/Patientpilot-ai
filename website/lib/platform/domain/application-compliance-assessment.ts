/**
 * PP-002 Milestone C
 * Global Application Compliance Assessment Domain
 *
 * Represents a historical compliance assessment
 * performed against a compliance framework.
 */

export type ApplicationComplianceAssessmentStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "approved"
  | "failed"
  | "superseded";

export type ApplicationComplianceAssessmentMethod =
  | "internal_audit"
  | "external_audit"
  | "self_assessment"
  | "automated"
  | "continuous_monitoring"
  | "hybrid"
  | "certification"
  | "custom";

export type ApplicationComplianceLevel =
  | "fully_compliant"
  | "substantially_compliant"
  | "partially_compliant"
  | "non_compliant"
  | "not_applicable";

export interface ApplicationComplianceAssessmentScope {

  frameworkId: string;

  applicationId: string;

  environmentId?: string;

  tenantIds: string[];

  serviceIds: string[];

}

export interface ApplicationComplianceAssessmentExecution {

  method: ApplicationComplianceAssessmentMethod;

  assessorUserId: string;

  reviewerUserIds: string[];

  approvedBy?: string;

  startedAt?: string;

  completedAt?: string;

}

export interface ApplicationComplianceAssessmentResults {

  complianceLevel: ApplicationComplianceLevel;

  complianceScore: number;

  totalRequirements: number;

  compliantRequirements: number;

  partiallyCompliantRequirements: number;

  nonCompliantRequirements: number;

  notApplicableRequirements: number;

}

export interface ApplicationComplianceAssessmentEvidence {

  summary?: string;

  requirementAssessmentIds: string[];

  controlAssessmentIds: string[];

  evidenceUrls: string[];

}

export interface ApplicationComplianceAssessmentFollowUp {

  findings: string[];

  recommendations: string[];

  exceptionIds: string[];

  waiverIds: string[];

  actionItemIds: string[];

  nextAssessmentAt?: string;

}

export interface ApplicationComplianceAssessmentMetadata {

  assessmentPeriodStart?: string;

  assessmentPeriodEnd?: string;

  notes?: string;

  tags: string[];

}

export interface ApplicationComplianceAssessment {

  id: string;

  frameworkId: string;

  version: number;

  status: ApplicationComplianceAssessmentStatus;

  scope: ApplicationComplianceAssessmentScope;

  execution: ApplicationComplianceAssessmentExecution;

  results: ApplicationComplianceAssessmentResults;

  evidence: ApplicationComplianceAssessmentEvidence;

  followUp: ApplicationComplianceAssessmentFollowUp;

  metadata: ApplicationComplianceAssessmentMetadata;

  assessedAt: string;

  createdAt: string;

  updatedAt: string;

}