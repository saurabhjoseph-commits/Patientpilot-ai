/**
 * ============================================================
 * PatientPilot AI
 * Audit Behavior
 * ============================================================
 *
 * Pipeline behavior responsible for recording security and
 * business critical actions.
 *
 * Unlike LoggingBehavior, audit records are intended for
 * compliance, security, and operational history.
 */

import type { ApplicationContext } from "../common/ApplicationContext";
import type { ApplicationResult } from "../common/ApplicationResult";
import type { PipelineBehavior } from "./PipelineBehavior";

export interface AuditRecord {
  readonly timestamp: Date;

  readonly requestId: string;

  readonly correlationId: string;

  readonly tenantId: string;

  readonly clinicId: string;

  readonly userId: string;

  readonly channel: string;

  readonly action: string;

  readonly success: boolean;

  readonly metadata: Record<string, unknown>;
}

export interface AuditLogger {
  write(
    record: AuditRecord,
  ): Promise<void>;
}

export class AuditBehavior
  implements PipelineBehavior
{
  constructor(
    private readonly auditLogger: AuditLogger,
  ) {}

  async afterExecute(
    context: ApplicationContext,
    request: unknown,
    result: ApplicationResult<unknown>,
  ): Promise<void> {
    await this.auditLogger.write({
      timestamp: new Date(),

      requestId: context.request.requestId,

      correlationId: context.request.correlationId,

      tenantId: context.tenant.tenantId,

      clinicId: context.tenant.clinicId,

      userId: context.user.id,

      channel: context.request.channel,

      action: request?.constructor?.name ?? "UnknownRequest",

      success: result.success,

      metadata: {
        warnings: result.warnings,
      },
    });
  }
}