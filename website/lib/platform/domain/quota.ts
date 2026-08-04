/**
 * PP-002 Milestone C
 * Global Quota Domain
 *
 * Defines reusable consumption limits
 * for subscriptions, licenses, and features.
 */

export type QuotaStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired"
  | "archived";

export type QuotaScope =
  | "global"
  | "tenant"
  | "clinic"
  | "license"
  | "subscription"
  | "feature";

export type QuotaAction =
  | "allow"
  | "warn"
  | "throttle"
  | "block"
  | "bill_overage";

export interface QuotaTarget {

  tenantId?: string;

  clinicId?: string;

  licenseId?: string;

  subscriptionId?: string;

  featureFlagId?: string;

}

export interface QuotaLimit {

  usageMeterId: string;

  limit: number;

  resetPeriod:
    | "none"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year";

  allowOverage: boolean;

}

export interface QuotaEnforcement {

  action: QuotaAction;

  warningThreshold?: number;

}

export interface QuotaValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface QuotaMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Quota {

  id: string;

  tenantId?: string;

  clinicId?: string;

  name: string;

  status: QuotaStatus;

  scope: QuotaScope;

  target: QuotaTarget;

  limit: QuotaLimit;

  enforcement: QuotaEnforcement;

  validity: QuotaValidity;

  metadata: QuotaMetadata;

  createdAt: string;

  updatedAt: string;

}