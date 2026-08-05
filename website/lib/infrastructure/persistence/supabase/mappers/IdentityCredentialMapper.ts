/**
 * ============================================================
 * PatientPilot AI
 * Identity Credential Mapper
 * ============================================================
 *
 * Maps persistence models to the Identity UserCredential
 * entity and vice versa.
 *
 * Responsibilities
 * - Database → Domain
 * - Domain → Persistence
 *
 * Contains no business logic.
 */

import {
  AuthenticationProvider,
  UserCredential,
} from "@/lib/platform/domain/identity";
import { PasswordHash } from "@/lib/platform/domain/identity/value-objects/password-hash";

interface SupabaseCredentialRow {
  id: string;

  user_id: string;

  auth_provider: string;

  password_hash: string | null;

  failed_login_attempts: number;

  locked_until: string | null;

  password_changed_at: string | null;

  created_at: string;

  updated_at: string;
}

export class IdentityCredentialMapper {
  /**
   * Maps a database row to the Identity UserCredential.
   */
  static toDomain(
    row: SupabaseCredentialRow,
  ): UserCredential {
    return new UserCredential({
      id: row.id,

      userId: row.user_id,

      authenticationProvider:
        row.auth_provider as AuthenticationProvider,

      passwordHash:
        row.password_hash
          ? PasswordHash.create(
              row.password_hash,
            )
          : undefined,

      failedLoginAttempts:
        row.failed_login_attempts,

      lockedUntil:
        row.locked_until
          ? new Date(row.locked_until)
          : undefined,

      passwordChangedAt:
        row.password_changed_at
          ? new Date(
              row.password_changed_at,
            )
          : undefined,

      createdAt: new Date(
        row.created_at,
      ),

      updatedAt: new Date(
        row.updated_at,
      ),
    });
  }

  /**
   * Maps the Identity UserCredential
   * back to persistence.
   */
  static toPersistence(
    credential: UserCredential,
  ) {
    return {
      id: credential.id,

      user_id: credential.userId,

      auth_provider:
        credential.authenticationProvider,

      password_hash:
        credential.passwordHash?.value ??
        null,

      failed_login_attempts:
        credential.failedLoginAttempts,

      locked_until:
        credential.lockedUntil?.toISOString() ??
        null,

      password_changed_at:
        credential.passwordChangedAt?.toISOString() ??
        null,

      created_at:
        credential.createdAt.toISOString(),

      updated_at:
        credential.updatedAt.toISOString(),
    };
  }
}
