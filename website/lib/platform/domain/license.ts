/**
 * PP-002 Milestone C
 * Global License Domain
 *
 * Represents a commercial license
 * and entitlement for a tenant.
 */

export type LicenseStatus =
  | "active"
  | "trial"
  | "expired"
  | "suspended"
  | "cancelled";

export type LicensePlan =
  | "starter"
  | "professional"
  | "business"
  | "enterprise"
  | "custom";

export type LicenseBillingCycle =
  | "monthly"
  | "quarterly"
  | "annual"
  | "lifetime";

export interface LicenseValidity {

  startsAt: string;

  expiresAt?: string;

  renewedAt?: string;

}

export interface LicenseEntitlement {

  featureKeys: string[];

  modules: string[];

}

export interface LicenseLimit {

  users?: number;

  clinics?: number;

  providers?: number;

  appointmentsPerMonth?: number;

  aiMinutesPerMonth?: number;

  apiRequestsPerMonth?: number;

  storageGb?: number;

}

export interface LicenseUsage {

  users: number;

  clinics: number;

  providers: number;

  appointmentsThisMonth: number;

  aiMinutesThisMonth: number;

  apiRequestsThisMonth: number;

  storageGb: number;

}

export interface LicenseMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface License {

  id: string;

  tenantId: string;

  clinicId?: string;

  status: LicenseStatus;

  plan: LicensePlan;

  billingCycle: LicenseBillingCycle;

  validity: LicenseValidity;

  entitlement: LicenseEntitlement;

  limits: LicenseLimit;

  usage: LicenseUsage;

  metadata: LicenseMetadata;

  createdAt: string;

  updatedAt: string;

}