import type { IUserRepository } from "@/lib/application/interfaces/IUserRepository";
import type { IUserSessionRepository } from "@/lib/application/interfaces/IUserSessionRepository";
import type { ITokenProvider, TokenPair } from "@/lib/application/interfaces/ITokenProvider";

export class RefreshTokenUseCase {
  constructor(private readonly users: IUserRepository, private readonly sessions: IUserSessionRepository, private readonly tokens: ITokenProvider) {}

  async execute(refreshToken: string): Promise<TokenPair> {
    const payload = await this.tokens.validateRefreshToken(refreshToken);
    const session = await this.sessions.findByRefreshTokenId(payload.tokenId);
    if (!session || session.userId !== payload.userId || !session.isActive()) {
      throw new Error("Invalid refresh token.");
    }
    const user = await this.users.findById(payload.userId);
    if (!user || !user.isActive()) throw new Error("Invalid refresh token.");
    await this.sessions.revoke(session.id);
    const tokens = await this.tokens.generate({ userId: user.id, clinicId: user.clinicId, email: user.email.value, roleCodes: [], issuedAt: new Date(), expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
    await this.sessions.create({ user, refreshTokenId: tokens.refreshTokenId });
    return tokens;
  }
}
