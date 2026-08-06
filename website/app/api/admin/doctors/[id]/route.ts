import { NextRequest, NextResponse } from "next/server";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { createDoctorService } from "@/lib/doctors/service";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import type { UpdateDoctorInput } from "@/lib/doctors/types";

interface Context { params: Promise<{ id: string }>; }

export async function GET(request: NextRequest, { params }: Context) {
  const authorization = requirePermission(request, Permissions.DoctorsRead); if (authorization instanceof Response) return authorization;
  const doctor = await createDoctorService().get(resolveAdminClinic(authorization).clinicId, (await params).id);
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
    const doctor = await createDoctorService().update(resolveAdminClinic(authorization).clinicId, (await params).id, toUpdate(input));
    return NextResponse.json({ doctor });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to update doctor." }, { status: 400 }); }
}

function toUpdate(input: Record<string, unknown>): UpdateDoctorInput {
  return { fullName: optional(input.fullName), email: optional(input.email), phone: optional(input.phone), qualification: optional(input.qualification), specialisation: optional(input.specialisation), registrationNumber: optional(input.registrationNumber), languages: Array.isArray(input.languages) ? input.languages.filter((item): item is string => typeof item === "string") : undefined, profilePhotoUrl: optional(input.profilePhotoUrl), defaultAppointmentDurationMinutes: typeof input.defaultAppointmentDurationMinutes === "number" ? input.defaultAppointmentDurationMinutes : undefined, status: input.status === "active" || input.status === "inactive" ? input.status : undefined };
}
function optional(value: unknown): string | undefined { return typeof value === "string" ? value : undefined; }
