import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const callSid = formData.get("CallSid");
    const callStatus = formData.get("CallStatus");

    console.log("Twilio Status Callback:", {
      callSid,
      callStatus,
    });

    // TODO:
    // Update Supabase call status here

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Twilio status callback error:", error);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}