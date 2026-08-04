/**
 * PatientPilot AI
 * Application Runtime
 *
 * Central runtime dependencies used by application services.
 */

import {
  serviceContext,
  ServiceContext,
} from "./service-context";

import {
  serviceExecutor,
  ServiceExecutor,
} from "./service-executor";

import {
  createServicePipeline,
  DefaultServicePipeline,
} from "./service-pipeline";

export interface ApplicationRuntime {
  readonly context: ServiceContext;
  readonly executor: ServiceExecutor;

  createPipeline<TRequest, TResult>(): DefaultServicePipeline<
    TRequest,
    TResult
  >;
}

export class DefaultApplicationRuntime
  implements ApplicationRuntime
{
  readonly context = serviceContext;

  readonly executor = serviceExecutor;

  createPipeline<
    TRequest,
    TResult,
  >(): DefaultServicePipeline<
    TRequest,
    TResult
  > {
    return createServicePipeline<
      TRequest,
      TResult
    >();
  }
}

/**
 * Creates the shared Application Runtime.
 */
export function createApplicationRuntime(): ApplicationRuntime {
  return new DefaultApplicationRuntime();
}

/**
 * Shared runtime instance.
 */
export const applicationRuntime =
  createApplicationRuntime();

export default applicationRuntime;