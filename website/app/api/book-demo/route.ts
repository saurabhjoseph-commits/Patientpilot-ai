import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  console.log("====================================");
  console.log("BOOK DEMO API CALLED");
  console.log("====================================");

  try {
    const body = await request.json();

    console.log("Request Body:", body);

    const {
      clinicName,
      dentistName,
      email,
      phone,
      monthlyCalls,
      message,
    } = body;

    if (
      !clinicName ||
      !dentistName ||
      !email ||
      !phone ||
      !monthlyCalls
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Validation Passed");
    console.log("Attempting to insert into Supabase...");

    const { data, error } = await supabaseServer
      .from("contacts")
      .insert([
        {
          clinic_name: clinicName,
          dentist_name: dentistName,
          email,
          phone,
          monthly_calls: Number(monthlyCalls),
          message,
          status: "New",
        },
      ])
      .select();

    console.log("Supabase Response:", data);
    console.log("Supabase Error:", error);

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
          details: error,
        },
        {
          status: 500,
        }
      );
    }

    console.log("Lead Saved Successfully!");

    return NextResponse.json({
      success: true,
      message: "Demo booked successfully!",
    });

  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}