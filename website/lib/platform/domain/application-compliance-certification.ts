/**
 * PP-002 Milestone C
 * Global Application Compliance Certification Domain
 *
 * Represents a certification, attestation,
 * accreditation, or compliance report issued
 * by an authorized organization.
 */

export type ApplicationComplianceCertificationStatus =
  | "draft"
  | "pending"
  | "active"
  | "suspended"
  | "expired"
  | "revoked"
  | "replaced";

export type ApplicationComplianceCertificationType =
  | "certification"
  | "attestation"
  | "accreditation"
  | "assessment_report"
  | "audit_report"
  | "self_declaration"
  | "internal_approval"
  | "custom";

export interface ApplicationComplianceCertificationScope {

  frameworkId: string;

  complianceAssessmentId?: string;

  applicationIds: string[];

  environmentIds: string[];

  tenantIds: string[];

  serviceIds: string[];

}

export interface ApplicationComplianceCertificationIssuer {

  organization: string;

  issuingAuthority?: string;

  auditorName?: string;

  certificateNumber?: string;

}

export interface ApplicationComplianceCertificationValidity {

  issuedAt: string;

  effectiveFrom: string;

  expiresAt?: string;

  renewalRequired: boolean;

  renewalDate?: string;

}

export interface ApplicationComplianceCertificationEvidence {

  reportDocumentIds: string[];

  certificateDocumentIds: string[];

  evidenceUrls: string[];

  auditLogIds: string[];

}

export interface ApplicationComplianceCertificationReview {

  reviewerUserIds: string[];

  approvedBy?: string;

  approvalDate?: string;

  notes?: string;

}

export interface ApplicationComplianceCertificationMetadata {

  title: string;

  description?: string;

  tags: string[];

}

export interface ApplicationComplianceCertification {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceCertificationStatus;

  type: ApplicationComplianceCertificationType;

  scope: ApplicationComplianceCertificationScope;

  issuer: ApplicationComplianceCertificationIssuer;

  validity: ApplicationComplianceCertificationValidity;

  evidence: ApplicationComplianceCertificationEvidence;

  review: ApplicationComplianceCertificationReview;

  metadata: ApplicationComplianceCertificationMetadata;

  createdAt: string;

  updatedAt: string;

}