export type AIState =
  | "ringing"
  | "listening"
  | "thinking"
  | "speaking"
  | "booking"
  | "completed";

export interface TranscriptMessage {
  id: number;
  sender: "ai" | "patient";
  text: string;
  timestamp: string;
}

export interface ActiveCall {
  id: string;

  patientName: string;

  phone: string;

  appointmentType: string;

  preferredDate: string;

  preferredTime: string;

  dentist: string;

  duration: string;

  connectedAt: string;

  priority: "Low" | "Normal" | "High";

  aiState: AIState;

  transcript: TranscriptMessage[];
}