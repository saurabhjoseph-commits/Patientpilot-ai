/**
 * ============================================================
 * PatientPilot AI
 * Authenticate User Use Case
 * ============================================================
 */

import type { IUserRepository } from "@/lib/application/interfaces/IUserRepository";
import type { IPasswordHasher } from "@/lib/application/interfaces/IPasswordHasher";
import type { ITokenProvider } from "@/lib/application/interfaces/ITokenProvider";

import type { AuthenticateUserRequest } from "./AuthenticateUserRequest";
import type { AuthenticateUserResponse } from "./AuthenticateUserResponse";

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenProvider,
  ) {}

  async execute(
    request: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(
      request.email,
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    if (!user.isActive()) {
      throw new Error("User account is inactive.");
    }

    /**
     * ----------------------------------------------------------
     * TEMPORARY
     * ----------------------------------------------------------
     *
     * Authentication is currently being migrated to the new
     * Identity Domain (UserCredential + UserSession).
     *
     * Password verification will move there.
     */
    const passwordValid =
      await this.passwordHasher.verify(
        request.password,
        "", // TODO: Replace with UserCredential.passwordHash
      );

    if (!passwordValid) {
      throw new Error("Invalid email or password.");
    }

    const issuedAt = new Date();

    const expiresAt = new Date(
      issuedAt.getTime() + 15 * 60 * 1000,
    );

    const tokens =
      await this.tokenProvider.generate({
        userId: user.id,
        clinicId: user.clinicId,
        email: user.email.value,
        roleCodes: [],
        issuedAt,
        expiresAt,
      });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      user: {
        id: user.id,
        clinicId: user.clinicId,
        email: user.email.value,
        fullName: user.fullName,
        roleCodes: [],
      },
    };
  }
}