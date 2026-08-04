/**
 * PatientPilot AI
 * Infrastructure Layer
 * Unit of Work
 *
 * Coordinates transactional work across repositories.
 */

export interface UnitOfWork {
  /**
   * Executes work inside a transaction.
   */
  execute<T>(
    work: () => Promise<T>,
  ): Promise<T>;
}

/**
 * Default Unit of Work.
 *
 * Currently executes the work directly. Future implementations
 * can integrate with Supabase/PostgreSQL transactions.
 */
export class DefaultUnitOfWork
  implements UnitOfWork
{
  async execute<T>(
    work: () => Promise<T>,
  ): Promise<T> {
    return await work();
  }
}

/**
 * Creates a Unit of Work.
 */
export function createUnitOfWork(): UnitOfWork {
  return new DefaultUnitOfWork();
}

/**
 * Shared Unit of Work instance.
 */
export const unitOfWork =
  createUnitOfWork();

export default unitOfWork;