/**
 * PP-002 Milestone C
 * Global Application Compliance Requirement Assessment Domain
 *
 * Represents the historical assessment of a
 * single compliance requirement as part of
 * a compliance assessment.
 */

export type ApplicationComplianceRequirementAssessmentStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "approved"
  | "failed"
  | "superseded";

export type ApplicationComplianceRequirementResult =
  | "compliant"
  | "partially_compliant"
  | "non_compliant"
  | "not_applicable"
  | "not_assessed";

export interface ApplicationComplianceRequirementAssessmentReference {

  complianceAssessmentId: string;

  frameworkId: string;

  requirementId: string;

}

export interface ApplicationComplianceRequirementAssessmentExecution {

  assessorUserId: string;

  reviewerUserIds: string[];

  approvedBy?: string;

  assessedAt: string;

}

export interface ApplicationComplianceRequirementAssessmentEvaluation {

  result: ApplicationComplianceRequirementResult;

  score?: number;

  rationale?: string;

  findings: string[];

  recommendations: string[];

}

export interface ApplicationComplianceRequirementAssessmentEvidence {

  controlMappingIds: string[];

  controlAssessmentIds: string[];

  evidenceUrls: string[];

  documentIds: string[];

}

export interface ApplicationComplianceRequirementAssessmentExceptions {

  exceptionIds: string[];

  waiverIds: string[];

  actionItemIds: string[];

}

export interface ApplicationComplianceRequirementAssessmentMetadata {

  notes?: string;

  tags: string[];

}

export interface ApplicationComplianceRequirementAssessment {

  id: string;

  version: number;

  status: ApplicationComplianceRequirementAssessmentStatus;

  reference: ApplicationComplianceRequirementAssessmentReference;

  execution: ApplicationComplianceRequirementAssessmentExecution;

  evaluation: ApplicationComplianceRequirementAssessmentEvaluation;

  evidence: ApplicationComplianceRequirementAssessmentEvidence;

  exceptions: ApplicationComplianceRequirementAssessmentExceptions;

  metadata: ApplicationComplianceRequirementAssessmentMetadata;

  createdAt: string;

  updatedAt: string;

}