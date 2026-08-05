/**
 * ============================================================
 * PatientPilot AI
 * Supabase Unit of Work
 * ============================================================
 *
 * Infrastructure implementation of IUnitOfWork.
 *
 * Supabase JavaScript currently does not expose general-purpose
 * multi-statement transactions, so this implementation executes
 * the work directly. The abstraction allows future migration to
 * transactional infrastructure without changing the Application
 * Layer.
 */

import type { IUnitOfWork } from "@/lib/application/interfaces/IUnitOfWork";

export class UnitOfWork implements IUnitOfWork {
  /**
   * Executes work within a unit of work.
   */
  async execute<TResult>(
    work: () => Promise<TResult>,
  ): Promise<TResult> {
    try {
      return await work();
    } catch (error) {
      // Future enhancement:
      // rollback transaction when supported.
      throw error;
    }
  }
}