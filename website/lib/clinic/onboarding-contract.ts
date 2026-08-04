export interface ClinicOnboardingPayload {
  name: string;
  slug: string;
  country: string;
  timezone: string;
  currency: string;
  status: "draft" | "active" | "inactive";
  email: string;
  phone: string;
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
    transcriptStorage: boolean; callRecording: boolean;
  };
}

export const INDIA_CLINIC_DEFAULTS = {
  country: "India", timezone: "Asia/Kolkata", currency: "INR", language: "en",
} as const;

export function normalizeClinicSlug(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function validateClinicOnboarding(input: ClinicOnboardingPayload): string | null {
  if (!input.name.trim()) return "Clinic name is required.";
  if (!normalizeClinicSlug(input.slug)) return "Clinic slug is required.";
  if (!input.country.trim() || !input.timezone.trim()) return "Country and timezone are required.";
  if (!input.email.trim() || !/^\S+@\S+\.\S+$/.test(input.email)) return "A valid clinic email is required.";
  if (!input.phone.trim()) return "Clinic phone is required.";
  if (!input.addressLine1.trim() || !input.city.trim() || !input.state.trim() || !input.postalCode.trim()) return "Complete the required address fields.";
  return null;
}
