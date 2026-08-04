/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents an addressable endpoint
 * belonging to a communication channel.
 */

export type ChannelEndpointStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "retired";

export type ChannelEndpointType =
  | "phone_number"
  | "email_address"
  | "whatsapp_number"
  | "messenger_page"
  | "instagram_account"
  | "web_widget"
  | "api_endpoint"
  | "custom";

export interface ChannelEndpointAddress {

  value: string;

  displayName?: string;

  countryCode?: string;

}

export interface ChannelEndpointRouting {

  isDefault: boolean;

  priority: number;

  businessHoursOnly: boolean;

}

export interface ChannelEndpointCapabilities {

  supportsInbound: boolean;

  supportsOutbound: boolean;

  supportsVoice?: boolean;

  supportsMessaging?: boolean;

  supportsMedia?: boolean;

}

export interface ChannelEndpointMetadata {

  description?: string;

  tags: string[];

}

export interface ChannelEndpoint {

  id: string;

  tenantId: string;

  channelId: string;

  name: string;

  type: ChannelEndpointType;

  status: ChannelEndpointStatus;

  address: ChannelEndpointAddress;

  routing: ChannelEndpointRouting;

  capabilities: ChannelEndpointCapabilities;

  metadata: ChannelEndpointMetadata;

  createdAt: string;

  updatedAt: string;

}