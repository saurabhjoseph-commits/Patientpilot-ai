/**
 * ============================================================
 * PatientPilot AI
 * JWT Token Provider
 * ============================================================
 *
 * Infrastructure implementation of ITokenProvider.
 */

import jwt from "jsonwebtoken";

import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  ITokenProvider,
  TokenPair,
} from "@/lib/application/interfaces/ITokenProvider";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "30d";

export class JwtTokenProvider
  implements ITokenProvider
{
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string,
  ) {
    if (!accessSecret) {
      throw new Error(
        "JWT access secret is required.",
      );
    }

    if (!refreshSecret) {
      throw new Error(
        "JWT refresh secret is required.",
      );
    }
  }

  async generate(
    payload: AccessTokenPayload,
  ): Promise<TokenPair> {
    const accessToken = jwt.sign(
      payload,
      this.accessSecret,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      },
    );

    const refreshTokenId = crypto.randomUUID();
    const refreshPayload: RefreshTokenPayload = {
      userId: payload.userId,
      clinicId: payload.clinicId,
      tokenId: refreshTokenId,
      issuedAt: payload.issuedAt,
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ),
    };

    const refreshToken = jwt.sign(
      refreshPayload,
      this.refreshSecret,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      },
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenId,
      expiresAt: payload.expiresAt,
    };
  }

  async validateAccessToken(
    token: string,
  ): Promise<AccessTokenPayload> {
    return jwt.verify(
      token,
      this.accessSecret,
    ) as AccessTokenPayload;
  }

  async validateRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    return jwt.verify(
      token,
      this.refreshSecret,
    ) as RefreshTokenPayload;
  }

  async refresh(
    refreshToken: string,
  ): Promise<TokenPair> {
    const refreshPayload =
      await this.validateRefreshToken(
        refreshToken,
      );

    const now = new Date();

    return this.generate({
      userId: refreshPayload.userId,
      clinicId: refreshPayload.clinicId,
      email: "",
      roleCodes: [],
      issuedAt: now,
      expiresAt: new Date(
        now.getTime() + 15 * 60 * 1000,
      ),
    });
  }
}
