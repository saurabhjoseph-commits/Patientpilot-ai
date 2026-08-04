/**
 * PatientPilot AI
 * Infrastructure Layer
 * Base Repository
 *
 * Shared repository abstractions used by all repositories.
 */

export interface Entity {
  readonly id: string;
}

export interface FindOptions {
  readonly limit?: number;
  readonly offset?: number;
}

export interface Repository<
  TEntity extends Entity,
  TCreate,
  TUpdate,
> {
  create(
    entity: TCreate,
  ): Promise<TEntity>;

  update(
    id: string,
    entity: TUpdate,
  ): Promise<TEntity>;

  findById(
    id: string,
  ): Promise<TEntity | null>;

  findAll(
    options?: FindOptions,
  ): Promise<readonly TEntity[]>;

  delete(
    id: string,
  ): Promise<boolean>;
}

/**
 * Base implementation for repositories.
 *
 * Concrete repositories should extend this class and
 * implement the persistence methods.
 */
export abstract class BaseRepository<
  TEntity extends Entity,
  TCreate,
  TUpdate,
> implements Repository<
    TEntity,
    TCreate,
    TUpdate
  >
{
  abstract create(
    entity: TCreate,
  ): Promise<TEntity>;

  abstract update(
    id: string,
    entity: TUpdate,
  ): Promise<TEntity>;

  abstract findById(
    id: string,
  ): Promise<TEntity | null>;

  abstract findAll(
    options?: FindOptions,
  ): Promise<readonly TEntity[]>;

  abstract delete(
    id: string,
  ): Promise<boolean>;
}