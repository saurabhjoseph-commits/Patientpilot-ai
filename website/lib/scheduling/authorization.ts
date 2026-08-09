import "server-only";

import type { RequestAuthorizationContext } from "@/lib/infrastructure/identity/AuthorizationContext";
import { resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { resolveDoctorIdentity } from "@/lib/doctors/identity-resolver";

/** Resolves a scheduling scope without accepting a doctor identity from the browser. */
export async function resolveSchedulingDoctor(authorization: RequestAuthorizationContext, requestedDoctorId: string, requestedClinicId?: string | null) {
  const isDoctor = authorization.roleCodes.includes("dentist") || authorization.roleCodes.includes("doctor");
  if (!isDoctor) return { clinicId: await resolveDoctorClinic(authorization, requestedClinicId), doctorId: requestedDoctorId };
  const identity = await resolveDoctorIdentity(authorization.userId);
  if (!identity || identity.doctorId !== requestedDoctorId) throw new SchedulingAuthorizationError("Doctors may access only their own schedule.");
  if (requestedClinicId && requestedClinicId !== identity.clinicId) throw new SchedulingAuthorizationError("Cross-clinic access is not permitted.");
  return identity;
}

export class SchedulingAuthorizationError extends Error {}
