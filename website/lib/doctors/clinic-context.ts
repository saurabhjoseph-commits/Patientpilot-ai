import "server-only";

import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import type { RequestAuthorizationContext } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class DoctorClinicContextError extends Error {}

export function canManageDoctorsGlobally(authorization: RequestAuthorizationContext): boolean {
  return authorization.permissionCodes.includes(Permissions.DoctorsManageGlobal);
}

export async function resolveDoctorClinic(authorization: RequestAuthorizationContext, requestedClinicId?: string | null): Promise<string> {
  const ownClinicId = resolveAdminClinic(authorization).clinicId;
  if (!canManageDoctorsGlobally(authorization)) {
    if (requestedClinicId && requestedClinicId !== ownClinicId) throw new DoctorClinicContextError("Cross-clinic doctor access is not permitted.");
    return ownClinicId;
  }
  if (!requestedClinicId || !UUID.test(requestedClinicId)) throw new DoctorClinicContextError("Select a clinic before managing doctors.");
  const { data, error } = await supabaseServer.from("clinics").select("id").eq("id", requestedClinicId).maybeSingle();
  if (error) throw error;
  if (!data) throw new DoctorClinicContextError("Selected clinic was not found.");
  return requestedClinicId;
}
