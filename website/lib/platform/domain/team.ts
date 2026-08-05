/**
 * PP-002 Milestone B
 * Global Team Domain
 *
 * Represents an organizational team within
 * a tenant or clinic.
 */

export type TeamStatus =
  | "active"
  | "inactive";

export type TeamType =
  | "administration"
  | "front_office"
  | "clinical"
  | "billing"
  | "insurance"
  | "marketing"
  | "support"
  | "ai"
  | "custom";

export interface TeamMetadata {

  description?: string;

  managerUserId?: string;

  color?: string;

}

export interface Team {

  id: string;

  tenantId: string;

  clinicId?: string;

  status: TeamStatus;

  type: TeamType;

  name: string;

  displayName: string;

  metadata: TeamMetadata;

  createdAt: string;

  updatedAt: string;

}