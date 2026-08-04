/**
 * ============================================================
 * PatientPilot AI
 * Token Provider
 * ============================================================
 *
 * Application Layer contract for issuing and validating
 * authentication tokens.
 *
 * Implemented by the Infrastructure Layer.
 *
 * Possible implementations:
 * - JWT
 * - Supabase Auth
 * - Auth0
 * - Azure AD B2C
 * - Amazon Cognito
 */

export interface AccessTokenPayload {
  userId: string;

  clinicId: string;

  email: string;

  roleCodes: readonly string[];

  issuedAt: Date;

  expiresAt: Date;
}

export interface RefreshTokenPayload {
  userId: string;

  clinicId: string;

  tokenId: string;

  issuedAt: Date;

  expiresAt: Date;
}

export interface TokenPair {
  accessToken: string;

  refreshToken: string;

  refreshTokenId: string;

  expiresAt: Date;
}

export interface ITokenProvider {
  /**
   * Creates a new access/refresh token pair.
   */
  generate(
    payload: AccessTokenPayload,
  ): Promise<TokenPair>;

  /**
   * Validates an access token.
   */
  validateAccessToken(
    token: string,
  ): Promise<AccessTokenPayload>;

  /**
   * Validates a refresh token.
   */
  validateRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload>;

  /**
   * Generates a new access token using
   * a valid refresh token.
   */
  refresh(
    refreshToken: string,
  ): Promise<TokenPair>;
}
