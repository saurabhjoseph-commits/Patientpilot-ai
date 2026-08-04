/**
 * ============================================================
 * PatientPilot AI
 * Sign In Use Case
 * ============================================================
 *
 * Authenticates a user using the Identity Domain.
 *
 * Responsibilities
 * - Load user
 * - Load credentials
 * - Verify password
 * - Load roles
 * - Create session
 * - Generate tokens
 * - Publish authentication event
 *
 * No HTTP
 * No Next.js
 * No Supabase
 */

import type { IUserRepository } from "@/lib/application/interfaces/IUserRepository";
import type { IUserCredentialRepository } from "@/lib/application/interfaces/IUserCredentialRepository";
import type { IUserSessionRepository } from "@/lib/application/interfaces/IUserSessionRepository";
import type { IRoleAssignmentRepository } from "@/lib/application/interfaces/IRoleAssignmentRepository";
import type { IRoleRepository } from "@/lib/application/interfaces/IRoleRepository";
import type { IPasswordHasher } from "@/lib/application/interfaces/IPasswordHasher";
import type { ITokenProvider } from "@/lib/application/interfaces/ITokenProvider";

import {
  AuthorizationService,
  UserAuthenticated,
} from "@/lib/platform/domain/identity";

import type { SignInRequest } from "./SignInRequest";
import type { SignInResponse } from "./SignInResponse";

export class SignInUseCase {
  constructor(
    private readonly users: IUserRepository,
    private readonly credentials: IUserCredentialRepository,
    private readonly sessions: IUserSessionRepository,
    private readonly roleAssignments: IRoleAssignmentRepository,
    private readonly roles: IRoleRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenProvider,
    private readonly authorization: AuthorizationService,
  ) {}

  async execute(
    request: SignInRequest,
  ): Promise<SignInResponse> {
    const user =
      await this.users.findByEmail(
        request.email,
      );

    if (!user) {
      throw new Error(
        "Invalid email or password.",
      );
    }

    if (!user.isActive()) {
      throw new Error(
        "User account is inactive.",
      );
    }

    const credential =
      await this.credentials.findByUserId(
        user.id,
      );

    if (
      !credential ||
      !credential.passwordHash
    ) {
      throw new Error(
        "Invalid email or password.",
      );
    }

    if (credential.isLocked()) {
      throw new Error(
        "User account is locked.",
      );
    }

    const passwordValid =
      await this.passwordHasher.verify(
        request.password,
        credential.passwordHash.value,
      );

    if (!passwordValid) {
      credential.recordFailedLogin();

      await this.credentials.update(
        credential,
      );

      throw new Error(
        "Invalid email or password.",
      );
    }

    credential.resetFailedLoginAttempts();

    await this.credentials.update(
      credential,
    );

    const assignments =
      await this.roleAssignments.findByUser(
        user.id,
      );

    const roles =
      await this.roles.findByUser(
        user.id,
      );

    const roleCodes =
      this.authorization
        .getRoles(
          assignments,
          roles,
        )
        .map(
          (role) =>
            role.code.value,
        );

    user.recordSuccessfulLogin();

    await this.users.updateLogin(
      user,
    );

    const tokens =
      await this.tokenProvider.generate({
        userId: user.id,
        clinicId: user.clinicId,
        email: user.email.value,
        roleCodes,
        issuedAt: new Date(),
        expiresAt: new Date(
          Date.now() + 15 * 60 * 1000,
        ),
      });

    const session =
      await this.sessions.create({
        user,
        refreshTokenId: tokens.refreshTokenId,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
      });

    UserAuthenticated.create({
      eventId: crypto.randomUUID(),
      eventName:
        "identity.user-authenticated",
      occurredAt: new Date(),
      tenantId: user.tenantId,
      clinicId: user.clinicId,
      userId: user.id,
      sessionId: session.id.value,
      provider:
        credential.authenticationProvider,
      ipAddress:
        request.ipAddress,
      userAgent:
        request.userAgent,
    });

    return {
      accessToken:
        tokens.accessToken,

      refreshToken:
        tokens.refreshToken,

      sessionId:
        session.id.value,

      expiresAt:
        tokens.expiresAt,

      user: {
        id: user.id,
        tenantId:
          user.tenantId,
        clinicId:
          user.clinicId,
        fullName:
          user.fullName,
        email:
          user.email.value,
        roleCodes,
      },
    };
  }
}
