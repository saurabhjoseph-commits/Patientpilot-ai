/**
 * ============================================================
 * PatientPilot AI
 * User Credential Repository
 * ============================================================
 *
 * Application Layer contract for authentication credentials.
 *
 * Implemented by the Infrastructure Layer
 * (Supabase, PostgreSQL, Azure AD B2C, Auth0, etc.).
 */

import type {
  UserCredential,
  UserId,
} from "@/lib/platform/domain/identity";

export interface CreateUserCredentialData {
  userId: UserId;

  authenticationProvider: string;

  passwordHash?: string;
}

export interface IUserCredentialRepository {
  /**
   * Returns credentials for a user.
   */
  findByUserId(
    userId: UserId,
  ): Promise<UserCredential | null>;

  /**
   * Creates credentials.
   */
  create(
    data: CreateUserCredentialData,
  ): Promise<UserCredential>;

  /**
   * Persists credential changes.
   */
  update(
    credential: UserCredential,
  ): Promise<UserCredential>;

  /**
   * Deletes credentials.
   */
  delete(
    userId: UserId,
  ): Promise<void>;
}