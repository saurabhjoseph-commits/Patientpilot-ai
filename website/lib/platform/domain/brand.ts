/**
 * PP-002 Milestone C
 * Global Brand Domain
 *
 * Represents a customer-facing
 * brand owned by an organization.
 */

export type BrandStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type BrandType =
  | "corporate"
  | "consumer"
  | "franchise"
  | "white_label"
  | "regional"
  | "partner";

export interface BrandIdentity {

  organizationId: string;

  legalName?: string;

  displayName: string;

  shortName?: string;

  slogan?: string;

}

export interface BrandAssets {

  logoUrl?: string;

  faviconUrl?: string;

  primaryColor?: string;

  secondaryColor?: string;

  accentColor?: string;

}

export interface BrandLocalization {

  defaultLanguage: string;

  supportedLanguages: string[];

  defaultCurrency: string;

  timeZone?: string;

}

export interface BrandChannels {

  website?: string;

  supportEmail?: string;

  supportPhone?: string;

  socialLinks: Record<string, string>;

}

export interface BrandMetadata {

  description?: string;

  tags: string[];

}

export interface Brand {

  id: string;

  code: string;

  status: BrandStatus;

  type: BrandType;

  identity: BrandIdentity;

  assets: BrandAssets;

  localization: BrandLocalization;

  channels: BrandChannels;

  metadata: BrandMetadata;

  createdAt: string;

  updatedAt: string;

}