/**
 * PP-002 Milestone C
 * Global Coupon Redemption Domain
 *
 * Represents a single usage of a coupon.
 */

export type CouponRedemptionStatus =
  | "pending"
  | "applied"
  | "rejected"
  | "reversed"
  | "expired";

export type CouponRedemptionSource =
  | "subscription"
  | "invoice"
  | "checkout"
  | "admin"
  | "api"
  | "system";

export interface CouponRedemptionDiscount {

  currency: string;

  originalAmount: number;

  discountAmount: number;

  finalAmount: number;

}

export interface CouponRedemptionContext {

  source: CouponRedemptionSource;

  subscriptionId?: string;

  invoiceId?: string;

  paymentId?: string;

}

export interface CouponRedemptionMetadata {

  description?: string;

  createdBy?: string;

  rejectionReason?: string;

  tags: string[];

}

export interface CouponRedemption {

  id: string;

  tenantId: string;

  clinicId?: string;

  couponId: string;

  patientId?: string;

  userId?: string;

  status: CouponRedemptionStatus;

  code: string;

  context: CouponRedemptionContext;

  discount: CouponRedemptionDiscount;

  metadata: CouponRedemptionMetadata;

  redeemedAt: string;

  createdAt: string;

  updatedAt: string;

}