import type { IUserRepository } from "@/lib/application/interfaces/IUserRepository";
import type { IUserSessionRepository } from "@/lib/application/interfaces/IUserSessionRepository";
import type { IRoleAssignmentRepository } from "@/lib/application/interfaces/IRoleAssignmentRepository";
import type { IRoleRepository } from "@/lib/application/interfaces/IRoleRepository";
import type { ITokenProvider } from "@/lib/application/interfaces/ITokenProvider";
import { AuthorizationService } from "@/lib/platform/domain/identity";

export interface AuthenticatedIdentity {
  userId: string;
  tenantId: string;
  clinicId: string;
  roleCodes: readonly string[];
  permissionCodes: readonly string[];
}

export class IdentityAuthenticationService {
  constructor(
    private readonly users: IUserRepository,
    private readonly sessions: IUserSessionRepository,
    private readonly assignments: IRoleAssignmentRepository,
    private readonly roles: IRoleRepository,
    private readonly tokens: ITokenProvider,
    private readonly authorization: AuthorizationService,
  ) {}

  async validate(accessToken: string, refreshToken: string): Promise<AuthenticatedIdentity | null> {
    try {
      const access = await this.tokens.validateAccessToken(accessToken);
      const refresh = await this.tokens.validateRefreshToken(refreshToken);
      if (access.userId !== refresh.userId || access.clinicId !== refresh.clinicId) return null;
      const session = await this.sessions.findByRefreshTokenId(refresh.tokenId);
      if (!session || !session.isActive() || session.userId !== access.userId) return null;
      const user = await this.users.findById(access.userId);
      if (!user || !user.isActive()) return null;
      const assignments = await this.assignments.findByUser(user.id);
      const roles = await this.roles.findByUser(user.id);
      return {
        userId: user.id,
        tenantId: user.tenantId,
        clinicId: user.clinicId,
        roleCodes: this.authorization.getRoles(assignments, roles).map((role) => role.code.value),
        permissionCodes: this.authorization.getPermissions(assignments, roles).map((permission) => permission.value),
      };
    } catch {
      return null;
    }
  }
}
