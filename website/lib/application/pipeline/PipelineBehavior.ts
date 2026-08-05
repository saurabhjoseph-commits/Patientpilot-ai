/**
 * ============================================================
 * PatientPilot AI
 * Pipeline Behavior
 * ============================================================
 *
 * Defines a middleware component that participates in the
 * Application Pipeline execution.
 *
 * Behaviors provide reusable cross-cutting concerns such as:
 *
 * • Validation
 * • Authorization
 * • Logging
 * • Metrics
 * • Tracing
 * • Transactions
 * • Feature Flags
 * • Audit Logging
 * • Event Publishing
 */

import type { ApplicationContext } from "../common/ApplicationContext";
import type { ApplicationResult } from "../common/ApplicationResult";

export interface PipelineBehavior<
  TRequest = unknown,
  TResult = unknown,
> {
  /**
   * Executed before the use case.
   */
  beforeExecute?(
    context: ApplicationContext,
    request: TRequest,
  ): Promise<void>;

  /**
   * Executed after the use case succeeds.
   */
  afterExecute?(
    context: ApplicationContext,
    request: TRequest,
    result: ApplicationResult<TResult>,
  ): Promise<void>;

  /**
   * Executed when the use case throws an exception.
   */
  onError?(
    context: ApplicationContext,
    request: TRequest,
    error: unknown,
  ): Promise<void>;

  /**
   * Executed regardless of success or failure.
   */
  finally?(
    context: ApplicationContext,
    request: TRequest,
  ): Promise<void>;
}