import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const leadId = searchParams.get("leadId");

  if (!leadId) {
    return NextResponse.json(
      { error: "Lead ID required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("lead_activity")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}