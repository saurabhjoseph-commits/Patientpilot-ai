/**
 * ============================================================
 * PatientPilot AI
 * Query
 * ============================================================
 *
 * Marker interfaces and base contracts for queries.
 *
 * Queries represent read-only requests that must not
 * modify application state.
 */

import type { ApplicationContext } from "./ApplicationContext";
import type { ApplicationResult } from "./ApplicationResult";
import type { UseCase } from "./UseCase";

/**
 * Marker interface for query requests.
 */
export interface Query {
  readonly type: string;
}

/**
 * Generic query handler.
 */
export interface QueryHandler<
  TQuery extends Query,
  TResult,
> extends UseCase<TQuery, TResult> {
  execute(
    context: ApplicationContext,
    query: TQuery,
  ): Promise<ApplicationResult<TResult>>;
}

/**
 * Base implementation for query handlers.
 */
export abstract class BaseQueryHandler<
  TQuery extends Query,
  TResult,
> implements QueryHandler<TQuery, TResult>
{
  abstract execute(
    context: ApplicationContext,
    query: TQuery,
  ): Promise<ApplicationResult<TResult>>;
}