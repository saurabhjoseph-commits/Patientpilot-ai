/**
 * PP-002 Milestone C
 * Global Territory Domain
 *
 * Defines reusable geographic
 * territories used throughout
 * the commercial platform.
 */

export type TerritoryStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type TerritoryType =
  | "global"
  | "continent"
  | "country"
  | "state"
  | "province"
  | "region"
  | "city"
  | "postal_zone"
  | "sales_region"
  | "service_area";

export interface TerritoryHierarchy {

  parentTerritoryId?: string;

  level: number;

}

export interface TerritoryCoverage {

  countryCode?: string;

  stateCode?: string;

  regionCode?: string;

  city?: string;

  postalCodes: string[];

}

export interface TerritoryLocalization {

  currencyCodes: string[];

  languageCodes: string[];

  timeZone?: string;

}

export interface TerritoryCapabilities {

  supportsSales: boolean;

  supportsService: boolean;

  supportsMarketing: boolean;

  supportsBilling: boolean;

}

export interface TerritoryMetadata {

  description?: string;

  tags: string[];

}

export interface Territory {

  id: string;

  code: string;

  name: string;

  status: TerritoryStatus;

  type: TerritoryType;

  hierarchy: TerritoryHierarchy;

  coverage: TerritoryCoverage;

  localization: TerritoryLocalization;

  capabilities: TerritoryCapabilities;

  metadata: TerritoryMetadata;

  createdAt: string;

  updatedAt: string;

}