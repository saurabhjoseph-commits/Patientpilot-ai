/**
 * PP-002 Milestone C
 * Global Application Risk Domain
 *
 * Represents an identified operational,
 * technical, security, compliance, or
 * business risk before it becomes an incident.
 */

export type ApplicationRiskStatus =
  | "identified"
  | "assessing"
  | "accepted"
  | "mitigating"
  | "monitoring"
  | "closed"
  | "retired";

export type ApplicationRiskCategory =
  | "security"
  | "reliability"
  | "availability"
  | "performance"
  | "capacity"
  | "infrastructure"
  | "application"
  | "deployment"
  | "integration"
  | "vendor"
  | "compliance"
  | "privacy"
  | "financial"
  | "operational"
  | "business_continuity"
  | "ai"
  | "custom";

export type ApplicationRiskLikelihood =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "very_high";

export type ApplicationRiskImpact =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ApplicationRiskTreatment =
  | "avoid"
  | "mitigate"
  | "transfer"
  | "accept";

export interface ApplicationRiskScope {

  applicationId: string;

  environmentId?: string;

  serviceIds: string[];

  tenantIds: string[];

}

export interface ApplicationRiskAssessment {

  likelihood: ApplicationRiskLikelihood;

  impact: ApplicationRiskImpact;

  overallRating: number;

  rationale?: string;

}

export interface ApplicationRiskResponse {

  treatment: ApplicationRiskTreatment;

  mitigationPlan?: string;

  contingencyPlan?: string;

  actionItemIds: string[];

}

export interface ApplicationRiskOwnership {

  ownerUserId?: string;

  ownerTeamId?: string;

  reviewedBy?: string;

  nextReviewAt?: string;

}

export interface ApplicationRiskMetadata {

  title: string;

  description?: string;

  identifiedBy?: string;

  identifiedAt: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationRisk {

  id: string;

  code: string;

  status: ApplicationRiskStatus;

  category: ApplicationRiskCategory;

  scope: ApplicationRiskScope;

  assessment: ApplicationRiskAssessment;

  response: ApplicationRiskResponse;

  ownership: ApplicationRiskOwnership;

  metadata: ApplicationRiskMetadata;

  createdAt: string;

  updatedAt: string;

}