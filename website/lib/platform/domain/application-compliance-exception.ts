/**
 * PP-002 Milestone C
 * Global Application Compliance Exception Domain
 *
 * Represents an approved deviation from one or
 * more compliance requirements.
 */

export type ApplicationComplianceExceptionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "expired"
  | "revoked"
  | "closed";

export type ApplicationComplianceExceptionType =
  | "temporary"
  | "permanent"
  | "technical_limitation"
  | "business_requirement"
  | "vendor_dependency"
  | "legacy_system"
  | "compensating_control"
  | "regulatory"
  | "custom";

export type ApplicationComplianceExceptionRiskLevel =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ApplicationComplianceExceptionScope {

  frameworkId: string;

  requirementId: string;

  complianceAssessmentId?: string;

  applicationId?: string;

  environmentId?: string;

  tenantIds: string[];

}

export interface ApplicationComplianceExceptionBusinessJustification {

  summary: string;

  businessReason: string;

  technicalReason?: string;

  impact?: string;

}

export interface ApplicationComplianceExceptionRisk {

  riskId?: string;

  riskAssessmentId?: string;

  riskLevel: ApplicationComplianceExceptionRiskLevel;

  residualRisk?: string;

}

export interface ApplicationComplianceExceptionCompensatingControls {

  controlIds: string[];

  controlAssessmentIds: string[];

  description?: string;

}

export interface ApplicationComplianceExceptionApproval {

  requestedBy: string;

  requestedAt: string;

  reviewerUserIds: string[];

  approvedBy?: string;

  approvedAt?: string;

  expiresAt?: string;

  nextReviewAt?: string;

}

export interface ApplicationComplianceExceptionFollowUp {

  actionItemIds: string[];

  monitoringRequired: boolean;

  monitoringNotes?: string;

}

export interface ApplicationComplianceExceptionMetadata {

  title: string;

  notes?: string;

  tags: string[];

}

export interface ApplicationComplianceException {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceExceptionStatus;

  type: ApplicationComplianceExceptionType;

  scope: ApplicationComplianceExceptionScope;

  justification: ApplicationComplianceExceptionBusinessJustification;

  risk: ApplicationComplianceExceptionRisk;

  compensatingControls: ApplicationComplianceExceptionCompensatingControls;

  approval: ApplicationComplianceExceptionApproval;

  followUp: ApplicationComplianceExceptionFollowUp;

  metadata: ApplicationComplianceExceptionMetadata;

  createdAt: string;

  updatedAt: string;

}