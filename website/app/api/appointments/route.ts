import { NextRequest, NextResponse } from "next/server";

import { createAppointmentService } from "@/lib/appointments/service";
import { listAppointmentsService } from "@/lib/appointments/service";

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
export async function GET() {
  try {
    const appointments =
      await listAppointmentsService();

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
  try {
    const body = await request.json();

    const {
      call_id,
      patient_name,
      phone,
      appointment_type,
      dentist,
      appointment_date,
      appointment_time,
    } = body;

    const appointment =
      await createAppointmentService({
        clinicName:
          dentist ??
          "PatientPilot Demo Clinic",

        patientName:
          patient_name,

        phoneNumber:
          phone,

        appointmentDate:
          appointment_date,

        appointmentTime:
          appointment_time,

        reason:
          appointment_type,

        callSid:
          call_id,

        notes: "",
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