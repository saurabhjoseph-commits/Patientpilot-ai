/**
 * PP-002 Milestone C
 * Global Application Incident Response Domain
 *
 * Operational response and coordination
 * for an application incident.
 */

export type ApplicationIncidentResponseStatus =
  | "pending"
  | "active"
  | "escalated"
  | "monitoring"
  | "completed"
  | "cancelled";

export type ApplicationIncidentResponsePriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type ApplicationIncidentEscalationLevel =
  | "level_1"
  | "level_2"
  | "level_3"
  | "executive";

export interface ApplicationIncidentResponseTeam {

  teamId: string;

  leadUserId?: string;

  responderUserIds: string[];

}

export interface ApplicationIncidentResponseEscalation {

  level: ApplicationIncidentEscalationLevel;

  escalatedBy?: string;

  escalatedTo?: string;

  escalatedAt?: string;

  reason?: string;

}

export interface ApplicationIncidentResponseCommunication {

  notifyCustomers: boolean;

  notifyInternalTeams: boolean;

  notifyExecutives: boolean;

  statusPageEnabled: boolean;

  latestStatusMessage?: string;

}

export interface ApplicationIncidentResponseMitigation {

  workaroundApplied: boolean;

  rollbackPerformed: boolean;

  trafficShiftPerformed: boolean;

  mitigationSummary?: string;

}

export interface ApplicationIncidentResponseTimeline {

  startedAt: string;

  firstResponseAt?: string;

  mitigationStartedAt?: string;

  monitoringStartedAt?: string;

  completedAt?: string;

  durationSeconds?: number;

}

export interface ApplicationIncidentResponseMetadata {

  warRoomUrl?: string;

  conferenceBridge?: string;

  runbookUrl?: string;

  dashboardUrl?: string;

  tags: string[];

}

export interface ApplicationIncidentResponse {

  id: string;

  incidentId: string;

  status: ApplicationIncidentResponseStatus;

  priority: ApplicationIncidentResponsePriority;

  responseTeam: ApplicationIncidentResponseTeam;

  escalation: ApplicationIncidentResponseEscalation;

  communication: ApplicationIncidentResponseCommunication;

  mitigation: ApplicationIncidentResponseMitigation;

  timeline: ApplicationIncidentResponseTimeline;

  metadata: ApplicationIncidentResponseMetadata;

  createdAt: string;

  updatedAt: string;

}