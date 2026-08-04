/**
 * PP-002 Milestone C
 * Global Deployment Domain
 *
 * Represents a software release
 * deployed into a platform
 * environment.
 */

export type DeploymentStatus =
  | "planned"
  | "building"
  | "deploying"
  | "active"
  | "failed"
  | "rolled_back"
  | "retired";

export type DeploymentStrategy =
  | "rolling"
  | "blue_green"
  | "canary"
  | "recreate"
  | "manual";

export interface DeploymentTarget {

  environmentId: string;

  applicationId?: string;

  serviceId?: string;

}

export interface DeploymentVersion {

  version: string;

  buildNumber?: string;

  commitHash?: string;

  artifactId?: string;

}

export interface DeploymentExecution {

  strategy: DeploymentStrategy;

  initiatedBy?: string;

  approvedBy?: string;

  startedAt?: string;

  completedAt?: string;

}

export interface DeploymentRollback {

  enabled: boolean;

  previousDeploymentId?: string;

  rolledBackAt?: string;

}

export interface DeploymentHealth {

  healthy: boolean;

  healthCheckUrl?: string;

  lastCheckedAt?: string;

}

export interface DeploymentMetadata {

  releaseNotes?: string;

  tags: string[];

}

export interface Deployment {

  id: string;

  code: string;

  status: DeploymentStatus;

  target: DeploymentTarget;

  version: DeploymentVersion;

  execution: DeploymentExecution;

  rollback: DeploymentRollback;

  health: DeploymentHealth;

  metadata: DeploymentMetadata;

  createdAt: string;

  updatedAt: string;

}