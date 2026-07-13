/**
 * ============================================================
 * PatientPilot AI
 * Shared Types
 * ============================================================
 */

/**
 * Conversation lifecycle.
 */
export type AIConversationState =
  | "idle"
  | "greeting"
  | "collecting_name"
  | "collecting_phone"
  | "collecting_reason"
  | "collecting_date"
  | "confirming"
  | "completed"
  | "handoff"
  | "ended";

/**
 * Intent detected from the caller.
 */
export type AIIntent =
  | "unknown"
  | "book_appointment"
  | "reschedule_appointment"
  | "cancel_appointment"
  | "office_hours"
  | "insurance"
  | "pricing"
  | "emergency"
  | "general_question"
  | "human_agent";

/**
 * Conversation message.
 */
export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Appointment information extracted during the call.
 */
export interface AppointmentData {
  patientName?: string;
  phoneNumber?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  reason?: string;
}

/**
 * Active AI conversation.
 */
export interface AIConversationSession {
  callSid: string;

  state: AIConversationState;

  intent: AIIntent;

  messages: AIMessage[];

  appointment: AppointmentData;

  createdAt: string;

  updatedAt: string;
}

/**
 * Request sent to the OpenAI client.
 */
export interface GenerateResponseParams {
  session: AIConversationSession;

  userMessage: string;
}

/**
 * AI response returned from OpenAI.
 */
export interface AIResponse {
  /**
   * Text that Twilio will speak.
   */
  message: string;

  /**
   * Updated conversation state.
   */
  state?: AIConversationState;

  /**
   * Detected caller intent.
   */
  intent?: AIIntent;

  /**
   * Extracted appointment information.
   */
  appointment?: Partial<AppointmentData>;

  /**
   * End the phone call after this response.
   */
  shouldHangup?: boolean;
}

/**
 * OpenAI token usage.
 */
export interface TokenUsage {
  inputTokens: number;

  outputTokens: number;

  totalTokens: number;
}

/**
 * Result returned from the AI client.
 */
export interface AICompletionResult {
  response: AIResponse;

  usage: TokenUsage;
}