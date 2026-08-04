import { NextRequest, NextResponse } from "next/server";

import { executeConversationWorkflow } from "@/lib/workflows/conversation-workflow";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TestConsoleRequest {
  callSid?: string;
  message?: string;
}

export async function POST(
  request: NextRequest
) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const authorization = requirePermission(request, Permissions.AiConfigure);
  if (authorization instanceof Response) return authorization;
  try {
    const body =
      (await request.json()) as TestConsoleRequest;

    const callSid =
      body.callSid?.trim() ||
      `TEST-${Date.now()}`;

    const message =
      body.message?.trim();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const workflow =
      await executeConversationWorkflow(
        callSid,
        message,
        resolveAdminClinic(authorization),
      );

    return NextResponse.json({
      success: true,

      callSid,

      //----------------------------------
      // AI
      //----------------------------------

      ai: workflow.ai,

      //----------------------------------
      // Session
      //----------------------------------

      session: workflow.session,

      //----------------------------------
      // Workflow Status
      //----------------------------------

      completed:
        workflow.ai.analysis.completed,

      state:
        workflow.session.state,

      intent:
        workflow.session.intent,

      analysis:
        workflow.ai.analysis,

      //----------------------------------
      // Business Objects
      //----------------------------------

      appointment:
        workflow.appointment ?? null,

      patient:
        workflow.patient ?? null,

      summary:
        workflow.summary ?? null,

      //----------------------------------
      // Convenience Flags
      //----------------------------------

      workflowStatus: {
        appointmentCreated:
          workflow.appointment !==
          undefined,

        patientCreated:
          workflow.patient !==
          undefined,

        summaryCreated:
          workflow.summary !==
          undefined,
      },
    });
  } catch (error) {
    console.error(
      "[Developer Console]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const authorization = requirePermission(request, Permissions.AiConfigure);
  if (authorization instanceof Response) return authorization;
  return NextResponse.json({
    service:
      "PatientPilot AI Developer Console",

    endpoint:
      "/api/test-console",

    status: "online",

    version: "2.0",

    capabilities: [
      "conversation",
      "workflow",
      "appointments",
      "patients",
      "summaries",
    ],

    timestamp:
      new Date().toISOString(),
  });
}
