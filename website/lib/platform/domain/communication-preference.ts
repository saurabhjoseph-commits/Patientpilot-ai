/**
 * PP-004 Communication & Engagement Domain
 *
 * Represents communication preferences
 * for a person or organization.
 *
 * Preferences determine whether,
 * when, and how communications
 * should be delivered.
 */

export type CommunicationPreferenceOwnerType =
  | "patient"
  | "lead"
  | "customer"
  | "provider"
  | "staff"
  | "clinic"
  | "organization";

export type CommunicationPreferenceCategory =
  | "appointment"
  | "recall"
  | "treatment"
  | "billing"
  | "marketing"
  | "follow_up"
  | "survey"
  | "notification"
  | "emergency"
  | "system";

export type CommunicationPreferenceChannel =
  | "phone"
  | "sms"
  | "email"
  | "whatsapp"
  | "patient_portal"
  | "mobile_app"
  | "web_chat";

export type CommunicationPreferenceLanguage =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "hi"
  | "zh"
  | "ja"
  | "custom";

export type CommunicationPreferenceStatus =
  | "active"
  | "inactive"
  | "suspended";

export interface CommunicationPreferenceOwner {

  ownerType: CommunicationPreferenceOwnerType;

  ownerId: string;

}

export interface CommunicationPreferenceConsent {

  enabled: boolean;

  consentGivenAt?: string;

  consentExpiresAt?: string;

}

export interface CommunicationPreferenceDelivery {

  preferredChannels: CommunicationPreferenceChannel[];

  preferredLanguage: CommunicationPreferenceLanguage;

  quietHoursStart?: string;

  quietHoursEnd?: string;

  timezone?: string;

}

export interface CommunicationPreferenceMetadata {

  notes?: string;

  externalId?: string;

}

export interface CommunicationPreference {

  id: string;

  tenantId: string;

  clinicId: string;

  category: CommunicationPreferenceCategory;

  status: CommunicationPreferenceStatus;

  owner: CommunicationPreferenceOwner;

  consent: CommunicationPreferenceConsent;

  delivery: CommunicationPreferenceDelivery;

  metadata: CommunicationPreferenceMetadata;

  createdAt: string;

  updatedAt: string;

}