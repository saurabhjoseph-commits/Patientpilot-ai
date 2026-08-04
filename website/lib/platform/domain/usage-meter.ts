/**
 * PP-002 Milestone C
 * Global Usage Meter Domain
 *
 * Defines a reusable usage meter
 * for usage-based billing.
 */

export type UsageMeterStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type UsageAggregation =
  | "sum"
  | "count"
  | "maximum"
  | "minimum"
  | "average";

export type UsageResetPeriod =
  | "none"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

export interface UsageMeterUnit {

  code: string;

  name: string;

  symbol?: string;

}

export interface UsageMeterMeasurement {

  aggregation: UsageAggregation;

  resetPeriod: UsageResetPeriod;

  allowFractional: boolean;

}

export interface UsageMeterMetadata {

  description?: string;

  category: string;

  createdBy?: string;

  tags: string[];

}

export interface UsageMeter {

  id: string;

  tenantId?: string;

  clinicId?: string;

  code: string;

  name: string;

  status: UsageMeterStatus;

  unit: UsageMeterUnit;

  measurement: UsageMeterMeasurement;

  metadata: UsageMeterMetadata;

  createdAt: string;

  updatedAt: string;

}