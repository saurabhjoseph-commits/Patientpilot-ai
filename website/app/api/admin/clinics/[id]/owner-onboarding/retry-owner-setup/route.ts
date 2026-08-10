import { NextRequest, NextResponse } from "next/server";

import { retryOwnerAuthSetup, OwnerOnboardingError } from "@/lib/clinic/owner-onboarding";
import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  const clinicId = (await params).id;
  if (!canManageDoctorsGlobally(authorization) && clinicId !== authorization.clinicId) return NextResponse.json({ message: "Cross-clinic onboarding changes are not permitted." }, { status: 403 });
  try { return NextResponse.json({ onboarding: await retryOwnerAuthSetup(clinicId) }); }
  catch (error) {
    const known = error instanceof OwnerOnboardingError;
    const status = known && error.code === "OWNER_AUTH_IDENTITY_EXISTS" ? 409 : known ? 400 : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to retry owner setup.", ...(known && error.code ? { code: error.code } : {}) }, { status });
  }
}
