/**
 * PP-002 Milestone C
 * Global Tax Calculation Domain
 *
 * Represents an immutable tax
 * calculation for a transaction.
 */

export type TaxCalculationStatus =
  | "calculated"
  | "applied"
  | "adjusted"
  | "reversed";

export type TaxableEntity =
  | "invoice"
  | "payment"
  | "refund"
  | "subscription"
  | "manual";

export interface TaxCalculationContext {

  entityType: TaxableEntity;

  entityId: string;

  invoiceId?: string;

  paymentId?: string;

  refundId?: string;

}

export interface TaxCalculationLine {

  taxRateId: string;

  code: string;

  name: string;

  jurisdiction: string;

  rate: number;

  taxableAmount: number;

  taxAmount: number;

}

export interface TaxCalculationTotals {

  currency: string;

  taxableAmount: number;

  exemptAmount: number;

  taxAmount: number;

  totalAmount: number;

}

export interface TaxCalculationMetadata {

  description?: string;

  calculatedBy?: string;

  engineVersion?: string;

  tags: string[];

}

export interface TaxCalculation {

  id: string;

  tenantId: string;

  clinicId?: string;

  status: TaxCalculationStatus;

  context: TaxCalculationContext;

  lines: TaxCalculationLine[];

  totals: TaxCalculationTotals;

  metadata: TaxCalculationMetadata;

  calculatedAt: string;

  createdAt: string;

  updatedAt: string;

}