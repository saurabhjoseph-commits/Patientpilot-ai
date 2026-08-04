/**
 * PP-002 Milestone C
 * Global Application Release Train Domain
 *
 * Reusable enterprise release cadence
 * definition for coordinated software releases.
 */

export type ApplicationReleaseTrainStatus =
  | "draft"
  | "planned"
  | "active"
  | "paused"
  | "retired";

export type ApplicationReleaseTrainCadence =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "custom";

export type ApplicationReleaseTrainStrategy =
  | "rolling"
  | "blue_green"
  | "canary"
  | "feature_flag"
  | "phased"
  | "manual";

export interface ApplicationReleaseTrainScope {

  organizationId?: string;

  applicationIds: string[];

  environmentIds: string[];

}

export interface ApplicationReleaseTrainSchedule {

  cadence: ApplicationReleaseTrainCadence;

  timezone: string;

  releaseDay?: string;

  releaseTime: string;

  freezeWindowHours?: number;

}

export interface ApplicationReleaseTrainGovernance {

  approvalRequired: boolean;

  changeRequestRequired: boolean;

  qualityGateRequired: boolean;

  rollbackSupported: boolean;

}

export interface ApplicationReleaseTrainConfiguration {

  deploymentStrategy: ApplicationReleaseTrainStrategy;

  automaticPromotion: boolean;

  parallelDeployments: boolean;

  maximumConcurrentDeployments: number;

}

export interface ApplicationReleaseTrainMetadata {

  description?: string;

  ownerTeamId?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationReleaseTrain {

  id: string;

  code: string;

  name: string;

  status: ApplicationReleaseTrainStatus;

  scope: ApplicationReleaseTrainScope;

  schedule: ApplicationReleaseTrainSchedule;

  governance: ApplicationReleaseTrainGovernance;

  configuration: ApplicationReleaseTrainConfiguration;

  metadata: ApplicationReleaseTrainMetadata;

  createdAt: string;

  updatedAt: string;

}