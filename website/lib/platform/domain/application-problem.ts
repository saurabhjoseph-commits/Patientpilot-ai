/**
 * PP-002 Milestone C
 * Global Application Problem Domain
 *
 * Represents an underlying operational
 * problem that may cause one or more incidents.
 */

export type ApplicationProblemStatus =
  | "identified"
  | "investigating"
  | "root_cause_identified"
  | "known_error"
  | "mitigation_in_progress"
  | "resolved"
  | "closed"
  | "cancelled";

export type ApplicationProblemSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type ApplicationProblemCategory =
  | "application"
  | "deployment"
  | "configuration"
  | "database"
  | "network"
  | "infrastructure"
  | "security"
  | "integration"
  | "capacity"
  | "performance"
  | "custom";

export interface ApplicationProblemScope {

  applicationId: string;

  environmentId?: string;

  incidentIds: string[];

  postmortemIds: string[];

}

export interface ApplicationProblemAnalysis {

  rootCause?: string;

  knownError: boolean;

  symptoms: string[];

  contributingFactors: string[];

  businessImpact?: string;

}

export interface ApplicationProblemResolution {

  workaround?: string;

  permanentFix?: string;

  correctiveActionIds: string[];

  preventiveActionIds: string[];

  relatedChangeRequestIds: string[];

}

export interface ApplicationProblemOwnership {

  ownerUserId?: string;

  ownerTeamId?: string;

  assignedAt?: string;

}

export interface ApplicationProblemMetadata {

  title: string;

  description?: string;

  documentationUrl?: string;

  runbookUrl?: string;

  tags: string[];

}

export interface ApplicationProblem {

  id: string;

  code: string;

  status: ApplicationProblemStatus;

  severity: ApplicationProblemSeverity;

  category: ApplicationProblemCategory;

  scope: ApplicationProblemScope;

  analysis: ApplicationProblemAnalysis;

  resolution: ApplicationProblemResolution;

  ownership: ApplicationProblemOwnership;

  metadata: ApplicationProblemMetadata;

  createdAt: string;

  updatedAt: string;

}