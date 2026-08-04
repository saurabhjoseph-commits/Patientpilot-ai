import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";

export async function GET(req: NextRequest) {
  const authorization = requirePermission(req, Permissions.AuditRead);
  if (authorization instanceof Response) return authorization;
  const { searchParams } = new URL(req.url);

  const leadId = searchParams.get("leadId");

  if (!leadId) {
    return NextResponse.json(
      { error: "Lead ID required" },
      { status: 400 }
    );
  }

  const { data: lead, error: leadError } = await supabaseServer
    .from("contacts")
    .select("id")
    .eq("id", leadId)
    .eq("clinic_id", resolveAdminClinic(authorization).clinicId)
    .maybeSingle();
  if (leadError) return NextResponse.json({ error: leadError.message }, { status: 500 });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

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
