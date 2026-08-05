/**
 * ============================================================
 * PatientPilot AI
 * Supabase Client Factory
 * ============================================================
 *
 * Centralized factory for creating Supabase clients.
 *
 * Infrastructure services and repositories should obtain
 * clients exclusively through this factory.
 */

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

export class SupabaseClientFactory {
  private static anonymousClient: SupabaseClient | null =
    null;

  private static serviceRoleClient: SupabaseClient | null =
    null;

  /**
   * Creates (or returns) the anonymous client.
   */
  static getAnonymousClient(): SupabaseClient {
    if (!this.anonymousClient) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url) {
        throw new Error(
          "Missing NEXT_PUBLIC_SUPABASE_URL environment variable.",
        );
      }

      if (!key) {
        throw new Error(
          "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.",
        );
      }

      this.anonymousClient = createClient(
        url,
        key,
      );
    }

    return this.anonymousClient;
  }

  /**
   * Creates (or returns) the service-role client.
   *
   * Never expose this client to browser code.
   */
  static getServiceRoleClient(): SupabaseClient {
    if (!this.serviceRoleClient) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!url) {
        throw new Error(
          "Missing NEXT_PUBLIC_SUPABASE_URL environment variable.",
        );
      }

      if (!key) {
        throw new Error(
          "Missing SUPABASE_SERVICE_ROLE_KEY environment variable.",
        );
      }

      this.serviceRoleClient = createClient(
        url,
        key,
      );
    }

    return this.serviceRoleClient;
  }

  /**
   * Clears cached clients.
   *
   * Intended for automated testing.
   */
  static reset(): void {
    this.anonymousClient = null;
    this.serviceRoleClient = null;
  }
}