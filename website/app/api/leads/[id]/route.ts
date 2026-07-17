import { NextRequest } from "next/server";

import {
  apiHandler,
  success,
} from "@/lib/core/api";

import { leadService } from "@/lib/leads/service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PATCH /api/leads/:id
 * Update lead status.
 */
export const PATCH = apiHandler(
  async (
    request: NextRequest,
    { params }: RouteContext
  ) => {
    const { id } = await params;
    const { status } = await request.json();

    const lead = await leadService.updateStatus(
      Number(id),
      status
    );

    return success({
      lead,
    });
  }
);

/**
 * DELETE /api/leads/:id
 * Delete a lead.
 */
export const DELETE = apiHandler(
  async (
    _request: NextRequest,
    { params }: RouteContext
  ) => {
    const { id } = await params;

    await leadService.delete(Number(id));

    return success(
      null,
      "Lead deleted successfully."
    );
  }
);