/**
 * PP-002 Milestone C
 * Global Application Known Error Domain
 *
 * Published knowledge article describing
 * a known operational problem, its symptoms,
 * workaround, and permanent resolution.
 */

export type ApplicationKnownErrorStatus =
  | "draft"
  | "review"
  | "published"
  | "deprecated"
  | "archived";

export type ApplicationKnownErrorSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export interface ApplicationKnownErrorScope {

  problemId: string;

  applicationId: string;

  environmentIds: string[];

  affectedVersions: string[];

}

export interface ApplicationKnownErrorDiagnosis {

  symptoms: string[];

  triggerConditions: string[];

  rootCause: string;

  detectionGuidance?: string;

}

export interface ApplicationKnownErrorResolution {

  workaround: string;

  permanentResolution?: string;

  relatedChangeRequestIds: string[];

  relatedDeploymentIds: string[];

}

export interface ApplicationKnownErrorKnowledge {

  knowledgeArticleUrl?: string;

  runbookUrl?: string;

  troubleshootingSteps: string[];

  automationAvailable: boolean;

}

export interface ApplicationKnownErrorOwnership {

  authorId: string;

  reviewerIds: string[];

  approvedBy?: string;

  approvedAt?: string;

}

export interface ApplicationKnownErrorMetadata {

  title: string;

  summary: string;

  keywords: string[];

  tags: string[];

}

export interface ApplicationKnownError {

  id: string;

  code: string;

  status: ApplicationKnownErrorStatus;

  severity: ApplicationKnownErrorSeverity;

  scope: ApplicationKnownErrorScope;

  diagnosis: ApplicationKnownErrorDiagnosis;

  resolution: ApplicationKnownErrorResolution;

  knowledge: ApplicationKnownErrorKnowledge;

  ownership: ApplicationKnownErrorOwnership;

  metadata: ApplicationKnownErrorMetadata;

  createdAt: string;

  updatedAt: string;

}