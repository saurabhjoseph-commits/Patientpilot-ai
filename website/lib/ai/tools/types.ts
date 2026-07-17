// website/lib/ai/tools/types.ts

export type AIToolName =
  | "appointment.create"
  | "patient.createOrUpdate"
  | "lead.create";

export interface ToolContext {
  /**
   * Current call identifier.
   */
  callId: string;

  /**
   * Reserved for future multi-tenant support.
   */
  tenantId?: string;

  /**
   * Reserved for structured logging / tracing.
   */
  correlationId?: string;
}

export interface ToolResult<T = unknown> {
  success: boolean;

  data?: T;

  message: string;

  followUp?: {
    nextState?: string;
    shouldSpeak?: boolean;
    shouldHangup?: boolean;
  };
}