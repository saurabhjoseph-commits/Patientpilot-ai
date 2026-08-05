/**
 * PP-002 Milestone C
 * Global Application Dependency Domain
 *
 * Defines dependencies between
 * applications and external
 * platform resources.
 */

export type ApplicationDependencyStatus =
  | "active"
  | "optional"
  | "deprecated"
  | "retired";

export type ApplicationDependencyType =
  | "application"
  | "database"
  | "cache"
  | "message_queue"
  | "storage"
  | "search"
  | "identity"
  | "email"
  | "sms"
  | "ai_provider"
  | "payment"
  | "monitoring"
  | "external_api"
  | "custom";

export interface ApplicationDependencyTarget {

  applicationId?: string;

  resourceId?: string;

  resourceName: string;

}

export interface ApplicationDependencyRequirement {

  required: boolean;

  minimumVersion?: string;

  maximumVersion?: string;

}

export interface ApplicationDependencyBehavior {

  startupRequired: boolean;

  runtimeRequired: boolean;

  failFast: boolean;

  healthCheckRequired: boolean;

}

export interface ApplicationDependencyMetadata {

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationDependency {

  id: string;

  applicationId: string;

  status: ApplicationDependencyStatus;

  type: ApplicationDependencyType;

  target: ApplicationDependencyTarget;

  requirement: ApplicationDependencyRequirement;

  behavior: ApplicationDependencyBehavior;

  metadata: ApplicationDependencyMetadata;

  createdAt: string;

  updatedAt: string;

}