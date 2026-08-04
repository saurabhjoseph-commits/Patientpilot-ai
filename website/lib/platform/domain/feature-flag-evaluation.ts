/**
 * PP-002 Milestone C
 * Global Feature Flag Evaluation Domain
 *
 * Represents a single runtime evaluation
 * of a feature flag.
 */

export type FeatureFlagEvaluationStatus =
  | "enabled"
  | "disabled"
  | "error"
  | "skipped";

export type FeatureFlagEvaluationSource =
  | "api"
  | "web"
  | "mobile"
  | "worker"
  | "workflow"
  | "automation"
  | "system"
  | "ai";

export interface FeatureFlagEvaluationContext {

  source: FeatureFlagEvaluationSource;

  tenantId?: string;

  clinicId?: string;

  userId?: string;

  roleId?: string;

  country?: string;

  environment?: string;

}

export interface FeatureFlagEvaluationStrategy {

  strategy: string;

  matchedRuleId?: string;

  rolloutPercentage?: number;

}

export interface FeatureFlagEvaluationResult {

  enabled: boolean;

  reason?: string;

}

export interface FeatureFlagEvaluationMetrics {

  durationMs?: number;

}

export interface FeatureFlagEvaluationMetadata {

  correlationId?: string;

  requestId?: string;

  traceId?: string;

}

export interface FeatureFlagEvaluation {

  id: string;

  tenantId?: string;

  clinicId?: string;

  featureFlagId: string;

  status: FeatureFlagEvaluationStatus;

  context: FeatureFlagEvaluationContext;

  strategy: FeatureFlagEvaluationStrategy;

  result: FeatureFlagEvaluationResult;

  metrics: FeatureFlagEvaluationMetrics;

  metadata: FeatureFlagEvaluationMetadata;

  evaluatedAt: string;

  createdAt: string;

  updatedAt: string;

}