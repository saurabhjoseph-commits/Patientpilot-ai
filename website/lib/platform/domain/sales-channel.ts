/**
 * PP-002 Milestone C
 * Global Sales Channel Domain
 *
 * Defines where commercial transactions
 * originate across the platform.
 */

export type SalesChannelStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type SalesChannelType =
  | "direct"
  | "website"
  | "partner"
  | "reseller"
  | "marketplace"
  | "franchise"
  | "affiliate"
  | "inside_sales"
  | "field_sales"
  | "api";

export interface SalesChannelScope {

  tenantId?: string;

  countryCodes: string[];

  currencies: string[];

  languages: string[];

}

export interface SalesChannelCapabilities {

  supportsSelfService: boolean;

  supportsSubscriptions: boolean;

  supportsTrials: boolean;

  supportsCoupons: boolean;

  supportsNegotiatedPricing: boolean;

}

export interface SalesChannelConfiguration {

  catalogIds: string[];

  offerIds: string[];

  priceBookIds: string[];

  integrationIds: string[];

}

export interface SalesChannelMetadata {

  description?: string;

  owner?: string;

  tags: string[];

}

export interface SalesChannel {

  id: string;

  code: string;

  name: string;

  status: SalesChannelStatus;

  type: SalesChannelType;

  scope: SalesChannelScope;

  capabilities: SalesChannelCapabilities;

  configuration: SalesChannelConfiguration;

  metadata: SalesChannelMetadata;

  createdAt: string;

  updatedAt: string;

}