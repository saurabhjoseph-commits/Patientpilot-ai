/**
 * PP-002 Milestone A
 * Global Settings Domain
 *
 * Represents configurable platform settings
 * for a tenant or clinic.
 */

export interface AISettings {

  enabled: boolean;

  provider: string;

  model: string;

  language: string;

  voiceEnabled: boolean;

  autoRespond: boolean;

}

export interface CommunicationSettings {

  defaultLanguage: string;

  timezone: string;

  emailEnabled: boolean;

  smsEnabled: boolean;

  voiceEnabled: boolean;

  whatsappEnabled: boolean;

}

export interface SchedulingSettings {

  appointmentIntervalMinutes: number;

  minimumBookingNoticeHours: number;

  maximumBookingDays: number;

  allowOnlineBooking: boolean;

  allowCancellation: boolean;

  allowRescheduling: boolean;

}

export interface BrandingSettings {

  clinicName: string;

  logoUrl?: string;

  primaryColor?: string;

  secondaryColor?: string;

}

export interface LocalizationSettings {

  country: string;

  currency: string;

  dateFormat: string;

  timeFormat: "12h" | "24h";

}

export interface FeatureFlags {

  values: Record<string, boolean>;

}

export interface SettingsMetadata {

  version: number;

  lastUpdatedBy?: string;

}

export interface Settings {

  id: string;

  tenantId: string;

  clinicId?: string;

  ai: AISettings;

  communication: CommunicationSettings;

  scheduling: SchedulingSettings;

  branding: BrandingSettings;

  localization: LocalizationSettings;

  features: FeatureFlags;

  metadata: SettingsMetadata;

  createdAt: string;

  updatedAt: string;

}