import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { logLeadActivity } from "@/lib/activity";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Update Lead Status
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        {
          error: "Status is required.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseServer
      .from("contacts")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    // Log activity
    await logLeadActivity({
      leadId: Number(id),
      type: "Status",
      description: `Status changed to "${status}"`,
    });

    return NextResponse.json({
      success: true,
      lead: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update lead.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * Delete Lead
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const { error } = await supabaseServer
      .from("contacts")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete lead.",
      },
      {
        status: 500,
      }
    );
  }
}