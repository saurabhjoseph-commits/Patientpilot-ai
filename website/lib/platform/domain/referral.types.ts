/**
 * ============================================================
 * PatientPilot AI
 * Referral Domain Types
 * ============================================================
 */

export type ReferralStatus =
  | "pending"
  | "invited"
  | "registered"
  | "qualified"
  | "converted"
  | "rewarded"
  | "cancelled"
  | "expired";

export type ReferralSource =
  | "patient"
  | "staff"
  | "dentist"
  | "website"
  | "email"
  | "sms"
  | "whatsapp"
  | "social"
  | "campaign"
  | "other";

export interface ReferralReferrer {
  customerId: string;

  name?: string;

  email?: string;

  phone?: string;
}

export interface ReferralRecipient {
  leadId?: string;

  customerId?: string;

  name?: string;

  email?: string;

  phone?: string;
}

export interface ReferralCampaign {
  id?: string;

  name?: string;

  source: ReferralSource;
}

export interface ReferralConversion {
  qualified: boolean;

  converted: boolean;

  qualifiedAt?: Date;

  convertedAt?: Date;

  firstAppointmentId?: string;

  dealId?: string;
}

export interface Referral {
  id: string;

  tenantId: string;

  referrer: ReferralReferrer;

  recipient: ReferralRecipient;

  campaign: ReferralCampaign;

  conversion: ReferralConversion;

  status: ReferralStatus;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}