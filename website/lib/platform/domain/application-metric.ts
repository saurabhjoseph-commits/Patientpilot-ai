/**
 * PP-002 Milestone C
 * Global Application Metric Domain
 *
 * Reusable definition of an
 * application metric.
 */

export type ApplicationMetricStatus =
  | "draft"
  | "active"
  | "disabled"
  | "deprecated";

export type ApplicationMetricType =
  | "counter"
  | "gauge"
  | "histogram"
  | "summary"
  | "rate"
  | "percentage"
  | "duration"
  | "size"
  | "custom";

export type ApplicationMetricCategory =
  | "availability"
  | "performance"
  | "reliability"
  | "capacity"
  | "security"
  | "network"
  | "database"
  | "storage"
  | "queue"
  | "business"
  | "ai"
  | "custom";

export interface ApplicationMetricIdentity {

  name: string;

  displayName: string;

  description?: string;

  unit: string;

}

export interface ApplicationMetricCollection {

  intervalSeconds: number;

  aggregation:
    | "latest"
    | "average"
    | "minimum"
    | "maximum"
    | "sum"
    | "count"
    | "percentile";

  retentionDays?: number;

}

export interface ApplicationMetricThresholds {

  warning?: number;

  critical?: number;

  minimum?: number;

  maximum?: number;

}

export interface ApplicationMetricBehavior {

  enabled: boolean;

  affectsHealth: boolean;

  visibleInDashboard: boolean;

}

export interface ApplicationMetricMetadata {

  tags: string[];

}

export interface ApplicationMetric {

  id: string;

  applicationId: string;

  code: string;

  status: ApplicationMetricStatus;

  type: ApplicationMetricType;

  category: ApplicationMetricCategory;

  identity: ApplicationMetricIdentity;

  collection: ApplicationMetricCollection;

  thresholds: ApplicationMetricThresholds;

  behavior: ApplicationMetricBehavior;

  metadata: ApplicationMetricMetadata;

  createdAt: string;

  updatedAt: string;

}