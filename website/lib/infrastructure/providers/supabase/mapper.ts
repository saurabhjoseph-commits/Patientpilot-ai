/**
 * PatientPilot AI
 * Infrastructure Layer
 * Supabase Mapper
 *
 * Shared mapping utilities between domain/application
 * models and Supabase row objects.
 */

export type DatabaseRow = Readonly<Record<string, unknown>>;

/**
 * Generic mapper contract.
 */
export interface Mapper<TModel, TRow extends DatabaseRow> {
  toRow(model: TModel): TRow;

  fromRow(row: TRow): TModel;
}

/**
 * Base mapper implementation.
 *
 * Concrete repositories can extend this class
 * to implement strongly typed mapping logic.
 */
export abstract class BaseMapper<
  TModel,
  TRow extends DatabaseRow,
> implements Mapper<TModel, TRow>
{
  abstract toRow(
    model: TModel,
  ): TRow;

  abstract fromRow(
    row: TRow,
  ): TModel;

  /**
   * Maps multiple rows into models.
   */
  fromRows(
    rows: readonly TRow[],
  ): readonly TModel[] {
    return rows.map((row) =>
      this.fromRow(row),
    );
  }

  /**
   * Maps multiple models into rows.
   */
  toRows(
    models: readonly TModel[],
  ): readonly TRow[] {
    return models.map((model) =>
      this.toRow(model),
    );
  }
}

/**
 * Identity mapper for simple cases where
 * the database row already matches the model.
 */
export class IdentityMapper<
  T extends DatabaseRow,
> extends BaseMapper<T, T>
{
  toRow(model: T): T {
    return model;
  }

  fromRow(row: T): T {
    return row;
  }
}

/**
 * Shared identity mapper.
 */
export const identityMapper =
  new IdentityMapper<DatabaseRow>();