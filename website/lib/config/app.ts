/**
 * ============================================================
 * PatientPilot AI
 * Application Configuration
 * ============================================================
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Base URL of the application.
 *
 * Development:
 * http://localhost:3000
 *
 * Production:
 * https://patientpilot-ai.vercel.app
 */
export const APP_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
);

/**
 * Build an absolute URL.
 */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${APP_URL}${normalized}`;
}

/**
 * Twilio Webhooks
 */
export const TWILIO_WEBHOOKS = {
  voice: absoluteUrl("/api/twilio/voice"),

  status: absoluteUrl("/api/twilio/status"),

  aiRespond: absoluteUrl("/api/ai/respond"),
} as const;