/**
 * PP-002 Milestone C
 * Global Application Compliance Control Mapping Domain
 *
 * Represents the relationship between a
 * compliance requirement and an application
 * control.
 */

export type ApplicationComplianceControlMappingStatus =
  | "draft"
  | "active"
  | "under_review"
  | "approved"
  | "deprecated"
  | "retired";

export type ApplicationComplianceControlCoverage =
  | "full"
  | "partial"
  | "compensating"
  | "not_applicable";

export interface ApplicationComplianceControlMappingReference {

  frameworkId: string;

  requirementId: string;

  controlId: string;

}

export interface ApplicationComplianceControlMappingCoverage {

  level: ApplicationComplianceControlCoverage;

  rationale?: string;

  implementationNotes?: string;

}

export interface ApplicationComplianceControlMappingGovernance {

  ownerUserId?: string;

  ownerTeamId?: string;

  approvedBy?: string;

  approvedAt?: string;

  reviewFrequency?: string;

  nextReviewAt?: string;

}

export interface ApplicationComplianceControlMappingValidation {

  validated: boolean;

  lastValidatedAt?: string;

  validationMethod?:
    | "manual_review"
    | "audit"
    | "automated"
    | "continuous_monitoring"
    | "custom";

  evidenceUrls: string[];

}

export interface ApplicationComplianceControlMappingMetadata {

  tags: string[];

  notes?: string;

}

export interface ApplicationComplianceControlMapping {

  id: string;

  code: string;

  status: ApplicationComplianceControlMappingStatus;

  reference: ApplicationComplianceControlMappingReference;

  coverage: ApplicationComplianceControlMappingCoverage;

  governance: ApplicationComplianceControlMappingGovernance;

  validation: ApplicationComplianceControlMappingValidation;

  metadata: ApplicationComplianceControlMappingMetadata;

  effectiveFrom?: string;

  effectiveUntil?: string;

  createdAt: string;

  updatedAt: string;

}