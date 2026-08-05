/**
 * PP-002 Milestone C
 * Global Deployment Step Domain
 *
 * Defines reusable stages within
 * a deployment pipeline.
 */

export type DeploymentStepStatus =
  | "draft"
  | "active"
  | "inactive";

export type DeploymentStepType =
  | "build"
  | "package"
  | "upload"
  | "database"
  | "deploy"
  | "configuration"
  | "health_check"
  | "traffic_switch"
  | "verification"
  | "rollback"
  | "notification"
  | "custom";

export interface DeploymentStepOrder {

  sequence: number;

  parallel: boolean;

}

export interface DeploymentStepBehavior {

  required: boolean;

  continueOnFailure: boolean;

  retryable: boolean;

  maxRetries: number;

  timeoutSeconds?: number;

}

export interface DeploymentStepConditions {

  environments: string[];

  strategies: (
    | "rolling"
    | "blue_green"
    | "canary"
    | "recreate"
    | "manual"
  )[];

}

export interface DeploymentStepMetadata {

  description?: string;

  tags: string[];

}

export interface DeploymentStep {

  id: string;

  deploymentId: string;

  code: string;

  name: string;

  status: DeploymentStepStatus;

  type: DeploymentStepType;

  order: DeploymentStepOrder;

  behavior: DeploymentStepBehavior;

  conditions: DeploymentStepConditions;

  metadata: DeploymentStepMetadata;

  createdAt: string;

  updatedAt: string;

}