/**
 * PP-002 Milestone C
 * Global Application Compliance Maturity Assessment Domain
 *
 * Represents a historical maturity assessment
 * for a tenant, application, or compliance program.
 */

export type ApplicationComplianceMaturityAssessmentStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "approved"
  | "superseded";

export interface ApplicationComplianceMaturityAssessmentScope {

  tenantId: string;

  maturityModelId: string;

  complianceProgramId?: string;

  applicationId?: string;

  environmentId?: string;

}

export interface ApplicationComplianceMaturityDimensionScore {

  dimensionId: string;

  score: number;

  maturityLevel: number;

  findings: string[];

  recommendations: string[];

}

export interface ApplicationComplianceOverallResult {

  overallScore: number;

  maturityLevel: number;

  maturityLevelName?: string;

  strengths: string[];

  weaknesses: string[];

  improvementAreas: string[];

}

export interface ApplicationComplianceMaturityExecution {

  assessorUserId?: string;

  reviewerUserIds: string[];

  approvedBy?: string;

  assessedAt: string;

  approvedAt?: string;

}

export interface ApplicationComplianceMaturityEvidence {

  assessmentIds: string[];

  requirementAssessmentIds: string[];

  controlAssessmentIds: string[];

  documentIds: string[];

  evidenceUrls: string[];

}

export interface ApplicationComplianceMaturityFollowUp {

  actionItemIds: string[];

  nextAssessmentDate?: string;

  improvementPlan?: string;

}

export interface ApplicationComplianceMaturityMetadata {

  notes?: string;

  tags: string[];

}

export interface ApplicationComplianceMaturityAssessment {

  id: string;

  version: number;

  status: ApplicationComplianceMaturityAssessmentStatus;

  scope: ApplicationComplianceMaturityAssessmentScope;

  dimensionScores: ApplicationComplianceMaturityDimensionScore[];

  overallResult: ApplicationComplianceOverallResult;

  execution: ApplicationComplianceMaturityExecution;

  evidence: ApplicationComplianceMaturityEvidence;

  followUp: ApplicationComplianceMaturityFollowUp;

  metadata: ApplicationComplianceMaturityMetadata;

  createdAt: string;

  updatedAt: string;

}