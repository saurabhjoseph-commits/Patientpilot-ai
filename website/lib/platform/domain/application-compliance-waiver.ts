/**
 * PP-002 Milestone C
 * Global Application Compliance Waiver Domain
 *
 * Represents an officially approved waiver that
 * removes or modifies a compliance obligation
 * for a defined scope and period.
 */

export type ApplicationComplianceWaiverStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "expired"
  | "revoked"
  | "closed";

export type ApplicationComplianceWaiverType =
  | "temporary"
  | "permanent"
  | "conditional"
  | "regulatory"
  | "contractual"
  | "internal"
  | "emergency"
  | "custom";

export interface ApplicationComplianceWaiverScope {

  frameworkId: string;

  requirementId: string;

  complianceAssessmentId?: string;

  applicationId?: string;

  environmentId?: string;

  tenantIds: string[];

}

export interface ApplicationComplianceWaiverAuthority {

  issuingAuthority: string;

  authorityReference?: string;

  governingBody?: string;

  legalReference?: string;

}

export interface ApplicationComplianceWaiverJustification {

  summary: string;

  reason: string;

  businessImpact?: string;

  legalBasis?: string;

}

export interface ApplicationComplianceWaiverApproval {

  requestedBy: string;

  requestedAt: string;

  reviewerUserIds: string[];

  approvedBy?: string;

  approvedAt?: string;

  effectiveFrom?: string;

  expiresAt?: string;

}

export interface ApplicationComplianceWaiverConditions {

  conditions: string[];

  monitoringRequired: boolean;

  reviewFrequency?: string;

  nextReviewAt?: string;

}

export interface ApplicationComplianceWaiverEvidence {

  supportingDocumentIds: string[];

  evidenceUrls: string[];

  auditLogIds: string[];

}

export interface ApplicationComplianceWaiverFollowUp {

  actionItemIds: string[];

  notes?: string;

}

export interface ApplicationComplianceWaiverMetadata {

  title: string;

  description?: string;

  tags: string[];

}

export interface ApplicationComplianceWaiver {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceWaiverStatus;

  type: ApplicationComplianceWaiverType;

  scope: ApplicationComplianceWaiverScope;

  authority: ApplicationComplianceWaiverAuthority;

  justification: ApplicationComplianceWaiverJustification;

  approval: ApplicationComplianceWaiverApproval;

  conditions: ApplicationComplianceWaiverConditions;

  evidence: ApplicationComplianceWaiverEvidence;

  followUp: ApplicationComplianceWaiverFollowUp;

  metadata: ApplicationComplianceWaiverMetadata;

  createdAt: string;

  updatedAt: string;

}