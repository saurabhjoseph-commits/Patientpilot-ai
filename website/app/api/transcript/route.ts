import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { call_id, sender, message } = body;

    if (!call_id || !sender || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "call_id, sender and message are required.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("call_messages")
      .insert({
        call_id,
        sender,
        message,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        transcript: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save transcript.",
      },
      { status: 500 }
    );
  }
}