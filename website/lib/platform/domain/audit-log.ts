/**
 * PP-004 Audit Domain
 *
 * Aggregate root representing
 * an immutable audit record.
 *
 * Every significant business action
 * performed by users, AI, workflows,
 * integrations, or the system should
 * create an audit log entry.
 */

export type AuditLogCategory =
  | "authentication"
  | "authorization"
  | "patient"
  | "appointment"
  | "conversation"
  | "billing"
  | "payment"
  | "workflow"
  | "ai"
  | "integration"
  | "configuration"
  | "system"
  | "custom";

export type AuditLogSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type AuditActorType =
  | "user"
  | "patient"
  | "provider"
  | "ai_agent"
  | "workflow"
  | "integration"
  | "system";

export interface AuditActor {

  actorType: AuditActorType;

  actorId?: string;

  displayName?: string;

}

export interface AuditTarget {

  entityType: string;

  entityId: string;

}

export interface AuditAction {

  action: string;

  description?: string;

}

export interface AuditContext {

  correlationId?: string;

  workflowExecutionId?: string;

  businessEventId?: string;

  ipAddress?: string;

  userAgent?: string;

}

export interface AuditChange {

  beforeReferenceId?: string;

  afterReferenceId?: string;

}

export interface AuditMetadata {

  externalId?: string;

  tags?: string[];

}

export interface AuditLog {

  id: string;

  tenantId: string;

  clinicId?: string;

  category: AuditLogCategory;

  severity: AuditLogSeverity;

  actor: AuditActor;

  target: AuditTarget;

  action: AuditAction;

  context: AuditContext;

  change?: AuditChange;

  metadata: AuditMetadata;

  occurredAt: string;

}