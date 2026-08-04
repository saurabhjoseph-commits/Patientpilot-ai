/**
 * ============================================================
 * PatientPilot AI
 * Identity User Mapper
 * ============================================================
 *
 * Maps Supabase persistence models to the Identity Domain.
 *
 * Responsibilities
 * - Database → Domain
 * - Domain → Persistence
 *
 * No business logic belongs here.
 */

import {
  AuthenticationProvider,
  EmailAddress,
  User,
  UserStatus,
} from "@/lib/platform/domain/identity";

interface SupabaseUserRow {
  id: string;

  tenant_id: string;

  clinic_id: string;

  full_name: string;

  email: string;

  status: string;

  auth_provider: string;

  email_verified: boolean;

  last_login_at: string | null;

  created_at: string;

  updated_at: string;
}

export class IdentityUserMapper {
  /**
   * Maps a database row to the Identity User entity.
   */
  static toDomain(
    row: SupabaseUserRow,
  ): User {
    return new User({
      id: row.id,
      tenantId: row.tenant_id,
      clinicId: row.clinic_id,

      fullName: row.full_name,

      email: EmailAddress.create(
        row.email,
      ),

      status:
        row.status as UserStatus,

      authenticationProvider:
        row.auth_provider as AuthenticationProvider,

      emailVerified:
        row.email_verified,

      lastLoginAt:
        row.last_login_at
          ? new Date(row.last_login_at)
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
   * Maps the Identity User entity
   * back into a persistence object.
   */
  static toPersistence(
    user: User,
  ) {
    return {
      id: user.id,

      tenant_id: user.tenantId,

      clinic_id: user.clinicId,

      full_name: user.fullName,

      email: user.email.value,

      status: user.status,

      auth_provider:
        user.authenticationProvider,

      email_verified:
        user.emailVerified,

      last_login_at:
        user.lastLoginAt?.toISOString() ??
        null,

      created_at:
        user.createdAt.toISOString(),

      updated_at:
        user.updatedAt.toISOString(),
    };
  }
}