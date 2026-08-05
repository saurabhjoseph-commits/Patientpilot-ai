/**
 * PP-002 Milestone C
 * Global Application Quality Gate Domain
 *
 * Reusable quality validation policy
 * executed before deployments and releases.
 */

export type ApplicationQualityGateStatus =
  | "draft"
  | "active"
  | "disabled"
  | "deprecated";

export type ApplicationQualityGateType =
  | "unit_tests"
  | "integration_tests"
  | "end_to_end_tests"
  | "performance"
  | "security"
  | "compliance"
  | "code_quality"
  | "dependency_scan"
  | "infrastructure"
  | "manual_approval"
  | "custom";

export type ApplicationQualityGateOperator =
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "between"
  | "contains";

export interface ApplicationQualityGateScope {

  applicationId: string;

  environmentIds?: string[];

  releaseTrainId?: string;

  deploymentId?: string;

}

export interface ApplicationQualityGateCondition {

  metricName: string;

  operator: ApplicationQualityGateOperator;

  expectedValue: string;

  required: boolean;

}

export interface ApplicationQualityGateBehavior {

  stopOnFailure: boolean;

  allowOverride: boolean;

  overrideApprovalRequired: boolean;

  retryAllowed: boolean;

  maximumRetries: number;

}

export interface ApplicationQualityGateExecutionPolicy {

  executionOrder: number;

  timeoutSeconds?: number;

  parallelExecution: boolean;

}

export interface ApplicationQualityGateMetadata {

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationQualityGate {

  id: string;

  code: string;

  name: string;

  status: ApplicationQualityGateStatus;

  type: ApplicationQualityGateType;

  scope: ApplicationQualityGateScope;

  conditions: ApplicationQualityGateCondition[];

  behavior: ApplicationQualityGateBehavior;

  executionPolicy: ApplicationQualityGateExecutionPolicy;

  metadata: ApplicationQualityGateMetadata;

  createdAt: string;

  updatedAt: string;

}