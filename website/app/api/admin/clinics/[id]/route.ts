import { NextRequest, NextResponse } from "next/server";

import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const editableFields = [
  "email",
  "phone",
  "website",
  "address",
  "city",
  "state",
  "country",
  "timezone",
] as const;

type EditableField = (typeof editableFields)[number];

function optionalText(input: Record<string, unknown>, field: EditableField): string | null | undefined {
  const value = input[field];
  if (typeof value !== "string") return undefined;
  return value.trim() || null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;

  const { id } = await params;
  if (!UUID.test(id)) {
    return NextResponse.json({ message: "Invalid clinic identifier." }, { status: 400 });
  }

  if (!canManageDoctorsGlobally(authorization) && id !== authorization.clinicId) {
    return NextResponse.json({ message: "Cross-clinic updates are not permitted." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ message: "Invalid clinic update." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) {
    return NextResponse.json({ message: "Clinic name is required." }, { status: 400 });
  }

  const update = {
    name,
    ...Object.fromEntries(editableFields.map((field) => [field, optionalText(input, field)])),
  };

  const { data, error } = await supabaseServer
    .from("clinics")
    .update(update)
    .eq("id", id)
    .select("id,name,email,phone,website,address,city,state,country,timezone,slug,created_at,updated_at")
    .single();

  if (error) {
    return NextResponse.json({ message: "Unable to update clinic." }, { status: 400 });
  }

  return NextResponse.json({ clinic: data });
}
