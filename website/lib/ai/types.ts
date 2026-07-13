/**
 * ============================================================
 * PatientPilot AI
 * Shared Types
 * ============================================================
 */

/**
 * ============================================================
 * Conversation Lifecycle
 * ============================================================
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
 * ============================================================
 * Supported Intents
 * ============================================================
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
 * ============================================================
 * Conversation Message
 * ============================================================
 */

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * ============================================================
 * Appointment Information
 * ============================================================
 */

export interface AppointmentData {
  patientName?: string;

  phoneNumber?: string;

  appointmentDate?: string;

  appointmentTime?: string;

  reason?: string;
}

/**
 * ============================================================
 * Active Conversation Session
 * ============================================================
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
 * ============================================================
 * OpenAI Request
 * ============================================================
 */

export interface GenerateResponseParams {
  session: AIConversationSession;

  userMessage: string;
}

/**
 * Backward compatibility.
 */
export type AICompletionRequest = GenerateResponseParams;

/**
 * ============================================================
 * AI Response
 * ============================================================
 */

export interface AIResponse {
  /**
   * Text Twilio will speak.
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
   * End the phone call.
   */
  shouldHangup?: boolean;
}

/**
 * ============================================================
 * Conversation Analysis
 * ============================================================
 */

export interface ConversationAnalysis {
  /**
   * Next state after processing.
   */
  nextState: AIConversationState;

  /**
   * Detected intent.
   */
  intent: AIIntent;

  /**
   * Conversation completed.
   */
  completed: boolean;

  /**
   * Whether the AI should end the call.
   */
  shouldHangup: boolean;

  /**
   * Human transfer required.
   */
  needsHuman: boolean;

  /**
   * Remaining appointment fields.
   */
  missingFields: string[];

  /**
   * Overall confidence (0-100).
   */
  confidence?: number;
}

/**
 * ============================================================
 * OpenAI Token Usage
 * ============================================================
 */

export interface TokenUsage {
  inputTokens: number;

  outputTokens: number;

  totalTokens: number;
}

/**
 * ============================================================
 * AI Completion Result
 * ============================================================
 */

export interface AICompletionResult {
  /**
   * AI response returned to Twilio.
   */
  response: AIResponse;

  /**
   * Conversation analysis.
   */
  analysis: ConversationAnalysis;

  /**
   * OpenAI usage statistics.
   */
  usage: TokenUsage;
}