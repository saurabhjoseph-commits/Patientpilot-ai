/**
 * PP-002 Milestone C
 * Global Rule Execution Domain
 *
 * Represents a single evaluation
 * of a business rule.
 */

export type RuleExecutionStatus =
  | "passed"
  | "failed"
  | "error"
  | "skipped";

export type RuleExecutionSource =
  | "workflow"
  | "automation"
  | "ai"
  | "validation"
  | "api"
  | "integration"
  | "system"
  | "manual";

export interface RuleExecutionContext {

  source: RuleExecutionSource;

  sourceId?: string;

  workflowId?: string;

  workflowStepId?: string;

  automationId?: string;

}

export interface RuleExecutionInput {

  version: string;

  data: Record<string, unknown>;

}

export interface RuleExecutionResult {

  matched: boolean;

  output?: Record<string, unknown>;

  errorCode?: string;

  errorMessage?: string;

}

export interface RuleExecutionMetrics {

  durationMs?: number;

}

export interface RuleExecutionMetadata {

  correlationId?: string;

  requestId?: string;

  traceId?: string;

}

export interface RuleExecution {

  id: string;

  tenantId: string;

  clinicId?: string;

  ruleId: string;

  status: RuleExecutionStatus;

  context: RuleExecutionContext;

  input: RuleExecutionInput;

  result: RuleExecutionResult;

  metrics: RuleExecutionMetrics;

  metadata: RuleExecutionMetadata;

  evaluatedAt: string;

  createdAt: string;

  updatedAt: string;

}