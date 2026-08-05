/**
 * PP-002 Milestone C
 * Global Offer Redemption Domain
 *
 * Records the execution of
 * commercial offers.
 */

export type OfferRedemptionStatus =
  | "pending"
  | "successful"
  | "failed"
  | "cancelled"
  | "reversed";

export type OfferRedemptionSource =
  | "checkout"
  | "subscription"
  | "invoice"
  | "sales"
  | "api"
  | "admin";

export interface OfferRedemptionScope {

  tenantId: string;

  clinicId?: string;

  patientId?: string;

  userId?: string;

}

export interface OfferRedemptionContext {

  subscriptionId?: string;

  invoiceId?: string;

  paymentId?: string;

  couponRedemptionId?: string;

}

export interface OfferRedemptionBenefit {

  currencyCode: string;

  discountAmount?: number;

  creditAmount?: number;

  freeTrialDays?: number;

  grantedProductIds: string[];

  grantedProductBundleIds: string[];

}

export interface OfferRedemptionMetadata {

  description?: string;

  redeemedBy?: string;

  failureReason?: string;

  tags: string[];

}

export interface OfferRedemption {

  id: string;

  offerId: string;

  status: OfferRedemptionStatus;

  source: OfferRedemptionSource;

  scope: OfferRedemptionScope;

  context: OfferRedemptionContext;

  benefit: OfferRedemptionBenefit;

  metadata: OfferRedemptionMetadata;

  redeemedAt: string;

  createdAt: string;

  updatedAt: string;

}