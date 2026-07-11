// ======================================================
// PatientPilot AI CRM Types
// ======================================================

/**
 * Lead Status values
 */
export type LeadStatus =
  | "New"
  | "Contacted"
  | "Demo Scheduled"
  | "Demo Completed"
  | "Lost";

/**
 * Activity Types
 */
export type ActivityType =
  | "Status"
  | "Notes"
  | "Contact"
  | "Demo"
  | "Patient"
  | "Email"
  | "Call";

/**
 * Lead (contacts table)
 */
export interface Lead {
  id: number;

  clinic_name: string;

  dentist_name: string;

  email: string;

  phone: string;

  monthly_calls: string;

  message: string | null;

  status: LeadStatus;

  notes: string | null;

  contacted_at: string | null;

  demo_date: string | null;

  converted: boolean;

  clinic_id: string | null;

  created_at: string;

  updated_at: string | null;
}

/**
 * Lead Activity (lead_activity table)
 */
export interface LeadActivity {
  id: number;

  lead_id: number;

  type: ActivityType;

  description: string;

  created_at: string;
}

/**
 * Standard API Success Response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Standard API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * Notes API Request
 */
export interface SaveNotesRequest {
  leadId: number;
  notes: string;
}

/**
 * Quick Actions API Request
 */
export interface QuickActionRequest {
  leadId: number;

  action:
    | "contacted"
    | "schedule-demo"
    | "convert";

  demoDate?: string;
}