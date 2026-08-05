/**
 * PP-002 Milestone C
 * Global Application Endpoint Domain
 *
 * Defines externally or internally
 * exposed interfaces of an application.
 */

export type ApplicationEndpointStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type ApplicationEndpointType =
  | "rest"
  | "graphql"
  | "grpc"
  | "websocket"
  | "webhook"
  | "health"
  | "metrics"
  | "admin"
  | "custom";

export type ApplicationEndpointVisibility =
  | "public"
  | "internal"
  | "private";

export interface ApplicationEndpointIdentity {

  name: string;

  path: string;

  version?: string;

}

export interface ApplicationEndpointNetwork {

  protocol:
    | "http"
    | "https"
    | "ws"
    | "wss"
    | "grpc";

  method?:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "OPTIONS";

  port?: number;

}

export interface ApplicationEndpointSecurity {

  authenticationRequired: boolean;

  authorizationRequired: boolean;

  apiKeySupported: boolean;

  rateLimited: boolean;

}

export interface ApplicationEndpointBehavior {

  idempotent: boolean;

  timeoutSeconds?: number;

  supportsStreaming: boolean;

}

export interface ApplicationEndpointMetadata {

  description?: string;

  documentationUrl?: string;

  tags: string[];

}

export interface ApplicationEndpoint {

  id: string;

  applicationId: string;

  status: ApplicationEndpointStatus;

  type: ApplicationEndpointType;

  visibility: ApplicationEndpointVisibility;

  identity: ApplicationEndpointIdentity;

  network: ApplicationEndpointNetwork;

  security: ApplicationEndpointSecurity;

  behavior: ApplicationEndpointBehavior;

  metadata: ApplicationEndpointMetadata;

  createdAt: string;

  updatedAt: string;

}