/**
 * PP-002 Milestone C
 * Global Application Risk Assessment Domain
 *
 * Historical assessment of an application risk.
 * Multiple assessments may exist for a single risk
 * as it evolves over time.
 */

export type ApplicationRiskAssessmentStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "superseded"
  | "rejected";

export type ApplicationRiskAssessmentMethod =
  | "manual"
  | "automated"
  | "hybrid"
  | "scheduled"
  | "incident_review"
  | "audit"
  | "security_review"
  | "compliance_review"
  | "custom";

export interface ApplicationRiskAssessmentScore {

  likelihood: number;

  impact: number;

  inherentRiskScore: number;

  residualRiskScore?: number;

  confidence?: number;

}

export interface ApplicationRiskAssessmentEvidence {

  summary?: string;

  evidenceUrls: string[];

  relatedIncidentIds: string[];

  relatedProblemIds: string[];

  relatedKnownErrorIds: string[];

}

export interface ApplicationRiskAssessmentRecommendation {

  recommendedTreatment:
    | "avoid"
    | "mitigate"
    | "transfer"
    | "accept";

  justification?: string;

  actionItemIds: string[];

  nextReviewAt?: string;

}

export interface ApplicationRiskAssessmentReview {

  assessorUserId: string;

  reviewerUserIds: string[];

  approvedBy?: string;

  approvedAt?: string;

}

export interface ApplicationRiskAssessmentMetadata {

  assessmentReason?: string;

  notes?: string;

  framework?: string;

  tags: string[];

}

export interface ApplicationRiskAssessment {

  id: string;

  riskId: string;

  version: number;

  status: ApplicationRiskAssessmentStatus;

  method: ApplicationRiskAssessmentMethod;

  score: ApplicationRiskAssessmentScore;

  evidence: ApplicationRiskAssessmentEvidence;

  recommendation: ApplicationRiskAssessmentRecommendation;

  review: ApplicationRiskAssessmentReview;

  metadata: ApplicationRiskAssessmentMetadata;

  assessedAt: string;

  createdAt: string;

  updatedAt: string;

}