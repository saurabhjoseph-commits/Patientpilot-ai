/**
 * PP-002 Milestone C
 * Global Commission Payout Domain
 *
 * Records the execution of
 * commission plans.
 */

export type CommissionPayoutStatus =
  | "pending"
  | "approved"
  | "scheduled"
  | "paid"
  | "cancelled"
  | "reversed";

export type CommissionPayoutMethod =
  | "bank_transfer"
  | "wire"
  | "paypal"
  | "stripe"
  | "credit_note"
  | "manual";

export interface CommissionRecipient {

  recipientType:
    | "partner"
    | "reseller"
    | "affiliate"
    | "franchise"
    | "sales_rep"
    | "organization";

  recipientId: string;

  name?: string;

}

export interface CommissionPayoutScope {

  tenantId: string;

  salesChannelId?: string;

  countryCode?: string;

}

export interface CommissionPayoutContext {

  commissionPlanId: string;

  subscriptionId?: string;

  invoiceId?: string;

  paymentId?: string;

  customerId?: string;

}

export interface CommissionCalculation {

  revenueAmount: number;

  commissionRate?: number;

  commissionAmount: number;

  currencyCode: string;

}

export interface CommissionPayoutMetadata {

  approvedBy?: string;

  paidBy?: string;

  paymentReference?: string;

  notes?: string;

  tags: string[];

}

export interface CommissionPayout {

  id: string;

  status: CommissionPayoutStatus;

  payoutMethod: CommissionPayoutMethod;

  recipient: CommissionRecipient;

  scope: CommissionPayoutScope;

  context: CommissionPayoutContext;

  calculation: CommissionCalculation;

  metadata: CommissionPayoutMetadata;

  calculatedAt: string;

  approvedAt?: string;

  paidAt?: string;

  createdAt: string;

  updatedAt: string;

}