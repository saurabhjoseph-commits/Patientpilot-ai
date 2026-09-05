import { NextRequest, NextResponse } from "next/server";
import { recordResendDeliveryEvent, verifyResendWebhook } from "@/lib/leads/demo-request-email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  const rawBody = await request.text();
  if (!verifyResendWebhook(rawBody, request.headers, secret)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const event = JSON.parse(rawBody) as Record<string, unknown>;
  await recordResendDeliveryEvent(request.headers.get("svix-id")!, event);
  return NextResponse.json({ received: true });
}
