/**
 * PP-002 Milestone C
 * Global Application Action Item Domain
 *
 * Tracks operational, engineering, reliability,
 * compliance, and governance improvements.
 */

export type ApplicationActionItemStatus =
  | "draft"
  | "planned"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled"
  | "deferred";

export type ApplicationActionItemPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type ApplicationActionItemType =
  | "corrective"
  | "preventive"
  | "technical_debt"
  | "reliability"
  | "security"
  | "compliance"
  | "performance"
  | "automation"
  | "documentation"
  | "monitoring"
  | "custom";

export interface ApplicationActionItemScope {

  applicationId: string;

  incidentId?: string;

  postmortemId?: string;

  problemId?: string;

  changeRequestId?: string;

  auditLogId?: string;

}

export interface ApplicationActionItemOwnership {

  ownerUserId?: string;

  ownerTeamId?: string;

  assignedBy?: string;

}

export interface ApplicationActionItemPlanning {

  priority: ApplicationActionItemPriority;

  estimatedEffortHours?: number;

  targetCompletionDate?: string;

  milestone?: string;

}

export interface ApplicationActionItemExecution {

  startedAt?: string;

  completedAt?: string;

  completionSummary?: string;

  verificationRequired: boolean;

  verifiedBy?: string;

  verifiedAt?: string;

}

export interface ApplicationActionItemMetadata {

  title: string;

  description?: string;

  acceptanceCriteria?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationActionItem {

  id: string;

  code: string;

  status: ApplicationActionItemStatus;

  type: ApplicationActionItemType;

  scope: ApplicationActionItemScope;

  ownership: ApplicationActionItemOwnership;

  planning: ApplicationActionItemPlanning;

  execution: ApplicationActionItemExecution;

  metadata: ApplicationActionItemMetadata;

  createdAt: string;

  updatedAt: string;

}