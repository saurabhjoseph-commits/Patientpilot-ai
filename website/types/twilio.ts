/**
 * Common Twilio call lifecycle statuses.
 */
export type TwilioCallStatus =
  | "queued"
  | "initiated"
  | "ringing"
  | "in-progress"
  | "completed"
  | "busy"
  | "failed"
  | "no-answer"
  | "canceled";

/**
 * Call direction.
 */
export type TwilioCallDirection =
  | "inbound"
  | "outbound-api"
  | "outbound-dial"
  | "trunking-originating"
  | "trunking-terminating";

/**
 * Incoming Voice Webhook payload.
 */
export interface TwilioVoiceWebhook {
  AccountSid: string;
  ApiVersion: string;
  CallSid: string;
  CallStatus: TwilioCallStatus | string;
  Direction: TwilioCallDirection | string;
  From: string;
  To: string;
  Caller?: string;
  Called?: string;
  CallerCountry?: string;
  CallerState?: string;
  CallerCity?: string;
  CallerZip?: string;
  CallerName?: string;
}

/**
 * Status Callback payload.
 */
export interface TwilioStatusCallback {
  AccountSid: string;
  ApiVersion: string;
  CallSid: string;
  ParentCallSid?: string;
  CallStatus: TwilioCallStatus | string;
  CallDuration?: string;
  Direction: TwilioCallDirection | string;
  From: string;
  To: string;
  AnsweredBy?: string;
}

/**
 * Speech Recognition webhook.
 * (Used in B4.2/B4.3)
 */
export interface TwilioSpeechResult {
  SpeechResult: string;
  Confidence?: string;
  CallSid: string;
  From: string;
  To: string;
}

/**
 * Internal PatientPilot call model.
 * This is what we'll eventually save to Supabase.
 */
export interface PatientPilotCall {
  callSid: string;
  accountSid: string;

  from: string;
  to: string;

  status: TwilioCallStatus | string;
  direction: TwilioCallDirection | string;

  duration?: number;

  startedAt: string;
  endedAt?: string;

  transcript?: string;
  summary?: string;
  recordingUrl?: string;

  sentiment?: "positive" | "neutral" | "negative";

  appointmentBooked?: boolean;

  callerName?: string;
  clinicId?: string;
}

/**
 * Live dashboard event.
 */
export interface LiveCallEvent {
  type:
    | "incoming"
    | "ringing"
    | "connected"
    | "transcribing"
    | "completed"
    | "failed";

  callSid: string;

  timestamp: string;

  payload?: unknown;
}