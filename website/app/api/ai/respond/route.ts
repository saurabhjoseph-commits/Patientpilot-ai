import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { NextRequest, NextResponse } from "next/server";

import {
  startConversation,
  updatePatient,
  recordRecognitionFailure,
  resetRecognitionFailures,
} from "@/lib/ai";

import {
  executeConversationWorkflow,
} from "@/lib/workflows/conversation-workflow";
import { ClinicResolutionError, resolveTelephonyClinic } from "@/lib/clinic/clinic-scope";
import { verifyTwilioWebhook } from "@/lib/telephony/twilio-webhook-security";
import { getWebhookDeliveryExpiry } from "@/lib/telephony/twilio-webhook-security";
import { createWebhookDeliveryService } from "@/lib/telephony/webhook-delivery-service";
import { getClinicReceptionistContext } from "@/lib/ai/clinic-receptionist-context";
import { getTwilioWebhooks } from "@/lib/config/app";
import { continuationPrompt, goodbyePrompt, isUsableSpeechRecognition, MAX_RECOGNITION_FAILURES, noInputPrompt, resolveHandoffNumber, selectVoiceProfile } from "@/lib/telephony/voice-policy";
import { resolveCallOwnership } from "@/lib/calls/ownership";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Twilio Speech Webhook
 *
 * Twilio sends:
 * - CallSid
 * - SpeechResult
 * - Confidence
 *
 * We:
 * - Continue the AI conversation
 * - Return TwiML
 */
