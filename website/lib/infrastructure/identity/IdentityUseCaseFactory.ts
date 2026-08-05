import { SignInUseCase } from "@/lib/application/use-cases/identity/sign-in/SignInUseCase";
import { SignOutUseCase } from "@/lib/application/use-cases/identity/sign-out/SignOutUseCase";
import { RefreshTokenUseCase } from "@/lib/application/use-cases/identity/refresh-token/RefreshTokenUseCase";
import { IdentityAuthenticationService } from "./IdentityAuthenticationService";
import { AuthorizationService } from "@/lib/platform/domain/identity";
import { serviceRegistry } from "@/lib/infrastructure/dependency-injection/ServiceRegistry";
import { PasswordHasher } from "./PasswordHasher";
import { JwtTokenProvider } from "./JwtTokenProvider";

import type { IUserRepository } from "@/lib/application/interfaces/IUserRepository";
import type { IUserCredentialRepository } from "@/lib/application/interfaces/IUserCredentialRepository";
import type { IUserSessionRepository } from "@/lib/application/interfaces/IUserSessionRepository";
import type { IRoleAssignmentRepository } from "@/lib/application/interfaces/IRoleAssignmentRepository";
import type { IRoleRepository } from "@/lib/application/interfaces/IRoleRepository";

export function createSignInUseCase(): SignInUseCase {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required.");
  }

  return new SignInUseCase(
    serviceRegistry.resolve<IUserRepository>("UserRepository"),
    serviceRegistry.resolve<IUserCredentialRepository>("UserCredentialRepository"),
    serviceRegistry.resolve<IUserSessionRepository>("UserSessionRepository"),
    serviceRegistry.resolve<IRoleAssignmentRepository>("RoleAssignmentRepository"),
    serviceRegistry.resolve<IRoleRepository>("RoleRepository"),
    new PasswordHasher(),
    new JwtTokenProvider(accessSecret, refreshSecret),
    new AuthorizationService(),
  );
}

function createTokenProvider(): JwtTokenProvider {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!accessSecret || !refreshSecret) throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required.");
  return new JwtTokenProvider(accessSecret, refreshSecret);
}

export function createSignOutUseCase(): SignOutUseCase {
  return new SignOutUseCase(serviceRegistry.resolve<IUserSessionRepository>("UserSessionRepository"), createTokenProvider());
}

export function createRefreshTokenUseCase(): RefreshTokenUseCase {
  return new RefreshTokenUseCase(serviceRegistry.resolve<IUserRepository>("UserRepository"), serviceRegistry.resolve<IUserSessionRepository>("UserSessionRepository"), createTokenProvider());
}

export function createIdentityAuthenticationService(): IdentityAuthenticationService {
  return new IdentityAuthenticationService(
    serviceRegistry.resolve<IUserRepository>("UserRepository"),
    serviceRegistry.resolve<IUserSessionRepository>("UserSessionRepository"),
    serviceRegistry.resolve<IRoleAssignmentRepository>("RoleAssignmentRepository"),
    serviceRegistry.resolve<IRoleRepository>("RoleRepository"),
    createTokenProvider(),
    new AuthorizationService(),
  );
}
