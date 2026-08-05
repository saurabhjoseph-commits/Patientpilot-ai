/**
 * PP-002 Milestone C
 * Global Subscription Domain
 *
 * Represents the commercial subscription
 * associated with a tenant license.
 */

export type SubscriptionStatus =
  | "trial"
  | "active"
  | "past_due"
  | "paused"
  | "cancelled"
  | "expired";

export type SubscriptionProvider =
  | "stripe"
  | "paddle"
  | "chargebee"
  | "manual"
  | "custom";

export type SubscriptionBillingCycle =
  | "monthly"
  | "quarterly"
  | "annual"
  | "lifetime";

export interface SubscriptionPeriod {

  startsAt: string;

  currentPeriodStart: string;

  currentPeriodEnd: string;

  trialEndsAt?: string;

  cancelledAt?: string;

}

export interface SubscriptionPayment {

  provider: SubscriptionProvider;

  externalSubscriptionId?: string;

  customerId?: string;

  currency: string;

  amount: number;

  billingCycle: SubscriptionBillingCycle;

}

export interface SubscriptionRenewal {

  autoRenew: boolean;

  nextBillingAt?: string;

  renewalCount: number;

}

export interface SubscriptionMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Subscription {

  id: string;

  tenantId: string;

  clinicId?: string;

  licenseId: string;

  status: SubscriptionStatus;

  payment: SubscriptionPayment;

  period: SubscriptionPeriod;

  renewal: SubscriptionRenewal;

  metadata: SubscriptionMetadata;

  createdAt: string;

  updatedAt: string;

}