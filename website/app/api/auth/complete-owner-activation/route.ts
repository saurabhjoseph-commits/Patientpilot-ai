import { NextRequest, NextResponse } from "next/server";
import { completeOwnerActivation } from "@/lib/clinic/owner-onboarding";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const accessToken = body && typeof body === "object" && typeof (body as { accessToken?: unknown }).accessToken === "string" ? (body as { accessToken: string }).accessToken : "";
  if (!accessToken) return NextResponse.json({ error: "Activation failed." }, { status: 400 });
  const { data, error } = await supabaseServer.auth.getUser(accessToken);
  if (error || !data.user) return NextResponse.json({ error: "Activation failed." }, { status: 401 });
  return await completeOwnerActivation(data.user.id) ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Activation failed." }, { status:403 });
}
