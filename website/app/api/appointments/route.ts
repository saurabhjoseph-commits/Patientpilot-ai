import { NextRequest, NextResponse } from "next/server";

import { createAppointmentService } from "@/lib/appointments/service";
import { listAppointmentsService } from "@/lib/appointments/service";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

/**
 * ============================================================
 * PatientPilot AI
 * Appointments API
 * ============================================================
 */

/**
 * GET /api/appointments
 * Returns appointments.
 */
export async function GET(request: NextRequest) {
  const authorization = requirePermission(request, Permissions.AppointmentsRead);
  if (authorization instanceof Response) return authorization;
  try {
    const appointments =
      await listAppointmentsService({ clinicId: resolveAdminClinic(authorization).clinicId });

    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load appointments.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/appointments
 * Creates a new appointment.
 */
export async function POST(
  request: NextRequest
) {
  const authorization = requirePermission(request, Permissions.AppointmentsCreate);
  if (authorization instanceof Response) return authorization;
  try {
    const body = await request.json();

    const input = body as Record<string, unknown>;
    const readString = (value: unknown): string | undefined =>
      typeof value === "string" && value.trim().length > 0 ? value : undefined;

    const appointment =
      await createAppointmentService({
        clinicId: resolveAdminClinic(authorization).clinicId,
        patientName: readString(input.patient_name) ?? readString(input.patientName) ?? "",
        phone: readString(input.phone) ?? "",
        email: readString(input.email),
        appointmentDate: readString(input.appointment_date) ?? readString(input.appointmentDate) ?? "",
        appointmentTime: readString(input.appointment_time) ?? readString(input.appointmentTime) ?? "",
        // The historical appointment_type/reason request fields mean the requested service.
        service: readString(input.appointment_type) ?? readString(input.service) ?? readString(input.reason) ?? "",
        notes: readString(input.notes),
      });

    return NextResponse.json(
      {
        success: true,
        appointment,
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
        message:
          error instanceof Error
            ? error.message
            : "Unable to create appointment.",
      },
      {
        status: 500,
      }
    );
  }
}
