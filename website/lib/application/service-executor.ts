/**
 * PatientPilot AI
 * Application Layer
 * Service Executor
 *
 * Executes application services with standardized
 * error handling.
 */

import {
  ServiceResult,
  success,
  unexpectedError,
} from "./service-result";

export interface ServiceExecutor {
  execute<TResult>(
    action: () => Promise<TResult>,
  ): Promise<ServiceResult<TResult>>;
}

export class DefaultServiceExecutor
  implements ServiceExecutor
{
  async execute<TResult>(
    action: () => Promise<TResult>,
  ): Promise<ServiceResult<TResult>> {
    try {
      const result = await action();

      return success(result);
    } catch (error) {
      return unexpectedError<TResult>(error);
    }
  }
}

/**
 * Creates a Service Executor.
 */
export function createServiceExecutor(): ServiceExecutor {
  return new DefaultServiceExecutor();
}

/**
 * Shared Service Executor.
 */
export const serviceExecutor =
  createServiceExecutor();

export default serviceExecutor;