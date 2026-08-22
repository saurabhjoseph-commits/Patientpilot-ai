import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REQUIRED_SERVER_CONFIGURATION = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "TWILIO_WEBHOOK_BASE_URL",
  "PUBLIC_INTAKE_CLINIC_ID",
  "TELEPHONY_CLINIC_PHONE_MAP",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "WEBHOOK_CLEANUP_CRON_SECRET",
] as const;

export function GET() {
  const ready = REQUIRED_SERVER_CONFIGURATION.every((name) => Boolean(process.env[name]?.trim()));

  return NextResponse.json(
    { status: ready ? "ready" : "not_ready" },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
