/**
 * ============================================================
 * PatientPilot AI
 * Application Context
 * ============================================================
 *
 * Carries request-scoped information through the
 * Application Layer.
 *
 * This object should never contain business entities.
 * It only provides execution context.
 */

export type UserRole =
  | "super_admin"
  | "tenant_admin"
  | "clinic_admin"
  | "dentist"
  | "front_desk"
  | "staff"
  | "ai_agent"
  | "system";

export type ExecutionChannel =
  | "web"
  | "mobile"
  | "api"
  | "ai"
  | "voice"
  | "sms"
  | "email"
  | "background"
  | "system";

export interface ApplicationUser {
  id: string;

  role: UserRole;

  permissions: string[];
}

export interface ApplicationTenant {
  tenantId: string;

  clinicId: string;

  organizationId?: string;
}

export interface ApplicationLocalization {
  country: string;

  language: string;

  timezone: string;

  currency: string;
}

export interface ApplicationRequest {
  requestId: string;

  correlationId: string;

  channel: ExecutionChannel;

  ipAddress?: string;

  userAgent?: string;
}

export interface ApplicationFeatureFlags {
  values: Record<string, boolean>;
}

export interface ApplicationContext {
  request: ApplicationRequest;

  tenant: ApplicationTenant;

  user: ApplicationUser;

  localization: ApplicationLocalization;

  features: ApplicationFeatureFlags;

  metadata: Record<string, unknown>;

  startedAt: Date;
}