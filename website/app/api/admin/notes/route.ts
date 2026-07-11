import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { logLeadActivity } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const { leadId, notes } = await req.json();

    if (!leadId) {
      return NextResponse.json(
        {
          error: "Lead ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // Update lead notes
    const { error } = await supabaseServer
      .from("contacts")
      .update({
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (error) {
      console.error("Supabase Error:", error);

      return NextResponse.json(
        {
          error: "Failed to save notes",
        },
        {
          status: 500,
        }
      );
    }

    // Log activity
    await logLeadActivity({
      leadId,
      type: "Notes",
      description: "Internal notes updated",
    });

    return NextResponse.json({
      success: true,
      message: "Notes saved successfully",
    });
  } catch (err) {
    console.error("Notes API Error:", err);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}