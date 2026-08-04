/**
 * PP-002 Milestone C
 * Global Application Notification Channel Domain
 *
 * Reusable notification destination
 * definition for operational events.
 */

export type ApplicationNotificationChannelStatus =
  | "draft"
  | "active"
  | "disabled"
  | "deprecated";

export type ApplicationNotificationChannelType =
  | "email"
  | "sms"
  | "slack"
  | "microsoft_teams"
  | "discord"
  | "webhook"
  | "pagerduty"
  | "opsgenie"
  | "push"
  | "in_app"
  | "custom";

export interface ApplicationNotificationChannelIdentity {

  name: string;

  description?: string;

}

export interface ApplicationNotificationChannelConfiguration {

  endpoint: string;

  authenticationType?:
    | "none"
    | "basic"
    | "bearer"
    | "api_key"
    | "oauth2";

  authenticationReferenceId?: string;

}

export interface ApplicationNotificationChannelCapabilities {

  supportsRetry: boolean;

  supportsBatching: boolean;

  supportsRichContent: boolean;

  supportsAttachments: boolean;

}

export interface ApplicationNotificationChannelBehavior {

  enabled: boolean;

  defaultChannel: boolean;

  priority: number;

}

export interface ApplicationNotificationChannelMetadata {

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationNotificationChannel {

  id: string;

  applicationId: string;

  code: string;

  status: ApplicationNotificationChannelStatus;

  type: ApplicationNotificationChannelType;

  identity: ApplicationNotificationChannelIdentity;

  configuration: ApplicationNotificationChannelConfiguration;

  capabilities: ApplicationNotificationChannelCapabilities;

  behavior: ApplicationNotificationChannelBehavior;

  metadata: ApplicationNotificationChannelMetadata;

  createdAt: string;

  updatedAt: string;

}