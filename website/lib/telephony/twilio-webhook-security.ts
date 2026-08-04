import "server-only";

import { createHash } from "node:crypto";

import { validateRequest } from "twilio";

import type { NextRequest } from "next/server";

export type TwilioWebhookVerification =
  | { readonly ok: true; readonly formData: FormData; readonly fingerprint: string; readonly callSid?: string }
  | { readonly ok: false; readonly status: 401 | 403 | 503 };

const DEFAULT_REPLAY_WINDOW_MS = 5 * 60 * 1000;

export async function verifyTwilioWebhook(
  request: NextRequest,
): Promise<TwilioWebhookVerification> {
  const signature = request.headers.get("x-twilio-signature");
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!signature) return { ok: false, status: 401 };
  if (!authToken) return { ok: false, status: 503 };
  if (!isOptionalTimestampFresh(request.headers.get("x-twilio-request-timestamp"))) {
    return { ok: false, status: 403 };
  }

  const formData = await request.formData();
  const params = formDataToTwilioParams(formData);
  let url: string;
  try {
    url = reconstructTwilioWebhookUrl(request);
  } catch {
    return { ok: false, status: 503 };
  }

  if (!validateRequest(authToken, signature, url, params)) {
    return { ok: false, status: 403 };
  }

  return {
    ok: true,
    formData,
    fingerprint: fingerprintVerifiedRequest(url, signature, formData),
    callSid: stringValue(formData.get("CallSid")),
  };
}

export function reconstructTwilioWebhookUrl(request: NextRequest): string {
  const configuredBaseUrl = process.env.TWILIO_WEBHOOK_BASE_URL;

  if (configuredBaseUrl) {
    const base = new URL(configuredBaseUrl);
    if (base.pathname !== "/" || base.search || base.hash) {
      throw new Error("TWILIO_WEBHOOK_BASE_URL must be an origin without a path, query, or fragment.");
    }
    if (process.env.NODE_ENV !== "development" && base.protocol !== "https:") {
      throw new Error("TWILIO_WEBHOOK_BASE_URL must use HTTPS outside local development.");
    }
    return new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, base).toString();
  }

  if (process.env.NODE_ENV !== "development") {
    throw new Error("TWILIO_WEBHOOK_BASE_URL is required outside local development.");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const host = forwardedHost?.split(",")[0]?.trim() ?? request.headers.get("host");
  const protocol = forwardedProtocol?.split(",")[0]?.trim() ?? request.nextUrl.protocol.replace(":", "");

  if (!host) throw new Error("Unable to reconstruct Twilio webhook URL.");
  return `${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
}

export function getWebhookDeliveryExpiry(receivedAt = new Date()): Date {
  return new Date(receivedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
}

export function isOptionalTimestampFresh(timestamp: string | null, now = Date.now()): boolean {
  if (!timestamp) return true;
  const timestampMs = Number(timestamp) * 1000;
  return Number.isFinite(timestampMs) && Math.abs(now - timestampMs) <= DEFAULT_REPLAY_WINDOW_MS;
}

function fingerprintVerifiedRequest(url: string, signature: string, formData: FormData): string {
  const canonicalValues = [...formData.entries()]
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .sort(([leftKey, leftValue], [rightKey, rightValue]) =>
      leftKey.localeCompare(rightKey) || leftValue.localeCompare(rightValue),
    )
    .map(([key, value]) => `${key}\u0000${value}`)
    .join("\u0001");

  return createHash("sha256")
    .update(`twilio\u0000${url}\u0000${signature}\u0000${canonicalValues}`)
    .digest("hex");
}

function formDataToTwilioParams(formData: FormData): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    const existing = params[key];
    params[key] = existing === undefined ? value : Array.isArray(existing) ? [...existing, value] : [existing, value];
  }
  return params;
}

function stringValue(value: FormDataEntryValue | null): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
