/**
 * ============================================================
 * PatientPilot AI
 * Application Pipeline
 * ============================================================
 *
 * Executes Application Layer use cases while providing
 * common cross-cutting behaviour.
 */

import type { ApplicationContext } from "../common/ApplicationContext";
import type { ApplicationResult } from "../common/ApplicationResult";
import type { UseCase } from "../common/UseCase";

export interface PipelineBehavior {
  beforeExecute?(
    context: ApplicationContext,
    request: unknown,
  ): Promise<void>;

  afterExecute?(
    context: ApplicationContext,
    request: unknown,
    result: ApplicationResult<unknown>,
  ): Promise<void>;

  onError?(
    context: ApplicationContext,
    request: unknown,
    error: unknown,
  ): Promise<void>;
}

export class ApplicationPipeline {
  constructor(
    private readonly behaviors: readonly PipelineBehavior[] = [],
  ) {}

  async execute<TRequest, TResult>(
    useCase: UseCase<TRequest, TResult>,
    context: ApplicationContext,
    request: TRequest,
  ): Promise<ApplicationResult<TResult>> {
    try {
      for (const behavior of this.behaviors) {
        await behavior.beforeExecute?.(
          context,
          request,
        );
      }

      const result = await useCase.execute(
        context,
        request,
      );

      for (const behavior of this.behaviors) {
        await behavior.afterExecute?.(
          context,
          request,
          result as ApplicationResult<unknown>,
        );
      }

      return result;
    } catch (error) {
      for (const behavior of this.behaviors) {
        await behavior.onError?.(
          context,
          request,
          error,
        );
      }

      throw error;
    }
  }
}