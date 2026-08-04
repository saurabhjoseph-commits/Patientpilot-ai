/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Core Common Types
 * ============================================================
 */

export type UUID = string;

export type ISODate = string;

export type Timestamp = string;

export type CountryCode =
  | "IN"
  | "US"
  | "AU";

export type Channel =
  | "phone"
  | "whatsapp"
  | "website"
  | "sms"
  | "email";

export type Environment =
  | "development"
  | "staging"
  | "production";

export type Locale =
  | "en-IN"
  | "en-US"
  | "en-AU";

export type Currency =
  | "INR"
  | "USD"
  | "AUD";

export type EntityStatus =
  | "active"
  | "inactive"
  | "archived";

export type MessageDirection =
  | "incoming"
  | "outgoing";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface BaseEntity {
  id: UUID;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}

export interface TenantEntity extends BaseEntity {
  clinicId: UUID;
}

export interface AuditInfo {
  createdBy?: UUID;

  updatedBy?: UUID;
}