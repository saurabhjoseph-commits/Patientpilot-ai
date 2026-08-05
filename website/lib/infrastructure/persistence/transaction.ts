/**
 * PatientPilot AI
 * Infrastructure Layer
 * Transaction
 *
 * Shared transaction execution helper.
 */

import {
  DatabaseConnection,
  DatabaseProvider,
  DatabaseTransaction,
  database,
} from "./database";

export interface TransactionOptions {
  readonly provider?: DatabaseProvider;
}

export async function runInTransaction<T>(
  operation: (
    connection: DatabaseConnection,
  ) => Promise<T>,
  options: TransactionOptions = {},
): Promise<T> {
  const provider =
    options.provider ?? database;

  const connection =
    await provider.connect();

  const transaction =
    await connection.beginTransaction();

  try {
    const result =
      await operation(connection);

    await transaction.commit();

    return result;
  } catch (error) {
    await safeRollback(transaction);

    throw error;
  }
}

async function safeRollback(
  transaction: DatabaseTransaction,
): Promise<void> {
  try {
    await transaction.rollback();
  } catch {
    // Intentionally ignored.
    // The original error should always
    // be propagated.
  }
}

/**
 * Transaction executor.
 */
export class TransactionManager {
  constructor(
    private readonly provider: DatabaseProvider =
      database,
  ) {}

  execute<T>(
    operation: (
      connection: DatabaseConnection,
    ) => Promise<T>,
  ): Promise<T> {
    return runInTransaction(operation, {
      provider: this.provider,
    });
  }
}

/**
 * Shared transaction manager.
 */
export const transactionManager =
  new TransactionManager();

export default transactionManager;