/**
 * PP-003 Billing & Revenue Domain
 *
 * Represents a reusable payment method
 * configuration for a clinic.
 *
 * Individual payments reference this
 * entity through methodId.
 */

export type PaymentMethodStatus =
  | "active"
  | "inactive";

export type PaymentMethodType =
  | "cash"
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "check"
  | "digital_wallet"
  | "insurance_eft"
  | "financing"
  | "other";

export interface PaymentMethodProvider {

  gateway?: string;

  merchantAccountId?: string;

  terminalId?: string;

}

export interface PaymentMethodConfiguration {

  supportsRefunds: boolean;

  supportsPartialPayments: boolean;

  supportsRecurringPayments: boolean;

}

export interface PaymentMethodMetadata {

  notes?: string;

  externalId?: string;

}

export interface PaymentMethod {

  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  type: PaymentMethodType;

  status: PaymentMethodStatus;

  provider: PaymentMethodProvider;

  configuration: PaymentMethodConfiguration;

  metadata: PaymentMethodMetadata;

  createdAt: string;

  updatedAt: string;

}