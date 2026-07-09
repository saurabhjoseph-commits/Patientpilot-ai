import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      patientName,
      phone,
      email,
      service,
      appointmentDate,
      appointmentTime,
      notes,
    } = body;

    if (
      !patientName ||
      !service ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseServer
      .from("appointments")
      .insert([
        {
          patient_name: patientName,
          phone,
          email,
          service,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          notes,
          status: "Booked",
          source: "AI Receptionist",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}