/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Represents a runtime safety and policy
 * validation performed during AI execution.
 */

export type AISafetyCheckStatus =
  | "pending"
  | "running"
  | "passed"
  | "warning"
  | "failed"
  | "skipped";

export type AISafetyCheckType =
  | "prompt_injection"
  | "jailbreak_detection"
  | "toxicity"
  | "harmful_content"
  | "pii_detection"
  | "phi_detection"
  | "policy_compliance"
  | "tool_authorization"
  | "output_moderation"
  | "hallucination_detection"
  | "custom";

export type AISafetySeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AISafetyCheckTarget {

  sessionId?: string;

  generationId?: string;

  messageId?: string;

}

export interface AISafetyCheckResult {

  passed: boolean;

  confidence?: number;

  riskScore?: number;

  severity?: AISafetySeverity;

  reason?: string;

}

export interface AISafetyCheckPerformance {

  startedAt: string;

  completedAt?: string;

  durationMilliseconds?: number;

}

export interface AISafetyCheckMetadata {

  policyId?: string;

  policyVersion?: string;

  checkerName?: string;

  checkerVersion?: string;

  notes?: string;

  tags: string[];

}

export interface AISafetyCheck {

  id: string;

  status: AISafetyCheckStatus;

  type: AISafetyCheckType;

  target: AISafetyCheckTarget;

  result: AISafetyCheckResult;

  performance: AISafetyCheckPerformance;

  metadata: AISafetyCheckMetadata;

  createdAt: string;

  updatedAt: string;

}