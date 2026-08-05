/**
 * PP-002 Milestone C
 * Global Application Service Level Report Domain
 *
 * Runtime evaluation of an
 * Application Service Level Objective.
 */

export type ApplicationServiceLevelReportStatus =
  | "pending"
  | "evaluating"
  | "compliant"
  | "non_compliant"
  | "partial"
  | "failed";

export interface ApplicationServiceLevelReportEvaluation {

  serviceLevelObjectiveId: string;

  applicationId: string;

  environmentId?: string;

  evaluatedBy?:
    | "scheduler"
    | "manual"
    | "api"
    | "background_job";

}

export interface ApplicationServiceLevelReportPeriod {

  startsAt: string;

  endsAt: string;

  evaluatedAt: string;

}

export interface ApplicationServiceLevelReportMeasurement {

  targetValue: number;

  measuredValue: number;

  unit: string;

  compliancePercentage: number;

}

export interface ApplicationServiceLevelReportErrorBudget {

  totalBudget: number;

  consumedBudget: number;

  remainingBudget: number;

  burnRate?: number;

}

export interface ApplicationServiceLevelReportMetrics {

  metricId?: string;

  measurementIds: string[];

}

export interface ApplicationServiceLevelReportResult {

  compliant: boolean;

  summary?: string;

  recommendations?: string[];

}

export interface ApplicationServiceLevelReportMetadata {

  dashboardUrl?: string;

  reportUrl?: string;

  tags: string[];

}

export interface ApplicationServiceLevelReport {

  id: string;

  status: ApplicationServiceLevelReportStatus;

  evaluation: ApplicationServiceLevelReportEvaluation;

  period: ApplicationServiceLevelReportPeriod;

  measurement: ApplicationServiceLevelReportMeasurement;

  errorBudget: ApplicationServiceLevelReportErrorBudget;

  metrics: ApplicationServiceLevelReportMetrics;

  result: ApplicationServiceLevelReportResult;

  metadata: ApplicationServiceLevelReportMetadata;

  createdAt: string;

  updatedAt: string;

}