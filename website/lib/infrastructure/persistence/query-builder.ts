/**
 * PatientPilot AI
 * Infrastructure Layer
 * Query Builder
 *
 * Lightweight query builder for repository filtering.
 */

export type SortDirection =
  | "asc"
  | "desc";

export interface Filter {
  readonly field: string;
  readonly operator:
    | "="
    | "!="
    | ">"
    | ">="
    | "<"
    | "<="
    | "like"
    | "in";
  readonly value: unknown;
}

export interface Sort {
  readonly field: string;
  readonly direction: SortDirection;
}

export interface QueryOptions {
  readonly filters: readonly Filter[];
  readonly sort?: Sort;
  readonly limit?: number;
  readonly offset?: number;
}

export class QueryBuilder {
  private readonly filters: Filter[] = [];

  private sort?: Sort;

  private limitValue?: number;

  private offsetValue?: number;

  where(
    field: string,
    operator: Filter["operator"],
    value: unknown,
  ): this {
    this.filters.push({
      field,
      operator,
      value,
    });

    return this;
  }

  orderBy(
    field: string,
    direction: SortDirection = "asc",
  ): this {
    this.sort = {
      field,
      direction,
    };

    return this;
  }

  limit(
    value: number,
  ): this {
    this.limitValue = value;

    return this;
  }

  offset(
    value: number,
  ): this {
    this.offsetValue = value;

    return this;
  }

  build(): QueryOptions {
    return {
      filters: [...this.filters],
      sort: this.sort,
      limit: this.limitValue,
      offset: this.offsetValue,
    };
  }

  reset(): this {
    this.filters.length = 0;
    this.sort = undefined;
    this.limitValue = undefined;
    this.offsetValue = undefined;

    return this;
  }
}

/**
 * Creates a new query builder.
 */
export function createQueryBuilder(): QueryBuilder {
  return new QueryBuilder();
}