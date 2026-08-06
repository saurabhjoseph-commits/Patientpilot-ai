import { NextRequest, NextResponse } from "next/server";
import { DoctorClinicContextError, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { createDoctorService } from "@/lib/doctors/service";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.DoctorsAssignServices); if (authorization instanceof Response) return authorization;
  try {
    const body: unknown = await request.json();
    const record = body && typeof body === "object" && !Array.isArray(body) ? body as { assignments?: unknown; clinicId?: unknown } : null;
    const candidate = Array.isArray(body) ? body : record?.assignments;
    if (!Array.isArray(candidate) || !candidate.every(valid)) return NextResponse.json({ message: "Invalid service assignment." }, { status: 400 });
    const assignments = candidate;
    const clinicId = await resolveDoctorClinic(authorization, typeof record?.clinicId === "string" ? record.clinicId : undefined);
    await createDoctorService().setServices(clinicId, (await params).id, assignments);
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to assign services." }, { status: error instanceof DoctorClinicContextError ? 403 : 400 }); }
}
function valid(value: unknown): value is { serviceId: string; active: boolean; customDurationMinutes?: number; customPrice?: number } { return !!value && typeof value === "object" && typeof (value as { serviceId?: unknown }).serviceId === "string" && typeof (value as { active?: unknown }).active === "boolean"; }
