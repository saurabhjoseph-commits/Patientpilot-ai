/**
 * PP-002 Milestone C
 * Global Coupon Domain
 *
 * Represents a reusable promotional
 * coupon definition.
 */

export type CouponStatus =
  | "draft"
  | "active"
  | "inactive"
  | "expired"
  | "archived";

export type CouponType =
  | "percentage"
  | "fixed_amount"
  | "free_trial"
  | "credit";

export interface CouponDiscount {

  type: CouponType;

  value: number;

  currency?: string;

  maximumDiscount?: number;

}

export interface CouponValidity {

  startsAt: string;

  expiresAt?: string;

}

export interface CouponUsage {

  maximumRedemptions?: number;

  redemptionCount: number;

  perCustomerLimit?: number;

}

export interface CouponEligibility {

  licensePlans?: string[];

  tenantIds?: string[];

  clinicIds?: string[];

  countries?: string[];

}

export interface CouponMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Coupon {

  id: string;

  tenantId?: string;

  clinicId?: string;

  code: string;

  name: string;

  status: CouponStatus;

  discount: CouponDiscount;

  validity: CouponValidity;

  usage: CouponUsage;

  eligibility: CouponEligibility;

  metadata: CouponMetadata;

  createdAt: string;

  updatedAt: string;

}