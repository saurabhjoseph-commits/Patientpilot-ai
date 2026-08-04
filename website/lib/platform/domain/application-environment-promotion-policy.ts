/**
 * PP-002 Milestone C
 * Global Application Environment Promotion Policy Domain
 *
 * Reusable policy governing promotion
 * between application environments.
 */

export type ApplicationEnvironmentPromotionPolicyStatus =
  | "draft"
  | "active"
  | "disabled"
  | "deprecated";

export type ApplicationEnvironmentPromotionMode =
  | "automatic"
  | "manual"
  | "approval_required"
  | "scheduled";

export type ApplicationEnvironmentPromotionFailureAction =
  | "block"
  | "rollback"
  | "retry"
  | "manual_review";

export interface ApplicationEnvironmentPromotionRoute {

  sourceEnvironmentId: string;

  targetEnvironmentId: string;

  sequence: number;

}

export interface ApplicationEnvironmentPromotionScope {

  applicationId: string;

  releaseTrainId?: string;

  deploymentStrategy?:
    | "rolling"
    | "blue_green"
    | "canary"
    | "feature_flag"
    | "phased"
    | "manual";

}

export interface ApplicationEnvironmentPromotionApproval {

  approvalRequired: boolean;

  minimumApprovers: number;

  approverRoleIds: string[];

}

export interface ApplicationEnvironmentPromotionValidation {

  qualityGateIds: string[];

  requireHealthyApplication: boolean;

  requireSuccessfulDeployment: boolean;

  requireAllPreviousPromotions: boolean;

}

export interface ApplicationEnvironmentPromotionBehavior {

  promotionMode: ApplicationEnvironmentPromotionMode;

  allowSkipEnvironments: boolean;

  allowRollback: boolean;

  retryOnFailure: boolean;

  maximumRetries: number;

  failureAction: ApplicationEnvironmentPromotionFailureAction;

}

export interface ApplicationEnvironmentPromotionMetadata {

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationEnvironmentPromotionPolicy {

  id: string;

  code: string;

  name: string;

  status: ApplicationEnvironmentPromotionPolicyStatus;

  scope: ApplicationEnvironmentPromotionScope;

  route: ApplicationEnvironmentPromotionRoute[];

  approval: ApplicationEnvironmentPromotionApproval;

  validation: ApplicationEnvironmentPromotionValidation;

  behavior: ApplicationEnvironmentPromotionBehavior;

  metadata: ApplicationEnvironmentPromotionMetadata;

  createdAt: string;

  updatedAt: string;

}