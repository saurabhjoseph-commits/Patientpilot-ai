/**
 * PP-002 Milestone C
 * Global Application Incident Timeline Domain
 *
 * Immutable chronological timeline entry
 * for an application incident.
 */

export type ApplicationIncidentTimelineEventType =
  | "incident_created"
  | "incident_updated"
  | "incident_acknowledged"
  | "incident_assigned"
  | "incident_escalated"
  | "response_started"
  | "response_updated"
  | "alert_linked"
  | "deployment_linked"
  | "change_linked"
  | "maintenance_linked"
  | "mitigation_started"
  | "mitigation_completed"
  | "rollback_started"
  | "rollback_completed"
  | "communication_sent"
  | "status_page_updated"
  | "service_restored"
  | "incident_resolved"
  | "incident_closed"
  | "custom";

export type ApplicationIncidentTimelineActorType =
  | "system"
  | "user"
  | "team"
  | "automation"
  | "integration";

export interface ApplicationIncidentTimelineActor {

  actorType: ApplicationIncidentTimelineActorType;

  actorId?: string;

  actorName?: string;

}

export interface ApplicationIncidentTimelineReference {

  alertId?: string;

  responseId?: string;

  deploymentExecutionId?: string;

  changeExecutionId?: string;

  maintenanceExecutionId?: string;

  notificationDeliveryId?: string;

}

export interface ApplicationIncidentTimelineDetails {

  title: string;

  description?: string;

  previousValue?: string;

  currentValue?: string;

}

export interface ApplicationIncidentTimelineMetadata {

  traceId?: string;

  correlationId?: string;

  sourceSystem?: string;

  tags: string[];

}

export interface ApplicationIncidentTimeline {

  id: string;

  incidentId: string;

  eventType: ApplicationIncidentTimelineEventType;

  actor: ApplicationIncidentTimelineActor;

  reference: ApplicationIncidentTimelineReference;

  details: ApplicationIncidentTimelineDetails;

  metadata: ApplicationIncidentTimelineMetadata;

  occurredAt: string;

  createdAt: string;

}