import { NextRequest, NextResponse } from "next/server";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { cancelAppointmentService, checkInAppointmentService, completeAppointmentService, confirmAppointmentService, updateAppointmentService } from "@/lib/appointments/service";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.AppointmentsUpdate); if (authorization instanceof Response) return authorization;
  const id = (await params).id; if (!UUID.test(id)) return NextResponse.json({ message: "Invalid appointment identifier." }, { status: 400 });
  try {
    const body = await request.json() as Record<string, unknown>; const scope = resolveAdminClinic(authorization); const action = body.action;
    const appointment = action === "confirm" ? await confirmAppointmentService(id, scope) : action === "check-in" ? await checkInAppointmentService(id, scope) : action === "complete" ? await completeAppointmentService(id, scope) : action === "cancel" ? await cancelAppointmentService(id, scope) : await updateAppointmentService(id, { patientName: stringValue(body.patientName), phone: stringValue(body.phone), email: stringValue(body.email), service: stringValue(body.service), appointmentDate: stringValue(body.appointmentDate), appointmentTime: stringValue(body.appointmentTime), status: stringValue(body.status), source: stringValue(body.source), notes: stringValue(body.notes), doctorId: stringValue(body.doctorId), serviceId: stringValue(body.serviceId), roomId: stringValue(body.roomId), durationMinutes: typeof body.durationMinutes === "number" ? body.durationMinutes : undefined }, scope);
    return NextResponse.json({ appointment });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to update appointment." }, { status: 400 }); }
}
function stringValue(value: unknown): string | undefined { return typeof value === "string" && value.trim() ? value : undefined; }
