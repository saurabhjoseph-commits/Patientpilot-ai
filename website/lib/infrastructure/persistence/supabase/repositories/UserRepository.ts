/**
 * ============================================================
 * PatientPilot AI
 * Supabase User Repository
 * ============================================================
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { User } from "@/lib/platform/domain/identity";
import { IdentityUserMapper } from "@/lib/infrastructure/persistence/supabase/mappers/IdentityUserMapper";

import type {
  CreateUserData,
  IUserRepository,
  UpdateUserData,
} from "@/lib/application/interfaces/IUserRepository";

export class UserRepository
  implements IUserRepository
{
  constructor(
    private readonly db: SupabaseClient,
  ) {}

  async findById(
    userId: string,
  ): Promise<User | null> {
    const { data, error } = await this.db
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? IdentityUserMapper.toDomain(data)
      : null;
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    const { data, error } = await this.db
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? IdentityUserMapper.toDomain(data)
      : null;
  }

  async existsByEmail(
    email: string,
  ): Promise<boolean> {
    const { count, error } = await this.db
      .from("users")
      .select("id", {
        head: true,
        count: "exact",
      })
      .eq("email", email);

    if (error) {
      throw error;
    }

    return (count ?? 0) > 0;
  }

  async create(
    data: CreateUserData,
  ): Promise<User> {
    const { data: created, error } =
      await this.db
        .from("users")
        .insert({
          clinic_id: data.clinicId,
          full_name: data.fullName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          is_active: data.isActive ?? true,
          email_verified:
            data.emailVerified ?? false,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityUserMapper.toDomain(
      created,
    );
  }

  async update(
    userId: string,
    data: UpdateUserData,
  ): Promise<User> {
    const { data: updated, error } =
      await this.db
        .from("users")
        .update({
          full_name: data.fullName,
          phone: data.phone,
          is_active: data.isActive,
          email_verified:
            data.emailVerified,
        })
        .eq("id", userId)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityUserMapper.toDomain(
      updated,
    );
  }

  async updateLogin(
    user: User,
  ): Promise<User> {
    const persistence =
      IdentityUserMapper.toPersistence(
        user,
      );

    const { data, error } =
      await this.db
        .from("users")
        .update({
          last_login_at:
            persistence.last_login_at,
          updated_at:
            persistence.updated_at,
        })
        .eq("id", user.id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityUserMapper.toDomain(
      data,
    );
  }

  async activate(
    userId: string,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("users")
        .update({
          is_active: true,
        })
        .eq("id", userId);

    if (error) {
      throw error;
    }
  }

  async deactivate(
    userId: string,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("users")
        .update({
          is_active: false,
        })
        .eq("id", userId);

    if (error) {
      throw error;
    }
  }

  async delete(
    userId: string,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("users")
        .delete()
        .eq("id", userId);

    if (error) {
      throw error;
    }
  }
}