/**
 * ============================================================
 * PatientPilot AI
 * Unit of Work
 * ============================================================
 *
 * Coordinates multiple repository operations into a single
 * atomic transaction.
 *
 * Implemented by the Infrastructure Layer.
 */

export interface IUnitOfWork {
  /**
   * Executes the supplied work inside a transaction.
   *
   * If the work completes successfully, the transaction
   * is committed.
   *
   * If the work throws an error, the transaction
   * is rolled back.
   */
  execute<T>(
    work: () => Promise<T>,
  ): Promise<T>;
}