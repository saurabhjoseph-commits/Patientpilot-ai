/**
 * PP-002 Milestone C
 * Global Application Health Check Domain
 *
 * Reusable definition of an application
 * health probe.
 */

export type ApplicationHealthCheckStatus =
  | "draft"
  | "active"
  | "disabled"
  | "deprecated";

export type ApplicationHealthCheckType =
  | "http"
  | "tcp"
  | "grpc"
  | "database"
  | "redis"
  | "queue"
  | "storage"
  | "dns"
  | "smtp"
  | "ai_provider"
  | "external_api"
  | "script"
  | "custom";

export type ApplicationHealthCheckSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "informational";

export interface ApplicationHealthCheckTarget {

  endpointId?: string;

  dependencyId?: string;

  resourceName?: string;

  url?: string;

}

export interface ApplicationHealthCheckConfiguration {

  intervalSeconds: number;

  timeoutSeconds: number;

  successThreshold: number;

  failureThreshold: number;

  expectedStatusCodes: number[];

}

export interface ApplicationHealthCheckBehavior {

  enabled: boolean;

  affectsOverallHealth: boolean;

  stopOnFailure: boolean;

}

export interface ApplicationHealthCheckMetadata {

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationHealthCheck {

  id: string;

  applicationId: string;

  code: string;

  name: string;

  status: ApplicationHealthCheckStatus;

  type: ApplicationHealthCheckType;

  severity: ApplicationHealthCheckSeverity;

  target: ApplicationHealthCheckTarget;

  configuration: ApplicationHealthCheckConfiguration;

  behavior: ApplicationHealthCheckBehavior;

  metadata: ApplicationHealthCheckMetadata;

  createdAt: string;

  updatedAt: string;

}