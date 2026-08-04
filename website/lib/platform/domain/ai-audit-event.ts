/**
 * PP-002 Milestone D
 * AI Platform & Intelligence Domain
 *
 * Immutable audit event representing
 * an AI runtime lifecycle event.
 */

export type AIAuditEventType =
  | "session_started"
  | "session_completed"
  | "message_received"
  | "generation_started"
  | "generation_completed"
  | "generation_failed"
  | "reasoning_completed"
  | "knowledge_retrieval_completed"
  | "tool_execution_completed"
  | "evaluation_completed"
  | "safety_check_completed"
  | "governance_decision_made"
  | "policy_resolved"
  | "response_delivered"
  | "human_override"
  | "custom";

export type AIAuditEventSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export interface AIAuditEventActor {

  actorType:
    | "system"
    | "user"
    | "agent"
    | "administrator"
    | "service";

  actorId?: string;

}

export interface AIAuditEventResource {

  sessionId?: string;

  messageId?: string;

  generationId?: string;

  toolExecutionId?: string;

  retrievalId?: string;

  safetyCheckId?: string;

  evaluationId?: string;

  governanceDecisionId?: string;

  policyVersionId?: string;

}

export interface AIAuditEventContext {

  correlationId?: string;

  requestId?: string;

  traceId?: string;

  source?: string;

}

export interface AIAuditEventMetadata {

  description?: string;

  attributes: Record<string, unknown>;

  tags: string[];

}

export interface AIAuditEvent {

  id: string;

  tenantId?: string;

  type: AIAuditEventType;

  severity: AIAuditEventSeverity;

  actor: AIAuditEventActor;

  resource: AIAuditEventResource;

  context: AIAuditEventContext;

  metadata: AIAuditEventMetadata;

  occurredAt: string;

  createdAt: string;

}