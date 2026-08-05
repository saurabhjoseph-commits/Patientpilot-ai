/**
 * PP-002 Milestone C
 * Global Application Metric Measurement Domain
 *
 * Runtime measurement of an
 * defined application metric.
 */

export type ApplicationMetricMeasurementStatus =
  | "collected"
  | "aggregated"
  | "estimated"
  | "discarded";

export interface ApplicationMetricMeasurementDimensions {

  environmentId?: string;

  deploymentId?: string;

  tenantId?: string;

  locationId?: string;

  region?: string;

  instanceId?: string;

}

export interface ApplicationMetricMeasurementCollection {

  collectedBy?: string;

  source:
    | "agent"
    | "application"
    | "api"
    | "scheduler"
    | "manual"
    | "external";

  intervalSeconds?: number;

}

export interface ApplicationMetricMeasurementValue {

  value: number;

  minimum?: number;

  maximum?: number;

  average?: number;

  sampleCount?: number;

  unit: string;

}

export interface ApplicationMetricMeasurementEvaluation {

  warningTriggered: boolean;

  criticalTriggered: boolean;

  withinThreshold: boolean;

}

export interface ApplicationMetricMeasurementMetadata {

  traceId?: string;

  tags: string[];

}

export interface ApplicationMetricMeasurement {

  id: string;

  applicationMetricId: string;

  applicationId: string;

  status: ApplicationMetricMeasurementStatus;

  dimensions: ApplicationMetricMeasurementDimensions;

  collection: ApplicationMetricMeasurementCollection;

  value: ApplicationMetricMeasurementValue;

  evaluation: ApplicationMetricMeasurementEvaluation;

  metadata: ApplicationMetricMeasurementMetadata;

  measuredAt: string;

}