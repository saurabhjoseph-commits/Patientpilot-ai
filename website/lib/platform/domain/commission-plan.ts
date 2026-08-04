/**
 * PP-002 Milestone C
 * Global Commission Plan Domain
 *
 * Defines reusable revenue-sharing
 * and commission models.
 */

export type CommissionPlanStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type CommissionPlanType =
  | "percentage"
  | "fixed_amount"
  | "tiered"
  | "hybrid"
  | "recurring"
  | "one_time";

export type CommissionRecipientType =
  | "partner"
  | "reseller"
  | "affiliate"
  | "franchise"
  | "sales_rep"
  | "organization";

export interface CommissionPlanScope {

  tenantId?: string;

  countryCodes: string[];

  salesChannelIds: string[];

  productIds: string[];

  productBundleIds: string[];

}

export interface CommissionPlanCalculation {

  type: CommissionPlanType;

  percentage?: number;

  fixedAmount?: number;

  currencyCode?: string;

  recurringMonths?: number;

}

export interface CommissionTier {

  minimumRevenue: number;

  maximumRevenue?: number;

  percentage: number;

}

export interface CommissionPlanRules {

  minimumContractValue?: number;

  requiresPaymentReceived: boolean;

  allowStacking: boolean;

  tiers: CommissionTier[];

}

export interface CommissionPlanMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface CommissionPlan {

  id: string;

  code: string;

  name: string;

  status: CommissionPlanStatus;

  recipientType: CommissionRecipientType;

  scope: CommissionPlanScope;

  calculation: CommissionPlanCalculation;

  rules: CommissionPlanRules;

  metadata: CommissionPlanMetadata;

  createdAt: string;

  updatedAt: string;

}