import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Legacy unsigned Twilio endpoint.
 * Provider traffic must use the signed /api/twilio/voice or /api/twilio/status routes.
 */
export async function GET() {
  return NextResponse.json({ error: "Endpoint retired." }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: "Endpoint retired." }, { status: 410 });
}
