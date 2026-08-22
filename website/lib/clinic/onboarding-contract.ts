import { type ClinicOwnerAccount, validateClinicOwnerAccount } from "./owner-account";

export interface ClinicOnboardingPayload {
  name: string;
  slug: string;
  country: string;
  timezone: string;
  currency: string;
  status: "draft" | "active" | "inactive";
  email: string;
  phone: string;
  emergencyPhone?: string;
  ownerAccount: ClinicOwnerAccount;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  businessHours: Record<string, { enabled: boolean; open: string; close: string }>;
  aiSettings: {
    enabled: boolean; language: string; voice: string; greeting: string;
    appointmentBooking: boolean; appointmentCancellation: boolean;
    appointmentRescheduling: boolean; humanHandoff: boolean;
    afterHoursMode: "voicemail" | "take-message" | "emergency-forward";
    transcriptStorage: boolean; callRecording: boolean;
  };
}

export const INDIA_CLINIC_DEFAULTS = {
  country: "India", timezone: "Asia/Kolkata", currency: "INR", language: "bilingual-auto",
} as const;

export function normalizeClinicSlug(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function validateClinicOnboarding(input: ClinicOnboardingPayload): string | null {
  if (!input || typeof input !== "object") return "Invalid clinic request.";
  if (!input.name.trim()) return "Clinic name is required.";
  if (!normalizeClinicSlug(input.slug)) return "Clinic slug is required.";
  if (!input.country.trim() || !input.timezone.trim()) return "Country and timezone are required.";
  if (!input.email.trim() || !/^\S+@\S+\.\S+$/.test(input.email)) return "A valid clinic email is required.";
  if (!input.phone.trim()) return "Clinic phone is required.";
  if (!input.ownerAccount || typeof input.ownerAccount !== "object") return "Owner account details are required.";
  if (!input.aiSettings || typeof input.aiSettings !== "object") return "AI receptionist settings are required.";
  if (!input.businessHours || typeof input.businessHours !== "object") return "Business hours are required.";
  const ownerError = validateClinicOwnerAccount(input.ownerAccount);
  if (ownerError) return ownerError;
  if (!input.addressLine1.trim() || !input.city.trim() || !input.state.trim() || !input.postalCode.trim()) return "Complete the required address fields.";
  if (!input.aiSettings.language?.trim() || !input.aiSettings.voice?.trim()) return "AI language and voice are required.";
  if (input.aiSettings.afterHoursMode === "emergency-forward" && !input.emergencyPhone?.trim()) return "An escalation phone is required for emergency forwarding.";
  return null;
}
