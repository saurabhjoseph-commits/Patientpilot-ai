import { NextRequest, NextResponse } from "next/server";

import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { deliverDeletionNotification, type ClinicDeletionNotification } from "@/lib/clinic/deletion-notification";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  if (!canManageDoctorsGlobally(authorization)) return NextResponse.json({ message: "Only a super administrator can retry a clinic deletion notification." }, { status: 403 });
  const { data, error } = await supabaseServer.from("clinic_deletion_notifications").select("id,clinic_name,owner_name,owner_email,status,attempt_count").eq("id", (await params).id).eq("status", "failed").maybeSingle();
  if (error || !data) return NextResponse.json({ message: "Failed deletion notification was not found." }, { status: 404 });
  const delivered = await deliverDeletionNotification(data as ClinicDeletionNotification);
  return NextResponse.json({ delivered }, { status: delivered ? 200 : 202 });
}
