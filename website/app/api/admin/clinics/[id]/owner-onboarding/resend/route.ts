import { NextRequest, NextResponse } from "next/server";
import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { resendOwnerActivation, OwnerOnboardingError } from "@/lib/clinic/owner-onboarding";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  const clinicId = (await params).id;
  if (!canManageDoctorsGlobally(authorization) && clinicId !== authorization.clinicId) return NextResponse.json({ message: "Cross-clinic onboarding changes are not permitted." }, { status: 403 });
  try { return NextResponse.json({ onboarding: await resendOwnerActivation(clinicId) }); } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to resend activation." }, { status: error instanceof OwnerOnboardingError ? 400 : 500 }); }
}
