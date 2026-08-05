import type { IUserSessionRepository } from "@/lib/application/interfaces/IUserSessionRepository";
import type { ITokenProvider } from "@/lib/application/interfaces/ITokenProvider";
import { SessionId } from "@/lib/platform/domain/identity";

export class SignOutUseCase {
  constructor(
    private readonly sessions: IUserSessionRepository,
    private readonly tokens: ITokenProvider,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const payload = await this.tokens.validateRefreshToken(refreshToken);
    const session = await this.sessions.findByRefreshTokenId(payload.tokenId);
    if (session && session.userId === payload.userId) {
      await this.sessions.revoke(SessionId.create(session.id.value));
    }
  }
}
