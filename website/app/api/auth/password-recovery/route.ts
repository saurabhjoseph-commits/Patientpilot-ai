import { createHash } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import { getPasswordRecoveryRedirectUrl, isValidRecoveryEmail, PASSWORD_RECOVERY_MESSAGE } from "@/lib/auth/password-recovery";
import { createClient } from "@/lib/supabase/server";

const attempts = new Map<string, number>();
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const email = body && typeof body === "object" && typeof (body as { email?: unknown }).email === "string"
    ? (body as { email: string }).email.trim().toLowerCase()
    : "";

  if (!isValidRecoveryEmail(email)) {
    return NextResponse.json({ message: PASSWORD_RECOVERY_MESSAGE }, { status: 200 });
  }

  const key = createHash("sha256")
    .update(`${email}\u0000${request.headers.get("x-forwarded-for") ?? ""}`)
    .digest("hex");
  const now = Date.now();
  for (const [attemptKey, attemptedAt] of attempts) {
    if (now - attemptedAt >= WINDOW_MS) attempts.delete(attemptKey);
  }
  const previous = attempts.get(key);
  if (previous && now - previous < WINDOW_MS) {
    return NextResponse.json({ message: PASSWORD_RECOVERY_MESSAGE }, { status: 200 });
  }
  attempts.set(key, now);

  try {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordRecoveryRedirectUrl(),
    });
  } catch {
    // Keep the response neutral to prevent account enumeration.
  }

  return NextResponse.json({ message: PASSWORD_RECOVERY_MESSAGE }, { status: 200 });
}
