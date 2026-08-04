import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

export async function POST(request: NextRequest) {
  const authorization = requirePermission(request, Permissions.CallsManage);
  if (authorization instanceof Response) return authorization;
  try {
    const body = await request.json();

    const { call_id, sender, message } = body;

    if (!call_id || !sender || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "call_id, sender and message are required.",
        },
        { status: 400 }
      );
    }

    const clinicId = resolveAdminClinic(authorization).clinicId;
    const { data: parentCall, error: parentError } = await supabaseServer
      .from("calls")
      .select("id, clinic_id")
      .eq("id", call_id)
      .eq("clinic_id", clinicId)
      .maybeSingle();

    if (parentError) throw parentError;
    if (!parentCall) {
      return NextResponse.json({ success: false, message: "Call not found." }, { status: 404 });
    }

    const { data, error } = await supabaseServer
      .from("call_messages")
      .insert({
        call_id,
        clinic_id: parentCall.clinic_id,
        sender,
        message,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        transcript: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save transcript.",
      },
      { status: 500 }
    );
  }
}
