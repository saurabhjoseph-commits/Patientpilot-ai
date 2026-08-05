/**
 * PP-002 Milestone C
 * Global Policy Execution Domain
 *
 * Represents a single execution
 * of a business policy.
 */

export type PolicyExecutionStatus =
  | "passed"
  | "failed"
  | "error"
  | "skipped";

export type PolicyExecutionSource =
  | "workflow"
  | "automation"
  | "ai"
  | "validation"
  | "api"
  | "integration"
  | "system"
  | "manual";

export interface PolicyExecutionContext {

  source: PolicyExecutionSource;

  sourceId?: string;

  workflowId?: string;

  workflowStepId?: string;

  automationId?: string;

}

export interface PolicyExecutionInput {

  version: string;

  data: Record<string, unknown>;

}

export interface PolicyExecutionRule {

  ruleId: string;

  ruleExecutionId?: string;

  status: "passed" | "failed" | "error" | "skipped";

}

export interface PolicyExecutionDecision {

  approved: boolean;

  reason?: string;

}

export interface PolicyExecutionMetrics {

  durationMs?: number;

  evaluatedRules: number;

}

export interface PolicyExecutionMetadata {

  correlationId?: string;

  requestId?: string;

  traceId?: string;

}

export interface PolicyExecution {

  id: string;

  tenantId: string;

  clinicId?: string;

  policyId: string;

  status: PolicyExecutionStatus;

  context: PolicyExecutionContext;

  input: PolicyExecutionInput;

  rules: PolicyExecutionRule[];

  decision: PolicyExecutionDecision;

  metrics: PolicyExecutionMetrics;

  metadata: PolicyExecutionMetadata;

  evaluatedAt: string;

  createdAt: string;

  updatedAt: string;

}