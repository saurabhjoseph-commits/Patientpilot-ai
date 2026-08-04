/**
 * PP-002 Milestone C
 * Global Application Postmortem Domain
 *
 * Structured post-incident review and
 * continuous improvement record.
 */

export type ApplicationPostmortemStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "archived";

export type ApplicationPostmortemSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface ApplicationPostmortemScope {

  incidentId: string;

  applicationId: string;

  environmentId?: string;

  responseId?: string;

  changeExecutionId?: string;

  deploymentExecutionId?: string;

}

export interface ApplicationPostmortemImpact {

  severity: ApplicationPostmortemSeverity;

  affectedTenants: string[];

  affectedServices: string[];

  affectedUsers?: number;

  downtimeMinutes?: number;

  customerVisible: boolean;

}

export interface ApplicationPostmortemAnalysis {

  rootCause: string;

  contributingFactors: string[];

  detectionSummary: string;

  responseSummary: string;

  recoverySummary: string;

}

export interface ApplicationPostmortemLessonsLearned {

  successes: string[];

  improvements: string[];

  recommendations: string[];

}

export interface ApplicationPostmortemActions {

  correctiveActionIds: string[];

  preventiveActionIds: string[];

  followUpTaskIds: string[];

}

export interface ApplicationPostmortemReview {

  authorId: string;

  reviewerIds: string[];

  approvedBy?: string;

  approvedAt?: string;

}

export interface ApplicationPostmortemMetadata {

  title: string;

  summary: string;

  timelineSummary?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationPostmortem {

  id: string;

  code: string;

  status: ApplicationPostmortemStatus;

  scope: ApplicationPostmortemScope;

  impact: ApplicationPostmortemImpact;

  analysis: ApplicationPostmortemAnalysis;

  lessonsLearned: ApplicationPostmortemLessonsLearned;

  actions: ApplicationPostmortemActions;

  review: ApplicationPostmortemReview;

  metadata: ApplicationPostmortemMetadata;

  createdAt: string;

  updatedAt: string;

}