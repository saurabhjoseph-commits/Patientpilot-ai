import { NextRequest, NextResponse } from "next/server";
import { DoctorClinicContextError, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { createDoctorService } from "@/lib/doctors/service";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

function integer(value: string | null, fallback: number): number { const parsed = Number.parseInt(value ?? "", 10); return Number.isFinite(parsed) ? parsed : fallback; }

export async function GET(request: NextRequest) {
  const authorization = requirePermission(request, Permissions.DoctorsRead);
  if (authorization instanceof Response) return authorization;
  try {
    const params = request.nextUrl.searchParams;
    const status = params.get("status");
    const clinicId = await resolveDoctorClinic(authorization, params.get("clinicId"));
    const result = await createDoctorService().list({ clinicId, query: params.get("q")?.trim() || undefined, status: status === "active" || status === "inactive" ? status : undefined, sort: params.get("sort") === "created" ? "created" : "name", page: integer(params.get("page"), 1), pageSize: integer(params.get("pageSize"), 20) });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: error instanceof DoctorClinicContextError ? error.message : "Unable to load doctors." }, { status: error instanceof DoctorClinicContextError ? 400 : 500 });
  }
}

export async function POST(request: NextRequest) {
  const authorization = requirePermission(request, Permissions.DoctorsCreate);
  if (authorization instanceof Response) return authorization;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ message: "Invalid doctor request." }, { status: 400 });
    const input = body as Record<string, unknown>;
    const clinicId = await resolveDoctorClinic(authorization, optionalString(input.clinicId));
    const doctor = await createDoctorService().create({ clinicId, fullName: string(input.fullName), email: string(input.email), phone: optionalString(input.phone), qualification: optionalString(input.qualification), specialisation: optionalString(input.specialisation), registrationNumber: optionalString(input.registrationNumber), languages: strings(input.languages), profilePhotoUrl: optionalString(input.profilePhotoUrl), defaultAppointmentDurationMinutes: number(input.defaultAppointmentDurationMinutes) });
    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to create doctor." }, { status: error instanceof DoctorClinicContextError ? 403 : 400 });
  }
}

function string(value: unknown): string { return typeof value === "string" ? value : ""; }
function optionalString(value: unknown): string | undefined { const result = string(value).trim(); return result || undefined; }
function strings(value: unknown): readonly string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function number(value: unknown): number { return typeof value === "number" ? value : Number.NaN; }
