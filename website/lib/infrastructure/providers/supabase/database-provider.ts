/**
 * PatientPilot AI
 * Infrastructure Layer
 * Supabase Database Provider
 *
 * Bridges the platform DatabaseProvider abstraction
 * with the Supabase client.
 */

import { PostgrestError } from "@supabase/supabase-js";

import {
  DatabaseConnection,
  DatabaseProvider,
  DatabaseTransaction,
} from "../../persistence/database";

import { getSupabaseClient } from "./client";

export class SupabaseTransaction
  implements DatabaseTransaction
{
  async commit(): Promise<void> {
    // Supabase JavaScript client does not currently
    // expose database transactions directly.
  }

  async rollback(): Promise<void> {
    // Reserved for future RPC-based transaction support.
  }
}

export class SupabaseConnection
  implements DatabaseConnection
{
  async query<T>(
    statement: string,
    parameters: readonly unknown[] = [],
  ): Promise<readonly T[]> {
    void parameters;

    throw new Error(
      [
        "Raw SQL queries are not supported by the",
        "Supabase JavaScript client.",
        `Statement: ${statement}`,
      ].join(" "),
    );
  }

  async execute(
    statement: string,
    parameters: readonly unknown[] = [],
  ): Promise<number> {
    void parameters;

    throw new Error(
      [
        "Raw SQL execution is not supported by the",
        "Supabase JavaScript client.",
        `Statement: ${statement}`,
      ].join(" "),
    );
  }

  async beginTransaction(): Promise<DatabaseTransaction> {
    return new SupabaseTransaction();
  }

  /**
   * Returns the underlying Supabase client.
   * Repository implementations should use this instead
   * of raw SQL.
   */
  get client() {
    return getSupabaseClient();
  }

  /**
   * Converts a Supabase error into a standard Error.
   */
  static toError(error: PostgrestError): Error {
    return new Error(
      `${error.code}: ${error.message}`,
    );
  }
}

export class SupabaseDatabaseProvider
  implements DatabaseProvider
{
  async connect(): Promise<DatabaseConnection> {
    return new SupabaseConnection();
  }
}

/**
 * Shared production database provider.
 */
export const supabaseDatabaseProvider =
  new SupabaseDatabaseProvider();

export default supabaseDatabaseProvider;