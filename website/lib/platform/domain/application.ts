/**
 * PP-002 Milestone C
 * Global Application Domain
 *
 * Represents a deployable software
 * application within the platform.
 */

export type ApplicationStatus =
  | "draft"
  | "active"
  | "maintenance"
  | "deprecated"
  | "retired";

export type ApplicationType =
  | "web"
  | "api"
  | "service"
  | "worker"
  | "mobile"
  | "desktop"
  | "cli"
  | "library";

export interface ApplicationIdentity {

  name: string;

  displayName: string;

  description?: string;

}

export interface ApplicationOwnership {

  organizationId?: string;

  teamId?: string;

  ownerId?: string;

}

export interface ApplicationRuntime {

  language?: string;

  framework?: string;

  runtime?: string;

}

export interface ApplicationEndpoints {

  repositoryUrl?: string;

  documentationUrl?: string;

  homepageUrl?: string;

  healthCheckPath?: string;

}

export interface ApplicationCapabilities {

  multiTenant: boolean;

  supportsScaling: boolean;

  supportsHighAvailability: boolean;

}

export interface ApplicationMetadata {

  tags: string[];

}

export interface Application {

  id: string;

  code: string;

  status: ApplicationStatus;

  type: ApplicationType;

  identity: ApplicationIdentity;

  ownership: ApplicationOwnership;

  runtime: ApplicationRuntime;

  endpoints: ApplicationEndpoints;

  capabilities: ApplicationCapabilities;

  metadata: ApplicationMetadata;

  createdAt: string;

  updatedAt: string;

}