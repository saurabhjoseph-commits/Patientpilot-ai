/**
 * ============================================================
 * PatientPilot AI
 * Supabase User Credential Repository
 * ============================================================
 *
 * Infrastructure implementation of IUserCredentialRepository.
 *
 * Responsibilities
 * - Persistence only
 * - No business logic
 * - Maps database rows to Identity entities
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateUserCredentialData,
  IUserCredentialRepository,
} from "@/lib/application/interfaces/IUserCredentialRepository";

import type {
  UserCredential,
  UserId,
} from "@/lib/platform/domain/identity";

import { IdentityCredentialMapper } from "../mappers/IdentityCredentialMapper";

export class UserCredentialRepository
  implements IUserCredentialRepository
{
  constructor(
    private readonly db: SupabaseClient,
  ) {}

  async findByUserId(
    userId: UserId,
  ): Promise<UserCredential | null> {
    const { data, error } =
      await this.db
        .from("user_credentials")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return IdentityCredentialMapper.toDomain(
      data,
    );
  }

  async create(
    data: CreateUserCredentialData,
  ): Promise<UserCredential> {
    const { data: created, error } =
      await this.db
        .from("user_credentials")
        .insert({
          user_id: data.userId,
          auth_provider:
            data.authenticationProvider,
          password_hash:
            data.passwordHash ?? null,
          failed_login_attempts: 0,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityCredentialMapper.toDomain(
      created,
    );
  }

  async update(
    credential: UserCredential,
  ): Promise<UserCredential> {
    const persistence =
      IdentityCredentialMapper.toPersistence(
        credential,
      );

    const { data, error } =
      await this.db
        .from("user_credentials")
        .update(persistence)
        .eq("id", credential.id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityCredentialMapper.toDomain(
      data,
    );
  }

  async delete(
    userId: UserId,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("user_credentials")
        .delete()
        .eq("user_id", userId);

    if (error) {
      throw error;
    }
  }
}