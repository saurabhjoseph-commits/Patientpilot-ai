import { NextRequest, NextResponse } from "next/server";
import { DoctorClinicContextError, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { createDoctorService } from "@/lib/doctors/service";
import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { doctorDependencyCounts, protectedDoctorDependencies } from "@/lib/doctors/deletion-safety";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import type { UpdateDoctorInput } from "@/lib/doctors/types";

interface Context { params: Promise<{ id: string }>; }

export async function GET(request: NextRequest, { params }: Context) {
  const authorization = requirePermission(request, Permissions.DoctorsRead); if (authorization instanceof Response) return authorization;
  const clinicId = await resolveDoctorClinic(authorization, request.nextUrl.searchParams.get("clinicId"));
  const doctor = await createDoctorService().get(clinicId, (await params).id);
  return doctor ? NextResponse.json({ doctor }) : NextResponse.json({ message: "Doctor not found." }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const authorization = requirePermission(request, Permissions.DoctorsUpdate); if (authorization instanceof Response) return authorization;
  try {
    const body: unknown = await request.json(); if (!body || typeof body !== "object") return NextResponse.json({ message: "Invalid doctor request." }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (input.status !== undefined) {
      const statusAuthorization = requirePermission(request, Permissions.DoctorsDeactivate);
      if (statusAuthorization instanceof Response) return statusAuthorization;
    }
    const clinicId = await resolveDoctorClinic(authorization, optional(input.clinicId));
    const doctor = await createDoctorService().update(clinicId, (await params).id, toUpdate(input));
    return NextResponse.json({ doctor });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to update doctor." }, { status: error instanceof DoctorClinicContextError ? 403 : 400 }); }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const authorization = requirePermission(request, Permissions.DoctorsDelete); if (authorization instanceof Response) return authorization;
  if (!canManageDoctorsGlobally(authorization)) return NextResponse.json({ message: "Only a super administrator can permanently delete a doctor." }, { status: 403 });
  try {
    const body = await request.json().catch(() => null);
    const requestedClinicId = body && typeof body === "object" ? optional((body as Record<string, unknown>).clinicId) : undefined;
    const clinicId = await resolveDoctorClinic(authorization, requestedClinicId);
    const doctor = await createDoctorService().get(clinicId, (await params).id);
    if (!doctor) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
    if (!body || typeof body !== "object" || (body as Record<string, unknown>).confirmation !== doctor.fullName) return NextResponse.json({ message: "Type the doctor name to confirm permanent deletion." }, { status: 400 });
    const dependencies = protectedDoctorDependencies(await doctorDependencyCounts(clinicId, doctor.id, doctor.authUserId));
    if (dependencies.length) return NextResponse.json({ message: `Doctor cannot be deleted while protected data exists: ${dependencies.join(", ")}. Deactivate the doctor instead.`, dependencies }, { status: 409 });
    const { error } = await supabaseServer.from("doctors").delete().eq("clinic_id", clinicId).eq("id", doctor.id);
    if (error) return NextResponse.json({ message: "Doctor deletion was refused by the database." }, { status: 409 });
    return new NextResponse(null, { status: 204 });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to delete doctor." }, { status: error instanceof DoctorClinicContextError ? 403 : 500 }); }
}

function toUpdate(input: Record<string, unknown>): UpdateDoctorInput {
  return { fullName: optional(input.fullName), email: optional(input.email), phone: optional(input.phone), qualification: optional(input.qualification), specialisation: optional(input.specialisation), registrationNumber: optional(input.registrationNumber), languages: Array.isArray(input.languages) ? input.languages.filter((item): item is string => typeof item === "string") : undefined, profilePhotoUrl: optional(input.profilePhotoUrl), defaultAppointmentDurationMinutes: typeof input.defaultAppointmentDurationMinutes === "number" ? input.defaultAppointmentDurationMinutes : undefined, status: input.status === "active" || input.status === "inactive" ? input.status : undefined };
}
function optional(value: unknown): string | undefined { return typeof value === "string" ? value : undefined; }
