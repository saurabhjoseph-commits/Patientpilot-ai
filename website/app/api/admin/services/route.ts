import { NextRequest, NextResponse } from "next/server";

import { resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

const SERVICE_COLUMNS = "id,clinic_id,name,code,description,category,default_duration_minutes,default_price,currency,active,emergency,created_at,updated_at";

export async function GET(request: NextRequest) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  try {
    const clinicId = await resolveDoctorClinic(authorization, request.nextUrl.searchParams.get("clinicId"));
    const { data, error } = await supabaseServer.from("clinic_services").select(SERVICE_COLUMNS).eq("clinic_id", clinicId).order("name");
    if (error) throw error;
    return NextResponse.json({ services: data ?? [] });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to load services." }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  try {
    const body = await request.json() as Record<string, unknown>;
    const clinicId = await resolveDoctorClinic(authorization, text(body.clinicId));
    const input = validateServiceInput(body);
    const id = text(body.id);
    const query = id
      ? supabaseServer.from("clinic_services").update(input).eq("id", id).eq("clinic_id", clinicId)
      : supabaseServer.from("clinic_services").insert({ clinic_id: clinicId, ...input });
    const { data, error } = await query.select(SERVICE_COLUMNS).single();
    if (error) throw error;
    return NextResponse.json({ service: data }, { status: id ? 200 : 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to save service." }, { status: 400 });
  }
}

function validateServiceInput(input: Record<string, unknown>) {
  const name = text(input.name);
  if (!name) throw new Error("Service name is required.");
  const duration = integer(input.defaultDurationMinutes);
  if (!duration || duration < 1) throw new Error("Default appointment duration must be a positive whole number of minutes.");
  const price = input.defaultPrice === "" || input.defaultPrice === null || input.defaultPrice === undefined ? null : Number(input.defaultPrice);
  if (price !== null && (!Number.isFinite(price) || price < 0)) throw new Error("Default price must be a non-negative number.");
  return {
    name,
    code: text(input.code),
    description: text(input.description),
    category: text(input.category),
    default_duration_minutes: duration,
    default_price: price,
    currency: text(input.currency),
    active: input.active !== false,
    emergency: input.emergency === true,
  };
}

function text(value: unknown): string | null { return typeof value === "string" && value.trim() ? value.trim() : null; }
function integer(value: unknown): number | null { const number = typeof value === "number" ? value : Number(value); return Number.isInteger(number) ? number : null; }
