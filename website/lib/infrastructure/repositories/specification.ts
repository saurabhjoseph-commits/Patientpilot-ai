/**
 * PatientPilot AI
 * Infrastructure Layer
 * Repository Specification
 *
 * Generic query specification used by repositories.
 */

export type SortDirection =
  | "asc"
  | "desc";

export interface Sort {
  readonly field: string;
  readonly direction: SortDirection;
}

export interface Filter {
  readonly field: string;
  readonly operator:
    | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "in";
  readonly value: unknown;
}

export interface PageRequest {
  readonly page: number;
  readonly pageSize: number;
}

export interface PageResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface Specification {
  readonly filters?: readonly Filter[];
  readonly sort?: readonly Sort[];
  readonly page?: PageRequest;
}

/**
 * Empty specification.
 */
export const EmptySpecification: Specification =
  Object.freeze({});