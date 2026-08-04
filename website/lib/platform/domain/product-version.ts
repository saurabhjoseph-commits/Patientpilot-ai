/**
 * PP-002 Milestone C
 * Global Product Version Domain
 *
 * Defines immutable versions of
 * commercial products.
 */

export type ProductVersionStatus =
  | "draft"
  | "published"
  | "deprecated"
  | "retired"
  | "archived";

export type ProductVersionReleaseType =
  | "major"
  | "minor"
  | "patch"
  | "hotfix";

export interface ProductVersionNumber {

  major: number;

  minor: number;

  patch: number;

  build?: string;

}

export interface ProductVersionCompatibility {

  upgradeFrom: string[];

  downgradeTo: string[];

  migrationRequired: boolean;

}

export interface ProductVersionAvailability {

  countries?: string[];

  releasedAt: string;

  retiredAt?: string;

}

export interface ProductVersionMetadata {

  description?: string;

  releaseNotes?: string;

  createdBy?: string;

  tags: string[];

}

export interface ProductVersion {

  id: string;

  productId: string;

  code: string;

  status: ProductVersionStatus;

  releaseType: ProductVersionReleaseType;

  version: ProductVersionNumber;

  compatibility: ProductVersionCompatibility;

  availability: ProductVersionAvailability;

  metadata: ProductVersionMetadata;

  createdAt: string;

  updatedAt: string;

}