import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const callSid = formData.get("CallSid");
    const from = formData.get("From");
    const to = formData.get("To");

    console.log("Incoming Call:", {
      callSid,
      from,
      to,
    });

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">
        Thank you for calling PatientPilot AI.
        Please hold while we connect you to our AI receptionist.
    </Say>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error(error);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}