/**
 * ============================================================
 * PatientPilot AI
 * Base Use Case
 * ============================================================
 *
 * Every Application Layer use case implements this interface.
 */

import type { ApplicationContext } from "./ApplicationContext";
import type { ApplicationResult } from "./ApplicationResult";

/**
 * Generic application use case.
 *
 * TRequest  - Input DTO
 * TResponse - Output DTO
 */
export interface UseCase<TRequest, TResponse> {
  execute(
    context: ApplicationContext,
    request: TRequest,
  ): Promise<ApplicationResult<TResponse>>;
}

/**
 * Base abstract implementation.
 *
 * Optional convenience class for shared behaviour.
 */
export abstract class BaseUseCase<TRequest, TResponse>
  implements UseCase<TRequest, TResponse>
{
  abstract execute(
    context: ApplicationContext,
    request: TRequest,
  ): Promise<ApplicationResult<TResponse>>;
}