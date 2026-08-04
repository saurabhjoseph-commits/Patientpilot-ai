import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { createWebhookDeliveryService } from "@/lib/telephony/webhook-delivery-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.WEBHOOK_CLEANUP_CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  if (!hasExpectedBearerToken(authorization, secret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const deleted = await createWebhookDeliveryService().cleanupExpired();
    return NextResponse.json({ deleted });
  } catch {
    console.error("Webhook delivery cleanup failed.");
    return NextResponse.json({ error: "Cleanup failed." }, { status: 500 });
  }
}

function hasExpectedBearerToken(authorization: string | null, secret: string): boolean {
  const expected = `Bearer ${secret}`;
  if (!authorization || authorization.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(authorization), Buffer.from(expected));
}
