/**
 * Core repository contracts.
 *
 * Every persistence implementation (Supabase, PostgreSQL, mock, etc.)
 * should implement these interfaces.
 */

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repository<
  TEntity extends BaseEntity,
  TCreate,
  TUpdate,
> {
  findById(id: string): Promise<TEntity | null>;

  findAll(
    options?: PaginationOptions
  ): Promise<PaginatedResult<TEntity>>;

  create(data: TCreate): Promise<TEntity>;

  update(
    id: string,
    data: TUpdate
  ): Promise<TEntity>;

  delete(id: string): Promise<void>;
}