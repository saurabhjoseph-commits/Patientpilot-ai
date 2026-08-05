/**
 * PP-002 Milestone A
 * Global Clinic Domain
 *
 * Represents a dental clinic within a tenant.
 * All operational modules are configured from this entity.
 */

export type ClinicStatus =
  | "active"
  | "inactive"
  | "trial"
  | "suspended";

export interface ClinicAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface ClinicContact {
  phone: string;
  emergencyPhone?: string;
  email: string;
  website?: string;
}

export interface ClinicLocale {
  country: string;
  timezone: string;
  locale: string;
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  measurementSystem: "metric" | "imperial";
  supportedLanguages: string[];
}

export interface BusinessHours {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  isOpen: boolean;

  openTime?: string;

  closeTime?: string;
}

export interface ClinicAISettings {
  enabled: boolean;

  greeting: string;

  defaultVoice: string;

  personality: string;

  allowAppointmentBooking: boolean;

  allowRescheduling: boolean;

  allowCancellations: boolean;

  fallbackToHuman: boolean;
}

export interface ClinicCommunicationSettings {
  phoneProvider?: string;

  smsProvider?: string;

  emailProvider?: string;

  whatsappProvider?: string;
}

export interface Clinic {

  id: string;

  tenantId: string;

  name: string;

  legalName?: string;

  status: ClinicStatus;

  address: ClinicAddress;

  contact: ClinicContact;

  locale: ClinicLocale;

  businessHours: BusinessHours[];

  ai: ClinicAISettings;

  communication: ClinicCommunicationSettings;

  createdAt: string;

  updatedAt: string;

}