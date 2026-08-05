/**
 * ============================================================
 * PatientPilot AI
 * Logging Behavior
 * ============================================================
 *
 * Pipeline behavior responsible for logging application
 * use case execution.
 */

import type { ApplicationContext } from "../common/ApplicationContext";
import type { ApplicationResult } from "../common/ApplicationResult";
import type { PipelineBehavior } from "./PipelineBehavior";

export interface ApplicationLogger {
  debug(
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<void>;

  info(
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<void>;

  warn(
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<void>;

  error(
    message: string,
    metadata?: Record<string, unknown>,
  ): Promise<void>;
}

export class LoggingBehavior
  implements PipelineBehavior
{
  constructor(
    private readonly logger: ApplicationLogger,
  ) {}

  async beforeExecute(
    context: ApplicationContext,
    request: unknown,
  ): Promise<void> {
    await this.logger.info(
      "Application use case started.",
      {
        requestId: context.request.requestId,
        correlationId: context.request.correlationId,
        clinicId: context.tenant.clinicId,
        userId: context.user.id,
        channel: context.request.channel,
        request,
      },
    );
  }

  async afterExecute(
    context: ApplicationContext,
    request: unknown,
    result: ApplicationResult<unknown>,
  ): Promise<void> {
    await this.logger.info(
      "Application use case completed.",
      {
        requestId: context.request.requestId,
        correlationId: context.request.correlationId,
        clinicId: context.tenant.clinicId,
        userId: context.user.id,
        success: result.success,
        request,
      },
    );
  }

  async onError(
    context: ApplicationContext,
    request: unknown,
    error: unknown,
  ): Promise<void> {
    await this.logger.error(
      "Application use case failed.",
      {
        requestId: context.request.requestId,
        correlationId: context.request.correlationId,
        clinicId: context.tenant.clinicId,
        userId: context.user.id,
        request,
        error,
      },
    );
  }

  async finally(
    context: ApplicationContext,
  ): Promise<void> {
    await this.logger.debug(
      "Application pipeline finished.",
      {
        requestId: context.request.requestId,
      },
    );
  }
}