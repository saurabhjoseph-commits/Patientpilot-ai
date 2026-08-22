/**
 * ============================================================
 * PatientPilot AI
 * Call Summary Types
 * ============================================================
 */

export type SummaryOutcome =
  | "appointment_created"
  | "appointment_requested"
  | "rescheduled"
  | "cancelled"
  | "information_only"
  | "transferred"
  | "incomplete"
  | "unknown";

export interface CallSummary {
  id: string;

  clinicId: string;

  callId: string;

  callSid: string;

  clinicName: string;

  patientName?: string;

  phoneNumber?: string;

  intent: string;

  outcome: SummaryOutcome;

  summary: string;

  actionItems: string[];

  appointmentId?: string;

  patientId?: string;

  confidence: number;

  durationSeconds?: number;

  createdAt: string;

  updatedAt: string;
}

/**
 * Used when creating a summary.
 */
export interface CreateSummaryInput {
  clinicId: string;

  callId: string;

  callSid: string;

  clinicName: string;

  patientName?: string;

  phoneNumber?: string;

  intent: string;

  outcome: SummaryOutcome;

  summary: string;

  actionItems?: string[];

  appointmentId?: string;

  patientId?: string;

  confidence?: number;

  durationSeconds?: number;
}

/**
 * Update an existing summary.
 */
export interface UpdateSummaryInput {
  patientName?: string;

  phoneNumber?: string;

  intent?: string;

  outcome?: SummaryOutcome;

  summary?: string;

  actionItems?: string[];

  appointmentId?: string;

  patientId?: string;

  confidence?: number;

  durationSeconds?: number;
}

/**
 * Search filters.
 */
export interface SummaryFilters {
  clinicId: string;

  callSid?: string;

  patientName?: string;

  phoneNumber?: string;

  outcome?: SummaryOutcome;

  clinicName?: string;
}

/**
 * Dashboard statistics.
 */
export interface SummaryStats {
  total: number;

  appointmentsCreated: number;

  appointmentsRequested: number;

  transferred: number;

  incomplete: number;

  averageConfidence: number;
}
