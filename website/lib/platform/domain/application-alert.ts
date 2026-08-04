/**
 * PP-002 Milestone C
 * Global Application Alert Domain
 *
 * Runtime operational incident generated
 * from an application alert rule.
 */

export type ApplicationAlertStatus =
  | "open"
  | "acknowledged"
  | "suppressed"
  | "resolved"
  | "closed";

export interface ApplicationAlertTrigger {

  alertRuleId: string;

  metricId?: string;

  metricMeasurementId?: string;

  healthCheckId?: string;

  healthCheckExecutionId?: string;

  applicationHealthId?: string;

}

export interface ApplicationAlertCondition {

  observedValue?: number;

  expectedValue?: number;

  operator?: string;

  threshold?: number;

  message: string;

}

export interface ApplicationAlertOwnership {

  assignedTo?: string;

  acknowledgedBy?: string;

  acknowledgedAt?: string;

}

export interface ApplicationAlertResolution {

  resolvedBy?: string;

  resolvedAt?: string;

  autoResolved: boolean;

  resolutionNotes?: string;

}

export interface ApplicationAlertEscalation {

  escalationPolicyId?: string;

  escalationLevel: number;

  escalatedAt?: string;

}

export interface ApplicationAlertMetadata {

  incidentId?: string;

  runbookUrl?: string;

  tags: string[];

}

export interface ApplicationAlert {

  id: string;

  applicationId: string;

  status: ApplicationAlertStatus;

  severity:
    | "critical"
    | "high"
    | "medium"
    | "low"
    | "informational";

  trigger: ApplicationAlertTrigger;

  condition: ApplicationAlertCondition;

  ownership: ApplicationAlertOwnership;

  resolution: ApplicationAlertResolution;

  escalation: ApplicationAlertEscalation;

  metadata: ApplicationAlertMetadata;

  triggeredAt: string;

  createdAt: string;

  updatedAt: string;

}