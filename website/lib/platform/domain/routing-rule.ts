/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Defines reusable communication routing logic.
 */

export type RoutingRuleStatus =
  | "active"
  | "disabled"
  | "archived";

export type RoutingRuleScope =
  | "global"
  | "tenant"
  | "clinic"
  | "location"
  | "channel";

export type RoutingTargetType =
  | "user"
  | "team"
  | "ai_agent"
  | "channel_endpoint"
  | "workflow"
  | "queue";

export interface RoutingCondition {

  field: string;

  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "starts_with"
    | "ends_with"
    | "greater_than"
    | "less_than"
    | "in"
    | "not_in"
    | "exists";

  value?: string | number | boolean | string[];

}

export interface RoutingTarget {

  type: RoutingTargetType;

  targetId: string;

  priority: number;

}

export interface RoutingFallback {

  enabled: boolean;

  target?: RoutingTarget;

}

export interface RoutingMetadata {

  description?: string;

  tags: string[];

}

export interface RoutingRule {

  id: string;

  tenantId: string;

  name: string;

  status: RoutingRuleStatus;

  scope: RoutingRuleScope;

  priority: number;

  conditions: RoutingCondition[];

  target: RoutingTarget;

  fallback: RoutingFallback;

  metadata: RoutingMetadata;

  createdAt: string;

  updatedAt: string;

}