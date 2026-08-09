import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { createDoctorService } from "@/lib/doctors/service";
import { createSchedulingService } from "@/lib/scheduling/service";
type Context = { params: Promise<{ id: string }> };
async function scope(request: NextRequest, context: Context) { const auth = requirePermission(request, Permissions.SchedulesUpdate); if (auth instanceof Response) return auth; const clinicId = await resolveDoctorClinic(auth, request.nextUrl.searchParams.get("clinicId")); const doctorId = (await context.params).id; if (!await createDoctorService().get(clinicId, doctorId)) return NextResponse.json({ message: "Doctor not found." }, { status: 404 }); return { clinicId, doctorId }; }
export async function GET(request: NextRequest, context: Context) { const resolved = await scope(request, context); if (resolved instanceof Response) return resolved; return NextResponse.json({ assignments: await createSchedulingService().roomAssignments(resolved.clinicId, resolved.doctorId) }); }
export async function POST(request: NextRequest, context: Context) { const resolved = await scope(request, context); if (resolved instanceof Response) return resolved; try { const body = await request.json() as Record<string, unknown>; return NextResponse.json({ assignment: await createSchedulingService().addRoomAssignment(resolved.clinicId, resolved.doctorId, { roomId: String(body.roomId ?? ""), effectiveFrom: typeof body.effectiveFrom === "string" ? body.effectiveFrom : undefined, effectiveTo: typeof body.effectiveTo === "string" ? body.effectiveTo : undefined }) }, { status: 201 }); } catch { return NextResponse.json({ message: "Unable to assign room." }, { status: 400 }); } }
