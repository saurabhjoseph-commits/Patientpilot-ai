/**
 * PP-002 Milestone C
 * Global Application Compliance Evidence Domain
 *
 * Represents a reusable compliance evidence artifact
 * that supports audits, assessments, certifications,
 * controls, risks, and regulatory reporting.
 */

export type ApplicationComplianceEvidenceStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "expired"
  | "archived";

export type ApplicationComplianceEvidenceType =
  | "document"
  | "policy"
  | "procedure"
  | "control_result"
  | "audit_report"
  | "assessment"
  | "certificate"
  | "log"
  | "screenshot"
  | "recording"
  | "configuration"
  | "system_export"
  | "external_link"
  | "custom";

export interface ApplicationComplianceEvidenceScope {

  tenantId: string;

  applicationId?: string;

  environmentId?: string;

  complianceProgramId?: string;

}

export interface ApplicationComplianceEvidenceOwnership {

  ownerUserId?: string;

  ownerTeamId?: string;

  submittedBy?: string;

  reviewedBy?: string;

  approvedBy?: string;

}

export interface ApplicationComplianceEvidenceSource {

  sourceSystem?: string;

  sourceReference?: string;

  collectedMethod:
    | "manual"
    | "automated"
    | "integration"
    | "api"
    | "import"
    | "custom";

  collectedAt: string;

}

export interface ApplicationComplianceEvidenceValidity {

  effectiveFrom?: string;

  expiresAt?: string;

  reviewRequired: boolean;

  nextReviewAt?: string;

}

export interface ApplicationComplianceEvidenceRelationships {

  documentIds: string[];

  complianceAssessmentIds: string[];

  requirementAssessmentIds: string[];

  controlAssessmentIds: string[];

  auditIds: string[];

  certificationIds: string[];

  obligationIds: string[];

  riskAssessmentIds: string[];

}

export interface ApplicationComplianceEvidenceMetadata {

  title: string;

  description?: string;

  classification?:
    | "public"
    | "internal"
    | "confidential"
    | "restricted";

  tags: string[];

}

export interface ApplicationComplianceEvidence {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceEvidenceStatus;

  type: ApplicationComplianceEvidenceType;

  scope: ApplicationComplianceEvidenceScope;

  ownership: ApplicationComplianceEvidenceOwnership;

  source: ApplicationComplianceEvidenceSource;

  validity: ApplicationComplianceEvidenceValidity;

  relationships: ApplicationComplianceEvidenceRelationships;

  metadata: ApplicationComplianceEvidenceMetadata;

  createdAt: string;

  updatedAt: string;

}