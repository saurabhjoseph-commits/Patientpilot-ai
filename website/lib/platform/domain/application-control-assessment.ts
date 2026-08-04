/**
 * PP-002 Milestone C
 * Global Application Control Assessment Domain
 *
 * Historical verification that a governance,
 * security, operational, or compliance control
 * is functioning effectively.
 */

export type ApplicationControlAssessmentStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "approved"
  | "failed"
  | "superseded";

export type ApplicationControlAssessmentMethod =
  | "manual_review"
  | "automated_test"
  | "continuous_monitoring"
  | "audit"
  | "penetration_test"
  | "security_scan"
  | "tabletop_exercise"
  | "simulation"
  | "custom";

export type ApplicationControlEffectiveness =
  | "effective"
  | "partially_effective"
  | "ineffective"
  | "not_applicable";

export interface ApplicationControlAssessmentScope {

  controlId: string;

  applicationId?: string;

  environmentId?: string;

  serviceIds: string[];

  tenantIds: string[];

}

export interface ApplicationControlAssessmentExecution {

  method: ApplicationControlAssessmentMethod;

  startedAt?: string;

  completedAt?: string;

  assessorUserId: string;

  reviewerUserIds: string[];

}

export interface ApplicationControlAssessmentResult {

  effectiveness: ApplicationControlEffectiveness;

  score?: number;

  passed: boolean;

  findings: string[];

  deficiencies: string[];

  recommendations: string[];

}

export interface ApplicationControlAssessmentEvidence {

  summary?: string;

  evidenceUrls: string[];

  relatedRiskAssessmentIds: string[];

  relatedIncidentIds: string[];

  relatedActionItemIds: string[];

}

export interface ApplicationControlAssessmentFollowUp {

  remediationRequired: boolean;

  remediationActionItemIds: string[];

  nextAssessmentAt?: string;

}

export interface ApplicationControlAssessmentMetadata {

  notes?: string;

  framework?: string;

  tags: string[];

}

export interface ApplicationControlAssessment {

  id: string;

  controlId: string;

  version: number;

  status: ApplicationControlAssessmentStatus;

  scope: ApplicationControlAssessmentScope;

  execution: ApplicationControlAssessmentExecution;

  result: ApplicationControlAssessmentResult;

  evidence: ApplicationControlAssessmentEvidence;

  followUp: ApplicationControlAssessmentFollowUp;

  metadata: ApplicationControlAssessmentMetadata;

  assessedAt: string;

  createdAt: string;

  updatedAt: string;

}