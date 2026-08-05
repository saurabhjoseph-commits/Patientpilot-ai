/**
 * PP-002 Milestone B
 * Global Team Member Domain
 *
 * Represents the assignment of a user
 * to an organizational team.
 */

export type TeamMemberStatus =
  | "active"
  | "inactive"
  | "expired"
  | "removed";

export interface TeamMemberMetadata {

  title?: string;

  isPrimary: boolean;

  isTeamLead: boolean;

  assignedBy?: string;

  notes?: string;

}

export interface TeamMember {

  id: string;

  tenantId: string;

  clinicId?: string;

  teamId: string;

  userId: string;

  status: TeamMemberStatus;

  effectiveFrom?: string;

  effectiveUntil?: string;

  metadata: TeamMemberMetadata;

  createdAt: string;

  updatedAt: string;

}