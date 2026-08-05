/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Audit Logger
 * ============================================================
 */

import { logger, type LogContext } from "./logger";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "login"
  | "logout"
  | "book"
  | "cancel"
  | "reschedule"
  | "send"
  | "receive"
  | "export"
  | "import";

export interface AuditEntry {
  action: AuditAction;

  resource: string;

  resourceId?: string;

  actorId?: string;

  actorType?: string;

  timestamp?: string;

  context?: LogContext;

  metadata?: Record<string, unknown>;
}

/**
 * Records an immutable audit event.
 *
 * Currently delegates to the core logger.
 * Future versions can persist to:
 *
 * - Database
 * - Audit service
 * - SIEM
 * - Compliance storage
 */
export function audit(entry: AuditEntry): void {
  logger.info("Audit Event", {
    action: entry.action,

    resource: entry.resource,

    resourceId: entry.resourceId,

    actorId: entry.actorId,

    actorType: entry.actorType,

    timestamp:
      entry.timestamp ??
      new Date().toISOString(),

    metadata: entry.metadata,

    ...entry.context,
  });
}