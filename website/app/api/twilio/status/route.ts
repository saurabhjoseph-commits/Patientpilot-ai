import { NextRequest, NextResponse } from "next/server";

import {
  addEvent,
  getLiveCall,
  removeLiveCall,
  setCallError,
  updateCallStatus,
  updateDuration,
} from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TwilioStatus =
  | "queued"
  | "initiated"
  | "ringing"
  | "in-progress"
  | "completed"
  | "busy"
  | "failed"
  | "no-answer"
  | "canceled";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const callSid = String(formData.get("CallSid") ?? "");
    const callStatus = String(
      formData.get("CallStatus") ?? ""
    ) as TwilioStatus;

    const duration = Number(
      formData.get("CallDuration") ?? 0
    );

    const from = String(formData.get("From") ?? "");
    const to = String(formData.get("To") ?? "");

    if (!callSid) {
      return NextResponse.json(
        {
          error: "Missing CallSid",
        },
        {
          status: 400,
        }
      );
    }

    console.log("========================================");
    console.log("📊 Twilio Status Callback");
    console.log("========================================");
    console.log({
      callSid,
      callStatus,
      duration,
      from,
      to,
      timestamp: new Date().toISOString(),
    });
    console.log("========================================");

    /**
     * Ignore callbacks for unknown calls.
     */
    if (!getLiveCall(callSid)) {
      return NextResponse.json({
        success: true,
        message: "Live call not found. Ignoring callback.",
      });
    }

    switch (callStatus) {
      case "queued":
      case "initiated":
      case "ringing":
        updateCallStatus(callSid, "ringing");

        addEvent(callSid, {
          type: "incoming",
          title: "Incoming Call",
          description: callStatus,
        });

        break;

      case "in-progress":
        updateCallStatus(callSid, "connected");

        addEvent(callSid, {
          type: "connected",
          title: "Call Connected",
          description: "Patient connected to AI.",
        });

        break;

      case "completed":
        updateCallStatus(callSid, "completed");

        updateDuration(callSid, duration);

        addEvent(callSid, {
          type: "completed",
          title: "Call Completed",
          description: `Duration: ${duration} seconds`,
        });

        /**
         * Keep the completed call visible
         * for a short period before removing it.
         */
        setTimeout(() => {
          removeLiveCall(callSid);
        }, 15000);

        break;

      case "busy":
      case "failed":
      case "no-answer":
      case "canceled":
        updateCallStatus(callSid, "failed");

        setCallError(
          callSid,
          `Call ended with status: ${callStatus}`
        );

        setTimeout(() => {
          removeLiveCall(callSid);
        }, 15000);

        break;
    }

    return NextResponse.json({
      success: true,
      callSid,
      status: callStatus,
    });
  } catch (error) {
    console.error(
      "❌ Twilio Status Callback Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process callback.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "PatientPilot AI Status Callback",
    status: "online",
    endpoint: "/api/twilio/status",
    timestamp: new Date().toISOString(),
  });
}