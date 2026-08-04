/**
 * PP-002 Milestone C
 * Global Application Compliance Obligation Domain
 *
 * Represents a tenant-specific obligation to
 * satisfy a compliance requirement.
 */

export type ApplicationComplianceObligationStatus =
  | "planned"
  | "assigned"
  | "in_progress"
  | "implemented"
  | "verified"
  | "completed"
  | "overdue"
  | "cancelled";

export type ApplicationComplianceObligationPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface ApplicationComplianceObligationScope {

  tenantId: string;

  frameworkId: string;

  requirementId: string;

  applicationId?: string;

  environmentId?: string;

  serviceIds: string[];

}

export interface ApplicationComplianceObligationOwnership {

  ownerUserId?: string;

  ownerTeamId?: string;

  assignedBy?: string;

  assignedAt?: string;

}

export interface ApplicationComplianceObligationSchedule {

  plannedStartAt?: string;

  dueAt?: string;

  implementedAt?: string;

  verifiedAt?: string;

}

export interface ApplicationComplianceObligationImplementation {

  implementationStatus: string;

  implementationNotes?: string;

  controlIds: string[];

  policyIds: string[];

  documentIds: string[];

}

export interface ApplicationComplianceObligationVerification {

  verified: boolean;

  verifierUserId?: string;

  verificationMethod?:
    | "manual_review"
    | "automated"
    | "audit"
    | "continuous_monitoring"
    | "custom";

  verificationNotes?: string;

}

export interface ApplicationComplianceObligationReferences {

  complianceAssessmentIds: string[];

  requirementAssessmentIds: string[];

  exceptionIds: string[];

  waiverIds: string[];

  certificationIds: string[];

  actionItemIds: string[];

}

export interface ApplicationComplianceObligationMetadata {

  title: string;

  description?: string;

  tags: string[];

}

export interface ApplicationComplianceObligation {

  id: string;

  code: string;

  version: number;

  status: ApplicationComplianceObligationStatus;

  priority: ApplicationComplianceObligationPriority;

  scope: ApplicationComplianceObligationScope;

  ownership: ApplicationComplianceObligationOwnership;

  schedule: ApplicationComplianceObligationSchedule;

  implementation: ApplicationComplianceObligationImplementation;

  verification: ApplicationComplianceObligationVerification;

  references: ApplicationComplianceObligationReferences;

  metadata: ApplicationComplianceObligationMetadata;

  createdAt: string;

  updatedAt: string;

}