/**
 * PP-002 Milestone C
 * Global Application Version Domain
 *
 * Immutable software release definition.
 */

export type ApplicationVersionStatus =
  | "draft"
  | "released"
  | "deprecated"
  | "retired";

export type ApplicationVersionReleaseType =
  | "major"
  | "minor"
  | "patch"
  | "hotfix"
  | "preview"
  | "beta"
  | "release_candidate";

export interface ApplicationVersionIdentity {

  version: string;

  buildNumber?: string;

  commitHash?: string;

}

export interface ApplicationVersionCompatibility {

  minimumPlatformVersion?: string;

  minimumDatabaseVersion?: string;

  supportedEnvironments: (
    | "development"
    | "testing"
    | "qa"
    | "staging"
    | "production"
  )[];

}

export interface ApplicationVersionRelease {

  releaseType: ApplicationVersionReleaseType;

  releasedBy?: string;

  releasedAt?: string;

  releaseNotes?: string;

}

export interface ApplicationVersionArtifacts {

  artifactId?: string;

  checksum?: string;

  containerImage?: string;

  packageUrl?: string;

}

export interface ApplicationVersionMetadata {

  tags: string[];

}

export interface ApplicationVersion {

  id: string;

  applicationId: string;

  status: ApplicationVersionStatus;

  identity: ApplicationVersionIdentity;

  compatibility: ApplicationVersionCompatibility;

  release: ApplicationVersionRelease;

  artifacts: ApplicationVersionArtifacts;

  metadata: ApplicationVersionMetadata;

  createdAt: string;

  updatedAt: string;

}