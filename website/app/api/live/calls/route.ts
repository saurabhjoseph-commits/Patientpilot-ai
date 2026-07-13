import { NextResponse } from "next/server";

import {
  getActiveCallCount,
  getAllLiveCalls,
  getCompletedCallCount,
  getFailedCallCount,
} from "@/lib/live/call-monitor";

import type { LiveMonitorResponse } from "@/types/live-monitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * ============================================================
 * PatientPilot AI
 * Live Calls API
 * ============================================================
 *
 * Returns all active calls together with summary statistics.
 */

export async function GET() {
  try {
    const calls = getAllLiveCalls();

    const response: LiveMonitorResponse = {
      success: true,

      summary: {
        activeCalls: getActiveCallCount(),
        completedCalls: getCompletedCallCount(),
        failedCalls: getFailedCallCount(),
        totalCalls: calls.length,
      },

      calls,

      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("❌ Live Calls API Error:", error);

    return NextResponse.json(
      {
        success: false,
        summary: {
          activeCalls: 0,
          completedCalls: 0,
          failedCalls: 0,
          totalCalls: 0,
        },
        calls: [],
        generatedAt: new Date().toISOString(),
      } satisfies LiveMonitorResponse,
      {
        status: 500,
      }
    );
  }
}