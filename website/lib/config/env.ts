// lib/config/env.ts

export const env = {
  // Public (browser + server)
  SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL!,

  SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

  // Server only
  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY!,

  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY ?? "",

  TWILIO_ACCOUNT_SID:
    process.env.TWILIO_ACCOUNT_SID ?? "",

  TWILIO_AUTH_TOKEN:
    process.env.TWILIO_AUTH_TOKEN ?? "",

  TWILIO_PHONE_NUMBER:
    process.env.TWILIO_PHONE_NUMBER ?? "",

  NODE_ENV:
    process.env.NODE_ENV ?? "development",
};