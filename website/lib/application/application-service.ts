/**
 * PatientPilot AI
 * Application Layer
 * Base Application Service
 *
 * Common base class for all application services.
 */

import {
  applicationRuntime,
  ApplicationRuntime,
} from "./application-runtime";

import type {
  ServiceResult,
} from "./service-result";

export abstract class ApplicationService {
  protected readonly runtime: ApplicationRuntime;

  protected constructor(
    runtime: ApplicationRuntime = applicationRuntime,
  ) {
    this.runtime = runtime;
  }

  /**
   * Executes an action using the shared Service Executor.
   */
  protected execute<TResult>(
    action: () => Promise<TResult>,
  ): Promise<ServiceResult<TResult>> {
    return this.runtime.executor.execute(action);
  }

  /**
   * Creates a new service pipeline.
   */
  protected createPipeline<
    TRequest,
    TResult,
  >() {
    return this.runtime.createPipeline<
      TRequest,
      TResult
    >();
  }

  /**
   * Shortcut to the shared Service Context.
   */
  protected get context() {
    return this.runtime.context;
  }
}

export default ApplicationService;