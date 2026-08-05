/**
 * ============================================================
 * PatientPilot AI
 * Supabase User Session Repository
 * ============================================================
 *
 * Infrastructure implementation of IUserSessionRepository.
 *
 * Responsibilities
 * - Session persistence
 * - Session lookup
 * - Session revocation
 * - Session cleanup
 *
 * Contains NO business logic.
 */

import crypto from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateUserSessionData,
  IUserSessionRepository,
} from "@/lib/application/interfaces/IUserSessionRepository";

import {
  UserSession,
} from "@/lib/platform/domain/identity";

import type {
  SessionId,
  UserId,
} from "@/lib/platform/domain/identity";

import { IdentityUserSessionMapper } from "../mappers/IdentityUserSessionMapper";

export class UserSessionRepository
  implements IUserSessionRepository
{
  constructor(
    private readonly db: SupabaseClient,
  ) {}

  async findById(
    sessionId: SessionId,
  ): Promise<UserSession | null> {
    const { data, error } = await this.db
      .from("user_sessions")
      .select("*")
      .eq("id", sessionId.value)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return IdentityUserSessionMapper.toDomain(data);
  }

  async findByRefreshTokenId(
    refreshTokenId: string,
  ): Promise<UserSession | null> {
    const { data, error } = await this.db
      .from("user_sessions")
      .select("*")
      .eq("refresh_token_id", refreshTokenId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return IdentityUserSessionMapper.toDomain(data);
  }

  async findActiveByUser(
    userId: UserId,
  ): Promise<UserSession[]> {
    const { data, error } = await this.db
      .from("user_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) {
      throw error;
    }

    return (data ?? []).map(
      IdentityUserSessionMapper.toDomain,
    );
  }

  async create(
    data: CreateUserSessionData,
  ): Promise<UserSession> {
    const now = new Date();

    const expiresAt = new Date(
      now.getTime() +
      1000 * 60 * 60 * 24 * 30,
    );

    const session = {
      id: crypto.randomUUID(),

      user_id: data.user.id,

      refresh_token_id:
        data.refreshTokenId,

      status: "active",

      ip_address:
        data.ipAddress ?? null,

      user_agent:
        data.userAgent ?? null,

      device_name:
        data.deviceName ?? null,

      created_at:
        now.toISOString(),

      last_activity_at:
        now.toISOString(),

      expires_at:
        expiresAt.toISOString(),

      revoked_at: null,
    };

    const { data: created, error } =
      await this.db
        .from("user_sessions")
        .insert(session)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityUserSessionMapper.toDomain(created);
  }

  async update(
    session: UserSession,
  ): Promise<UserSession> {
    const persistence =
      IdentityUserSessionMapper.toPersistence(session);

    const { data, error } =
      await this.db
        .from("user_sessions")
        .update(persistence)
        .eq("id", session.id.value)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return IdentityUserSessionMapper.toDomain(data);
  }

  async revoke(
    sessionId: SessionId,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("user_sessions")
        .update({
          status: "revoked",
          revoked_at:
            new Date().toISOString(),
        })
        .eq("id", sessionId.value);

    if (error) {
      throw error;
    }
  }

  async revokeAllForUser(
    userId: UserId,
  ): Promise<void> {
    const { error } =
      await this.db
        .from("user_sessions")
        .update({
          status: "revoked",
          revoked_at:
            new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("status", "active");

    if (error) {
      throw error;
    }
  }

  async deleteExpired(): Promise<number> {
    const now = new Date().toISOString();

    const { data, error } =
      await this.db
        .from("user_sessions")
        .delete()
        .lt("expires_at", now)
        .select("id");

    if (error) {
      throw error;
    }

    return data?.length ?? 0;
  }

}
