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

    const {
      call_sid,
      patient_name,
      phone,
      status,
      ai_state,
    } = body;

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseServer
      .from("calls")
      .insert({
        clinic_id: resolveAdminClinic(authorization).clinicId,
        call_sid,
        patient_name,
        phone,
        status: status ?? "ringing",
        ai_state: ai_state ?? "listening",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        call: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create call.",
      },
      {
        status: 500,
      }
    );
  }
}
