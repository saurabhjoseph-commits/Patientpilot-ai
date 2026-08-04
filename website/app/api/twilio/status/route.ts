import { NextRequest, NextResponse } from "next/server";

import {
  addEvent,
  getLiveCall,
  removeLiveCall,
  setCallError,
  updateCallStatus,
  updateDuration,
} from "@/lib/live";
import { ClinicResolutionError, resolveTelephonyClinic } from "@/lib/clinic/clinic-scope";
import { verifyTwilioWebhook } from "@/lib/telephony/twilio-webhook-security";
import { getWebhookDeliveryExpiry } from "@/lib/telephony/twilio-webhook-security";
import { createWebhookDeliveryService } from "@/lib/telephony/webhook-delivery-service";

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
  let deliveryId: string | undefined;
  try {
    const verification = await verifyTwilioWebhook(request);
    if (!verification.ok) {
      return NextResponse.json({ error: "Unauthorized webhook." }, { status: verification.status });
    }

    const deliveries = createWebhookDeliveryService();
    const receivedAt = new Date();
    const claim = await deliveries.claim({
      provider: "twilio",
      fingerprint: verification.fingerprint,
      route: request.nextUrl.pathname,
      callSid: verification.callSid,
      receivedAt,
      expiresAt: getWebhookDeliveryExpiry(receivedAt),
    });
    if (!claim.claimed) return NextResponse.json({ success: true, duplicate: true });
    if (!claim.deliveryId) throw new Error("Webhook delivery claim did not return an identifier.");
    deliveryId = claim.deliveryId;

    const { formData } = verification;

    const callSid = String(formData.get("CallSid") ?? "");
    const callStatus = String(
      formData.get("CallStatus") ?? ""
    ) as TwilioStatus;

    const duration = Number(
      formData.get("CallDuration") ?? 0
    );

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

    resolveTelephonyClinic(to);

    /**
     * Ignore callbacks for unknown calls.
     */
    if (!getLiveCall(callSid)) {
      await deliveries.markCompleted(deliveryId);
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

    await deliveries.markCompleted(deliveryId);
    return NextResponse.json({
      success: true,
      callSid,
      status: callStatus,
    });
  } catch (error) {
    if (deliveryId) {
      try {
        await createWebhookDeliveryService().markFailed(deliveryId, "status_processing_failed");
      } catch {
        console.error("Twilio status webhook failure could not be recorded.");
      }
    }
    if (error instanceof ClinicResolutionError) {
      return NextResponse.json({ error: "Clinic routing is unavailable." }, { status: 403 });
    }
    console.error("Twilio status webhook failed.");

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
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({
    service: "PatientPilot AI Status Callback",
    status: "online",
    endpoint: "/api/twilio/status",
    timestamp: new Date().toISOString(),
  });
}
