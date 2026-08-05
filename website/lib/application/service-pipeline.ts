/**
 * PatientPilot AI
 * Application Layer
 * Service Pipeline
 *
 * Coordinates execution of application services through
 * validation, execution, and post-processing stages.
 */

import {
  serviceExecutor,
} from "./service-executor";

import type {
  ServiceResult,
} from "./service-result";

export interface PipelineStep<TRequest> {
  execute(
    request: TRequest,
  ): Promise<void>;
}

export interface ServicePipeline<
  TRequest,
  TResult,
> {
  execute(
    request: TRequest,
    action: () => Promise<TResult>,
  ): Promise<ServiceResult<TResult>>;
}

export class DefaultServicePipeline<
  TRequest,
  TResult,
> implements ServicePipeline<
    TRequest,
    TResult
  >
{
  private readonly beforeSteps:
    PipelineStep<TRequest>[] = [];

  private readonly afterSteps:
    PipelineStep<TRequest>[] = [];

  addBeforeStep(
    step: PipelineStep<TRequest>,
  ): this {
    this.beforeSteps.push(step);

    return this;
  }

  addAfterStep(
    step: PipelineStep<TRequest>,
  ): this {
    this.afterSteps.push(step);

    return this;
  }

  async execute(
    request: TRequest,
    action: () => Promise<TResult>,
  ): Promise<ServiceResult<TResult>> {
    for (const step of this.beforeSteps) {
      await step.execute(request);
    }

    const result =
      await serviceExecutor.execute(action);

    for (const step of this.afterSteps) {
      await step.execute(request);
    }

    return result;
  }
}

/**
 * Creates a Service Pipeline.
 */
export function createServicePipeline<
  TRequest,
  TResult,
>(): DefaultServicePipeline<
  TRequest,
  TResult
> {
  return new DefaultServicePipeline<
    TRequest,
    TResult
  >();
}

export default createServicePipeline;