/**
 * PP-002 Milestone C
 * Global Feature Flag Domain
 *
 * Represents a configurable feature
 * that can be enabled or disabled
 * without code changes.
 */

export type FeatureFlagStatus =
  | "active"
  | "inactive"
  | "deprecated";

export type FeatureFlagScope =
  | "global"
  | "tenant"
  | "clinic"
  | "environment"
  | "country"
  | "user"
  | "role";

export type FeatureFlagStrategy =
  | "boolean"
  | "percentage"
  | "allow_list"
  | "deny_list"
  | "rule";

export interface FeatureFlagTarget {

  tenantIds?: string[];

  clinicIds?: string[];

  countries?: string[];

  environments?: string[];

  userIds?: string[];

  roleIds?: string[];

}

export interface FeatureFlagConfiguration {

  strategy: FeatureFlagStrategy;

  enabled: boolean;

  rolloutPercentage?: number;

}

export interface FeatureFlagRule {

  ruleId?: string;

}

export interface FeatureFlagMetadata {

  description?: string;

  createdBy?: string;

  tags: string[];

}

export interface FeatureFlag {

  id: string;

  tenantId?: string;

  clinicId?: string;

  status: FeatureFlagStatus;

  scope: FeatureFlagScope;

  key: string;

  name: string;

  target: FeatureFlagTarget;

  configuration: FeatureFlagConfiguration;

  rule?: FeatureFlagRule;

  metadata: FeatureFlagMetadata;

  createdAt: string;

  updatedAt: string;

}