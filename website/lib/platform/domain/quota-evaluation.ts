/**
 * PP-002 Milestone C
 * Global Quota Evaluation Domain
 *
 * Represents an immutable runtime evaluation
 * of a quota against measured usage.
 */

export type QuotaEvaluationStatus =
  | "within_limit"
  | "warning"
  | "exceeded"
  | "overage"
  | "blocked";

export type QuotaEvaluationTrigger =
  | "manual"
  | "scheduled"
  | "realtime"
  | "billing"
  | "workflow"
  | "api";

export interface QuotaEvaluationUsage {

  usageMeterId: string;

  consumed: number;

  remaining: number;

  limit: number;

  percentageUsed: number;

}

export interface QuotaEvaluationResult {

  allowed: boolean;

  warningIssued: boolean;

  overageApplied: boolean;

  enforcementAction:
    | "allow"
    | "warn"
    | "throttle"
    | "block"
    | "bill_overage";

}

export interface QuotaEvaluationContext {

  subscriptionId?: string;

  invoiceId?: string;

  patientId?: string;

  providerId?: string;

  conversationId?: string;

  workflowId?: string;

}

export interface QuotaEvaluationMetadata {

  description?: string;

  evaluatedBy?: string;

  tags: string[];

}

export interface QuotaEvaluation {

  id: string;

  tenantId: string;

  clinicId?: string;

  quotaId: string;

  usageRecordId?: string;

  status: QuotaEvaluationStatus;

  trigger: QuotaEvaluationTrigger;

  usage: QuotaEvaluationUsage;

  result: QuotaEvaluationResult;

  context: QuotaEvaluationContext;

  metadata: QuotaEvaluationMetadata;

  evaluatedAt: string;

  createdAt: string;

}