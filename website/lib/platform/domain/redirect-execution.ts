/**
 * PP-002 Milestone C
 * Global Redirect Execution Domain
 *
 * Runtime execution record for
 * Redirect Rules.
 */

export type RedirectExecutionStatus =
  | "matched"
  | "redirected"
  | "rewritten"
  | "skipped"
  | "failed";

export interface RedirectExecutionRequest {

  hostname: string;

  path: string;

  method: string;

  queryString?: string;

  ipAddress?: string;

  userAgent?: string;

  country?: string;

  language?: string;

  device?: "desktop" | "tablet" | "mobile";

}

export interface RedirectExecutionResponse {

  destinationUrl: string;

  statusCode: number;

  redirected: boolean;

}

export interface RedirectExecutionPerformance {

  executionTimeMs: number;

  evaluatedRules: number;

}

export interface RedirectExecutionResult {

  success: boolean;

  reason?: string;

}

export interface RedirectExecutionMetadata {

  traceId?: string;

  tags: string[];

}

export interface RedirectExecution {

  id: string;

  tenantId?: string;

  redirectRuleId: string;

  status: RedirectExecutionStatus;

  request: RedirectExecutionRequest;

  response: RedirectExecutionResponse;

  performance: RedirectExecutionPerformance;

  result: RedirectExecutionResult;

  metadata: RedirectExecutionMetadata;

  executedAt: string;

}