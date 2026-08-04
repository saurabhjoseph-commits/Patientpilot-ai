/**
 * PP-002 Milestone C
 * Global Tax Rate Domain
 *
 * Represents a reusable tax
 * configuration for a jurisdiction.
 */

export type TaxRateStatus =
  | "active"
  | "inactive"
  | "expired"
  | "archived";

export type TaxRateType =
  | "sales_tax"
  | "vat"
  | "gst"
  | "service_tax"
  | "withholding"
  | "custom";

export type TaxCalculationMethod =
  | "exclusive"
  | "inclusive";

export interface TaxJurisdiction {

  country: string;

  state?: string;

  province?: string;

  city?: string;

  postalCode?: string;

}

export interface TaxPercentage {

  rate: number;

  calculationMethod: TaxCalculationMethod;

}

export interface TaxValidity {

  startsAt: string;

  expiresAt?: string;

}

export interface TaxMetadata {

  description?: string;

  authority?: string;

  createdBy?: string;

  tags: string[];

}

export interface TaxRate {

  id: string;

  tenantId?: string;

  clinicId?: string;

  code: string;

  name: string;

  status: TaxRateStatus;

  type: TaxRateType;

  jurisdiction: TaxJurisdiction;

  percentage: TaxPercentage;

  validity: TaxValidity;

  metadata: TaxMetadata;

  createdAt: string;

  updatedAt: string;

}