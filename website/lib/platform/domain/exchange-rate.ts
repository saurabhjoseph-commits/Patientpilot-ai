/**
 * PP-002 Milestone C
 * Global Exchange Rate Domain
 *
 * Represents a reusable exchange rate
 * between two currencies.
 */

export type ExchangeRateStatus =
  | "active"
  | "inactive"
  | "expired";

export type ExchangeRateProvider =
  | "ecb"
  | "openexchangerates"
  | "fixer"
  | "xe"
  | "manual"
  | "custom";

export interface ExchangeRatePair {

  fromCurrency: string;

  toCurrency: string;

}

export interface ExchangeRateValue {

  rate: number;

  inverseRate: number;

}

export interface ExchangeRateValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface ExchangeRateMetadata {

  description?: string;

  provider: ExchangeRateProvider;

  providerReference?: string;

  createdBy?: string;

  tags: string[];

}

export interface ExchangeRate {

  id: string;

  status: ExchangeRateStatus;

  pair: ExchangeRatePair;

  value: ExchangeRateValue;

  validity: ExchangeRateValidity;

  metadata: ExchangeRateMetadata;

  createdAt: string;

  updatedAt: string;

}