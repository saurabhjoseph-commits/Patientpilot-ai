/**
 * PP-004 Communication & Engagement Domain
 *
 * Aggregate root representing
 * a communication campaign.
 *
 * Campaigns coordinate outreach
 * to multiple recipients using
 * reminders and notifications.
 */

export type CampaignCategory =
  | "recall"
  | "reactivation"
  | "marketing"
  | "promotion"
  | "education"
  | "review_request"
  | "follow_up"
  | "announcement"
  | "survey"
  | "custom";

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "cancelled"
  | "archived";

export type CampaignAudienceType =
  | "patients"
  | "leads"
  | "customers"
  | "providers"
  | "staff"
  | "custom";

export interface CampaignAudience {

  type: CampaignAudienceType;

  segmentId?: string;

  estimatedRecipients?: number;

}

export interface CampaignSchedule {

  startAt: string;

  endAt?: string;

  timezone: string;

}

export interface CampaignContent {

  notificationTemplateId: string;

  reminderTemplateId?: string;

}

export interface CampaignExecution {

  remindersCreated: number;

  notificationsCreated: number;

  completedRecipients: number;

  failedRecipients: number;

}

export interface CampaignMetadata {

  description?: string;

  externalId?: string;

}

export interface Campaign {

  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  category: CampaignCategory;

  status: CampaignStatus;

  audience: CampaignAudience;

  schedule: CampaignSchedule;

  content: CampaignContent;

  execution: CampaignExecution;

  metadata: CampaignMetadata;

  createdAt: string;

  updatedAt: string;

}