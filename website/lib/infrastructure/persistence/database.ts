/**
 * PatientPilot AI
 * Infrastructure Layer
 * Database Abstractions
 *
 * Common database contracts shared by all repository
 * implementations.
 */

export interface DatabaseTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface DatabaseConnection {
  query<T>(
    statement: string,
    parameters?: readonly unknown[],
  ): Promise<readonly T[]>;

  execute(
    statement: string,
    parameters?: readonly unknown[],
  ): Promise<number>;

  beginTransaction(): Promise<DatabaseTransaction>;
}

export interface DatabaseProvider {
  connect(): Promise<DatabaseConnection>;
}

export class InMemoryDatabaseConnection
  implements DatabaseConnection
{
  async query<T>(): Promise<readonly T[]> {
    return [];
  }

  async execute(): Promise<number> {
    return 0;
  }

  async beginTransaction(): Promise<DatabaseTransaction> {
    return {
      async commit() {},
      async rollback() {},
    };
  }
}

export class InMemoryDatabaseProvider
  implements DatabaseProvider
{
  async connect(): Promise<DatabaseConnection> {
    return new InMemoryDatabaseConnection();
  }
}

/**
 * Shared database provider.
 *
 * Future milestones will replace this with a
 * Supabase-backed implementation without changing
 * any repository code.
 */
export const database =
  new InMemoryDatabaseProvider();

export default database;