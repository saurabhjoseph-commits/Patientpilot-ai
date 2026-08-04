/**
 * ============================================================
 * PatientPilot AI
 * Pagination
 * ============================================================
 *
 * Standard pagination models used by all application queries.
 */

export type SortDirection = "asc" | "desc";

export interface Sort {
  field: string;

  direction: SortDirection;
}

export interface PageRequest {
  page: number;

  pageSize: number;

  sort?: Sort;

  search?: string;

  filters?: Record<string, unknown>;
}

export interface Page<T> {
  items: T[];

  page: number;

  pageSize: number;

  totalItems: number;

  totalPages: number;

  hasPrevious: boolean;

  hasNext: boolean;
}

/**
 * Helper for creating paginated results.
 */
export class Pagination {
  static create<T>(
    items: T[],
    page: number,
    pageSize: number,
    totalItems: number,
  ): Page<T> {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    );

    return {
      items,
      page,
      pageSize,
      totalItems,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    };
  }
}