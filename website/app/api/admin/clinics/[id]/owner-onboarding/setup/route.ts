import { NextRequest, NextResponse } from "next/server";
import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { assertOwnerOnboardingReady, OwnerOnboardingError, startOwnerOnboarding } from "@/lib/clinic/owner-onboarding";
import { validateClinicOwnerAccount } from "@/lib/clinic/owner-account";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  const clinicId = (await params).id;
  if (!canManageDoctorsGlobally(authorization) && clinicId !== authorization.clinicId) return NextResponse.json({ message: "Cross-clinic onboarding changes are not permitted." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ message: "Invalid owner onboarding request." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const owner = { fullName: typeof input.fullName === "string" ? input.fullName : "", email: typeof input.email === "string" ? input.email : "", role: input.role === "manager" ? "manager" as const : "owner" as const, sendInvitation: true };
  const validation = validateClinicOwnerAccount(owner);
  if (validation) return NextResponse.json({ message: validation }, { status: 400 });
  try { await assertOwnerOnboardingReady(owner); return NextResponse.json({ onboarding: await startOwnerOnboarding(clinicId, owner) }, { status: 201 }); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to start owner onboarding." }, { status: error instanceof OwnerOnboardingError ? 400 : 500 }); }
}
