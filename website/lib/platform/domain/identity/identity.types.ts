/**
 * PatientPilot AI
 * Identity Domain Types
 *
 * Shared types used throughout the Identity domain.
 *
 * Clean Architecture Rules:
 * - No framework imports
 * - No infrastructure dependencies
 * - No business logic
 * - No database types
 */

/* -------------------------------------------------------------------------- */
/* Primitive Domain IDs                                                       */
/* -------------------------------------------------------------------------- */

export type UserId = string;
export type TenantId = string;
export type ClinicId = string;
export type RoleId = string;
export type PermissionId = string;
export type SessionIdValue = string;
export type CredentialId = string;
export type LoginAuditId = string;

/* -------------------------------------------------------------------------- */
/* Primitive Value Types                                                      */
/* -------------------------------------------------------------------------- */

export type Email = string;
export type PasswordHashValue = string;
export type PermissionCodeValue = string;
export type RoleCodeValue = string;

export type IsoDateTime = string;

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

export interface AuthenticationResult {
  readonly userId: UserId;
  readonly sessionId: SessionIdValue;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: IsoDateTime;
}

/* -------------------------------------------------------------------------- */
/* Session Context                                                            */
/* -------------------------------------------------------------------------- */

export interface DeviceInfo {
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly deviceName?: string;
}

export interface CurrentIdentity {
  readonly userId: UserId;
  readonly tenantId: TenantId;
  readonly clinicId: ClinicId;
  readonly sessionId: SessionIdValue;
  readonly roles: readonly RoleCodeValue[];
  readonly permissions: readonly PermissionCodeValue[];
}

/* -------------------------------------------------------------------------- */
/* Audit                                                                      */
/* -------------------------------------------------------------------------- */

export interface AuditMetadata {
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;

  readonly createdBy?: UserId;
  readonly updatedBy?: UserId;
}

/* -------------------------------------------------------------------------- */
/* Identity Timestamps                                                        */
/* -------------------------------------------------------------------------- */

export interface AuthenticationTimestamps {
  readonly lastLoginAt?: IsoDateTime;
  readonly passwordChangedAt?: IsoDateTime;
  readonly lockedUntil?: IsoDateTime;
}

/* -------------------------------------------------------------------------- */
/* Domain Event Metadata                                                      */
/* -------------------------------------------------------------------------- */

export interface DomainEventMetadata {
  readonly eventId: string;
  readonly occurredAt: IsoDateTime;
  readonly correlationId?: string;
  readonly causationId?: string;
}
