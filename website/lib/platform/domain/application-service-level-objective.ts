/**
 * PP-002 Milestone C
 * Global Application Service Level Objective Domain
 *
 * Reusable reliability target definition
 * for applications.
 */

export type ApplicationServiceLevelObjectiveStatus =
  | "draft"
  | "active"
  | "disabled"
  | "deprecated";

export type ApplicationServiceLevelObjectiveType =
  | "availability"
  | "latency"
  | "error_rate"
  | "throughput"
  | "response_time"
  | "uptime"
  | "custom";

export type ApplicationServiceLevelObjectivePeriod =
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

export interface ApplicationServiceLevelObjectiveScope {

  environmentId?: string;

  applicationId: string;

  endpointId?: string;

  metricId?: string;

}

export interface ApplicationServiceLevelObjectiveTarget {

  targetValue: number;

  unit:
    | "percentage"
    | "milliseconds"
    | "seconds"
    | "requests_per_second"
    | "count"
    | "custom";

  comparison:
    | ">="
    | "<="
    | "=";

}

export interface ApplicationServiceLevelObjectiveMeasurement {

  evaluationPeriod: ApplicationServiceLevelObjectivePeriod;

  rollingWindow: boolean;

  aggregation:
    | "average"
    | "minimum"
    | "maximum"
    | "sum"
    | "count"
    | "percentile";

}

export interface ApplicationServiceLevelObjectiveErrorBudget {

  enabled: boolean;

  budgetValue?: number;

  budgetUnit?: "percentage" | "minutes" | "hours";

}

export interface ApplicationServiceLevelObjectiveMetadata {

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationServiceLevelObjective {

  id: string;

  code: string;

  name: string;

  status: ApplicationServiceLevelObjectiveStatus;

  type: ApplicationServiceLevelObjectiveType;

  scope: ApplicationServiceLevelObjectiveScope;

  target: ApplicationServiceLevelObjectiveTarget;

  measurement: ApplicationServiceLevelObjectiveMeasurement;

  errorBudget: ApplicationServiceLevelObjectiveErrorBudget;

  metadata: ApplicationServiceLevelObjectiveMetadata;

  createdAt: string;

  updatedAt: string;

}