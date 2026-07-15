// components/demo/live/types.ts

export type DemoState =
  | "idle"
  | "playing"
  | "paused"
  | "completed";

export type DemoStage =
  | "idle"
  | "ringing"
  | "connected"
  | "conversation"
  | "thinking"
  | "booking"
  | "crm_update"
  | "completed";

export type Speaker =
  | "ai"
  | "patient"
  | "system";

export type ScenarioType =
  | "new-patient"
  | "emergency"
  | "insurance"
  | "existing-patient"
  | "recall"
  | "reschedule"
  | "cosmetic";

export interface ConversationMessage {
  id: string;

  speaker: Speaker;

  text: string;

  timestamp: string;

  /**
   * Delay (milliseconds) before advancing
   * to the next message.
   */
  delay: number;

  typing?: boolean;

  emotion?: "neutral" | "happy" | "urgent";

  audioUrl?: string;
}

export interface AIAnalysis {
  intent: string;

  confidence: number;

  insurance?: string;

  procedure?: string;

  urgency: "Low" | "Medium" | "High";

  nextAction: string;

  sentiment:
    | "Positive"
    | "Neutral"
    | "Concerned";
}

export interface Appointment {
  patientName: string;

  dentist: string;

  procedure: string;

  date: string;

  time: string;

  confirmationSent: boolean;
}

export interface CRMEvent {
  id: string;

  title: string;

  description: string;

  completed: boolean;

  timestamp: string;
}

export interface DemoScenario {
  id: ScenarioType;

  title: string;

  description: string;

  patientName: string;

  callerPhone: string;

  messages: ConversationMessage[];

  analysis: AIAnalysis;

  appointment: Appointment;

  crmEvents: CRMEvent[];
}

export interface DemoContextValue {
  /**
   * Engine lifecycle
   */
  state: DemoState;

  /**
   * Current business stage
   */
  stage: DemoStage;

  /**
   * Selected demo scenario
   */
  scenario: DemoScenario;

  /**
   * Current conversation position
   */
  currentMessageIndex: number;

  currentMessage?: ConversationMessage;

  /**
   * Messages currently revealed
   */
  visibleMessages: ConversationMessage[];

  /**
   * Overall progress (0-100)
   */
  progress: number;

  /**
   * Elapsed call duration
   */
  elapsedSeconds: number;

  /**
   * Playback status
   */
  isPlaying: boolean;

  isPaused: boolean;

  isCompleted: boolean;

  /**
   * Demo controls
   */
  startDemo: () => void;

  pauseDemo: () => void;

  resumeDemo: () => void;

  restartDemo: () => void;

  stopDemo: () => void;

  nextMessage: () => void;

  completeDemo: () => void;

  /**
   * Scenario selection
   */
  setScenario: (
    scenario: DemoScenario
  ) => void;
}