import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { logLeadActivity } from "@/lib/activity";

export async function POST(request: NextRequest) {
  try {
    const {
      leadId,
      action,
      demoDate,
    } = await request.json();

    if (!leadId || !action) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    switch (action) {
      case "contacted": {
        const { error } = await supabaseServer
          .from("contacts")
          .update({
            status: "Contacted",
            contacted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", leadId);

        if (error) throw error;

        await logLeadActivity({
          leadId,
          type: "Contact",
          description: "Lead marked as Contacted",
        });

        break;
      }

      case "schedule-demo": {
        const { error } = await supabaseServer
          .from("contacts")
          .update({
            status: "Demo Scheduled",
            demo_date: demoDate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", leadId);

        if (error) throw error;

        await logLeadActivity({
          leadId,
          type: "Demo",
          description: `Demo scheduled for ${demoDate}`,
        });

        break;
      }

      case "convert": {
        const { error } = await supabaseServer
          .from("contacts")
          .update({
            converted: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", leadId);

        if (error) throw error;

        await logLeadActivity({
          leadId,
          type: "Patient",
          description:
            "Lead converted to Patient",
        });

        break;
      }

      default:
        return NextResponse.json(
          {
            error: "Unknown action.",
          },
          {
            status: 400,
          }
        );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Action failed.",
      },
      {
        status: 500,
      }
    );
  }
}