import {
  SessionId,
  SessionStatus,
  UserSession,
} from "@/lib/platform/domain/identity";

interface SupabaseUserSessionRow {
  id: string;
  user_id: string;
  refresh_token_id: string;
  status: string;
  ip_address: string | null;
  user_agent: string | null;
  device_name: string | null;
  created_at: string;
  last_activity_at: string;
  expires_at: string;
  revoked_at: string | null;
}

export class IdentityUserSessionMapper {
  static toDomain(
    row: SupabaseUserSessionRow,
  ): UserSession {
    return new UserSession({
      id: SessionId.create(row.id),
      userId: row.user_id,
      refreshTokenId: row.refresh_token_id,
      status: row.status as SessionStatus,
      ipAddress: row.ip_address ?? undefined,
      userAgent: row.user_agent ?? undefined,
      deviceName: row.device_name ?? undefined,
      createdAt: new Date(row.created_at),
      lastActivityAt: new Date(row.last_activity_at),
      expiresAt: new Date(row.expires_at),
      revokedAt: row.revoked_at
        ? new Date(row.revoked_at)
        : undefined,
    });
  }

  static toPersistence(session: UserSession) {
    return {
      status: session.status,
      last_activity_at: session.lastActivityAt.toISOString(),
      expires_at: session.expiresAt.toISOString(),
      revoked_at: session.revokedAt?.toISOString() ?? null,
    };
  }
}
