/**
 * PP-002 Milestone C
 * Global Currency Domain
 *
 * Represents a supported currency
 * within the platform.
 */

export type CurrencyStatus =
  | "active"
  | "inactive"
  | "deprecated";

export type CurrencyRoundingMode =
  | "half_up"
  | "half_down"
  | "half_even"
  | "up"
  | "down";

export interface CurrencyFormat {

  symbol: string;

  symbolPosition: "before" | "after";

  decimalSeparator: string;

  thousandsSeparator: string;

}

export interface CurrencyPrecision {

  decimalPlaces: number;

  roundingMode: CurrencyRoundingMode;

}

export interface CurrencyMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface Currency {

  id: string;

  code: string;

  name: string;

  numericCode: string;

  status: CurrencyStatus;

  format: CurrencyFormat;

  precision: CurrencyPrecision;

  metadata: CurrencyMetadata;

  createdAt: string;

  updatedAt: string;

}