/**
 * ============================================================
 * PatientPilot AI
 * Contact Preference Domain Types
 * ============================================================
 */

export type CommunicationChannel =
  | "email"
  | "sms"
  | "phone"
  | "whatsapp"
  | "push"
  | "postal_mail";

export type ContactTimePreference =
  | "anytime"
  | "morning"
  | "afternoon"
  | "evening";

export type LanguagePreference =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "hi"
  | "ar"
  | "zh"
  | "ja";

export type ConsentStatus =
  | "granted"
  | "declined"
  | "withdrawn"
  | "pending";

export type CommunicationPurpose =
  | "appointment"
  | "treatment"
  | "billing"
  | "marketing"
  | "survey"
  | "recall"
  | "follow_up"
  | "general";

export interface ChannelPreference {
  channel: CommunicationChannel;

  enabled: boolean;

  verified: boolean;

  primary: boolean;
}

export interface ConsentPreference {
  purpose: CommunicationPurpose;

  status: ConsentStatus;

  grantedAt?: Date;

  withdrawnAt?: Date;

  source?: string;
}

export interface AICommunicationPreference {
  allowAIVoiceCalls: boolean;

  allowAIChat: boolean;

  allowAISMS: boolean;

  allowAIEmail: boolean;

  allowAIAppointmentScheduling: boolean;
}

export interface ContactPreference {
  id: string;

  tenantId: string;

  customerId: string;

  preferredLanguage: LanguagePreference;

  preferredChannels: ChannelPreference[];

  preferredContactTime: ContactTimePreference;

  timezone: string;

  consents: ConsentPreference[];

  ai: AICommunicationPreference;

  doNotDisturb: boolean;

  doNotDisturbStart?: string;

  doNotDisturbEnd?: string;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}