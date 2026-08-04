/**
 * PP-002 Milestone C
 * Global Application Alert Rule Domain
 *
 * Reusable definition of operational
 * alerting rules.
 */

export type ApplicationAlertRuleStatus =
  | "draft"
  | "active"
  | "disabled"
  | "deprecated";

export type ApplicationAlertRuleSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "informational";

export type ApplicationAlertRuleOperator =
  | ">"
  | ">="
  | "<"
  | "<="
  | "="
  | "!="
  | "between"
  | "outside";

export interface ApplicationAlertRuleTarget {

  metricId?: string;

  healthCheckId?: string;

  applicationHealthId?: string;

}

export interface ApplicationAlertRuleCondition {

  operator: ApplicationAlertRuleOperator;

  warningThreshold?: number;

  criticalThreshold?: number;

  evaluationWindowSeconds: number;

  requiredOccurrences: number;

}

export interface ApplicationAlertRuleBehavior {

  enabled: boolean;

  autoResolve: boolean;

  suppressionWindowSeconds?: number;

  cooldownSeconds?: number;

}

export interface ApplicationAlertRuleNotifications {

  notifyEmail: boolean;

  notifyWebhook: boolean;

  notifySms: boolean;

  notifyInApp: boolean;

  escalationPolicyId?: string;

}

export interface ApplicationAlertRuleMetadata {

  description?: string;

  runbookUrl?: string;

  tags: string[];

}

export interface ApplicationAlertRule {

  id: string;

  applicationId: string;

  code: string;

  name: string;

  status: ApplicationAlertRuleStatus;

  severity: ApplicationAlertRuleSeverity;

  target: ApplicationAlertRuleTarget;

  condition: ApplicationAlertRuleCondition;

  behavior: ApplicationAlertRuleBehavior;

  notifications: ApplicationAlertRuleNotifications;

  metadata: ApplicationAlertRuleMetadata;

  createdAt: string;

  updatedAt: string;

}