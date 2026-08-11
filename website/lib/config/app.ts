/** Central authoritative application origin for absolute redirects and webhooks. */
const LOCAL_ORIGIN = "http://localhost:3000";
const VERCEL_PRODUCTION_HOST = "patientpilot-ai.vercel.app";

function trimTrailingSlash(url: string): string { return url.replace(/\/+$/, ""); }

export function getApplicationOrigin(value = process.env.NEXT_PUBLIC_APP_URL): string {
  const configured = value ?? (process.env.NODE_ENV === "production" ? undefined : LOCAL_ORIGIN);
  if (!configured) throw new Error("NEXT_PUBLIC_APP_URL must be configured in production.");
  let url: URL;
  try { url = new URL(configured); } catch { throw new Error("NEXT_PUBLIC_APP_URL must be a valid application origin."); }
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (!local && url.protocol !== "https:") throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS outside local development.");
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) throw new Error("NEXT_PUBLIC_APP_URL must be an origin without a path, query, fragment, or credentials.");
  if (process.env.NODE_ENV === "production" && url.hostname === VERCEL_PRODUCTION_HOST) throw new Error("NEXT_PUBLIC_APP_URL must use the canonical production domain, not the Vercel deployment domain.");
  return trimTrailingSlash(url.origin);
}

export function absoluteUrl(path: string): string { return new URL(path.startsWith("/") ? path : `/${path}`, getApplicationOrigin()).toString(); }

export function shouldRedirectToCanonicalHost(hostname: string): boolean {
  if (process.env.NODE_ENV !== "production" || hostname !== VERCEL_PRODUCTION_HOST) return false;
  return new URL(getApplicationOrigin()).hostname !== hostname;
}

export function getTwilioWebhooks() { return { voice: absoluteUrl("/api/twilio/voice"), status: absoluteUrl("/api/twilio/status"), aiRespond: absoluteUrl("/api/ai/respond") } as const; }
