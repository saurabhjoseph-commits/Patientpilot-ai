/**
 * PP-002 Milestone A
 * Platform Domain
 *
 * Root entity for every organization using PatientPilot AI.
 */

export type TenantStatus =
  | "active"
  | "trial"
  | "suspended"
  | "inactive";

export interface TenantBranding {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface TenantSettings {
  defaultCountry: string;
  defaultTimezone: string;
  defaultLocale: string;
  defaultCurrency: string;
  supportedLanguages: string[];
}

export interface Tenant {

  id: string;

  name: string;

  slug: string;

  status: TenantStatus;

  branding: TenantBranding;

  settings: TenantSettings;

  createdAt: string;

  updatedAt: string;

}