export async function POST(req: NextRequest) {
  let deliveryId: string | undefined;
  try {
    const verification = await verifyTwilioWebhook(req);
    if (!verification.ok) {
      return NextResponse.json({ error: "Unauthorized webhook." }, { status: verification.status });
    }
    const deliveries = createWebhookDeliveryService();
    const receivedAt = new Date();
    const claim = await deliveries.claim({
      provider: "twilio",
      fingerprint: verification.fingerprint,
      route: req.nextUrl.pathname,
      callSid: verification.callSid,
      receivedAt,
      expiresAt: getWebhookDeliveryExpiry(receivedAt),
    });
    if (!claim.claimed) return emptyTwimlResponse();
    if (!claim.deliveryId) throw new Error("Webhook delivery claim did not return an identifier.");
    deliveryId = claim.deliveryId;

    const { formData } = verification;

    const callSid = String(formData.get("CallSid") ?? "");

    const speechResult = String(
      formData.get("SpeechResult") ?? ""
    ).trim();
    const rawConfidence = String(formData.get("Confidence") ?? "").trim();
    const speechConfidence = rawConfidence ? Number(rawConfidence) : undefined;

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

    const scope = resolveTelephonyClinic(String(formData.get("To") ?? ""));
    await resolveCallOwnership(scope, callSid);
    const receptionistContext = await getClinicReceptionistContext(scope.clinicId);

    // Ensure a session exists.
    const activeSession = await startConversation(scope.clinicId, callSid, receptionistContext.languageMode);
    const callerPhone = String(formData.get("From") ?? "").trim();
    if (callerPhone) await updatePatient(scope.clinicId, callSid, { phone: callerPhone });

    const twiml = new VoiceResponse();
    const initialVoice = selectVoiceProfile(activeSession.language.currentPatientLanguage, activeSession.language.configuredMode, receptionistContext.country);

    /**
     * Nothing recognized.
     */
    if (!isUsableSpeechRecognition(speechResult, speechConfidence)) {
      const failureCount = await recordRecognitionFailure(scope.clinicId, callSid);
      const finalAttempt = failureCount >= MAX_RECOGNITION_FAILURES;
      if (finalAttempt) {
        twiml.say({ voice: initialVoice.voice, language: initialVoice.language }, noInputPrompt(activeSession.language.currentPatientLanguage, true));
        const handoffNumber = resolveHandoffNumber(scope.clinicId);
        if (handoffNumber) twiml.dial({ answerOnBridge: true, timeout: 20 }, handoffNumber);
        twiml.hangup();
        await deliveries.markCompleted(deliveryId);
        return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
      }
      const gather = twiml.gather({
        input: ["speech"],
        actionOnEmptyResult: true,
        speechTimeout: "auto",
        timeout: 5,
        language: initialVoice.language,
        method: "POST",
        action: getTwilioWebhooks().aiRespond,
      });

      gather.say({ voice: initialVoice.voice, language: initialVoice.language }, noInputPrompt(activeSession.language.currentPatientLanguage, false));

      await deliveries.markCompleted(deliveryId);
      return new NextResponse(twiml.toString(), {
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    await resetRecognitionFailures(scope.clinicId, callSid);

    /**
 * Execute the complete business workflow.
 */
const workflow =
  await executeConversationWorkflow(
    callSid,
    speechResult,
    scope,
    receptionistContext,
  );

const result = workflow.ai;
const voiceProfile = selectVoiceProfile(workflow.session.language.currentPatientLanguage, workflow.session.language.configuredMode, receptionistContext.country);
const spokenMessage = workflow.appointment
  ? `Your ${workflow.appointment.service} appointment is confirmed for ${workflow.appointment.appointmentDate} at ${workflow.appointment.appointmentTime}${workflow.bookingDoctorName ? ` with ${workflow.bookingDoctorName}` : ""}.`
  : workflow.bookingFailure
    ? "I’m sorry, I can’t complete that booking right now. A clinic team member can help you."
  : result.response.message;

twiml.say(
  {
    voice: voiceProfile.voice,
    language: voiceProfile.language,
  },
  spokenMessage
);

/**
 * Log completed business workflow.
 */
if (workflow.appointment) {
  console.log(
    "✅ Appointment Created:",
    workflow.appointment.id
  );
}

if (workflow.patient) {
  console.log(
    "✅ Patient Synced:",
    workflow.patient.id
  );
}

if (workflow.summary) {
  console.log(
    "✅ Summary Saved:",
    workflow.summary.id
  );
}

    /**
     * Conversation finished.
     */
    const effectiveIntent = workflow.session.intent;
    const needsHandoff = result.analysis.needsHuman || effectiveIntent === "human_agent" || effectiveIntent === "emergency";
    if (needsHandoff) {
      const handoffNumber = resolveHandoffNumber(scope.clinicId);
      if (effectiveIntent === "emergency") {
        twiml.say(
          { voice: voiceProfile.voice, language: voiceProfile.language },
          workflow.session.language.currentPatientLanguage === "english"
            ? "If you have uncontrolled bleeding, severe swelling, trouble breathing, or serious trauma, please seek urgent professional care or call local emergency services now."
            : "Agar bleeding control nahi ho rahi, bahut swelling hai, saans lene mein dikkat hai, ya serious injury hai, turant emergency medical care lijiye."
        );
      }
      if (handoffNumber) {
        twiml.dial({ answerOnBridge: true, timeout: 20 }, handoffNumber);
      } else {
        twiml.say(
          { voice: voiceProfile.voice, language: voiceProfile.language },
          workflow.session.language.currentPatientLanguage === "english"
            ? "A clinic team member is not available to transfer right now. Please call the clinic again shortly."
            : "Abhi clinic team ko transfer nahi ho pa raha hai. Kripya thodi der mein clinic ko dobara call kijiye."
        );
      }
      twiml.hangup();
      await deliveries.markCompleted(deliveryId);
      return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
    }

    if (result.response.shouldHangup) {
      await import("@/lib/ai/session").then(({ markCompleted }) => markCompleted(scope.clinicId, callSid));
      twiml.say(
        {
          voice: voiceProfile.voice,
          language: voiceProfile.language,
        },
        goodbyePrompt(workflow.session.language.currentPatientLanguage)
      );

      twiml.hangup();

      await deliveries.markCompleted(deliveryId);
      return new NextResponse(twiml.toString(), {
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    /**
     * Continue listening.
     */
    const gather = twiml.gather({
      input: ["speech"],
      actionOnEmptyResult: true,
      speechTimeout: "auto",
      timeout: 5,
      language: voiceProfile.language,
      method: "POST",
      action: getTwilioWebhooks().aiRespond,
    });

    gather.say(
      {
        voice: voiceProfile.voice,
        language: voiceProfile.language,
      },
      continuationPrompt(workflow.session.language.currentPatientLanguage)
    );

    await deliveries.markCompleted(deliveryId);
    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    if (deliveryId) {
      try {
        await createWebhookDeliveryService().markFailed(deliveryId, "ai_response_processing_failed");
      } catch {
        console.error("Twilio AI response webhook failure could not be recorded.");
      }
    }
    if (error instanceof ClinicResolutionError) {
      return NextResponse.json({ error: "Clinic routing is unavailable." }, { status: 503 });
    }
    console.error("Twilio AI response webhook failed.");

    const twiml = new VoiceResponse();

    twiml.say(
      {
        voice: "alice",
      },
      "We're sorry. An unexpected error occurred."
    );

    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      status: 500,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({
    service: "PatientPilot AI",
    endpoint: "/api/ai/respond",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}

function emptyTwimlResponse(): NextResponse {
  return new NextResponse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
