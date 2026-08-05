import { NextRequest, NextResponse } from "next/server";

import {
  apiHandler,
  success,
} from "@/lib/core/api";

import { leadService } from "@/lib/leads/service";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { getAuthorizationContext, hasPermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

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
    const authorization = getAuthorizationContext(request);
    if (!authorization) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasPermission(authorization, Permissions.LeadsUpdate)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const { status } = await request.json();

    const lead = await leadService.updateStatus(
      Number(id),
      status,
      resolveAdminClinic(authorization),
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
    request: NextRequest,
    { params }: RouteContext
  ) => {
    const authorization = getAuthorizationContext(request);
    if (!authorization) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasPermission(authorization, Permissions.LeadsDelete)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;

    await leadService.delete(Number(id), resolveAdminClinic(authorization));

    return success(
      null,
      "Lead deleted successfully."
    );
  }
);
