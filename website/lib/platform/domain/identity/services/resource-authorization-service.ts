import type { ClinicId, TenantId } from "../identity.types";

export interface AuthorizationScope {
  readonly tenantId: TenantId;
  readonly clinicId: ClinicId;
}

export class ResourceAuthorizationService {
  belongsToTenant(subject: AuthorizationScope, tenantId: TenantId): boolean {
    return subject.tenantId === tenantId;
  }

  belongsToClinic(subject: AuthorizationScope, clinicId: ClinicId): boolean {
    return subject.clinicId === clinicId;
  }

  canAccessResource(subject: AuthorizationScope, resource: AuthorizationScope): boolean {
    return this.belongsToTenant(subject, resource.tenantId) && this.belongsToClinic(subject, resource.clinicId);
  }
}
