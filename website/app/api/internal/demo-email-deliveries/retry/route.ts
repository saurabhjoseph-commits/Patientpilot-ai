import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { retryDueDemoRequestEmails } from "@/lib/leads/demo-request-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.EMAIL_RETRY_CRON_SECRET;
  const authorization = request.headers.get("authorization");
  const expected = secret ? `Bearer ${secret}` : "";
  if (!secret) return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  if (!authorization || authorization.length !== expected.length || !timingSafeEqual(Buffer.from(authorization), Buffer.from(expected))) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try { return NextResponse.json(await retryDueDemoRequestEmails()); }
  catch { return NextResponse.json({ error: "Retry failed." }, { status: 500 }); }
}
