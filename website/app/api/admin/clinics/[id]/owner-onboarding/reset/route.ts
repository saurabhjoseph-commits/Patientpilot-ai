import { NextRequest, NextResponse } from "next/server";

import { resetOwnerOnboarding, OwnerOnboardingError } from "@/lib/clinic/owner-onboarding";
import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.ClinicUpdate);
  if (authorization instanceof Response) return authorization;
  if (!canManageDoctorsGlobally(authorization)) return NextResponse.json({ message: "Only a super administrator can reset owner onboarding." }, { status: 403 });
  const clinicId = (await params).id;
  const body = await request.json().catch(() => null);
  const { data: clinic, error } = await supabaseServer.from("clinics").select("name").eq("id", clinicId).maybeSingle();
  if (error || !clinic) return NextResponse.json({ message: "Clinic was not found." }, { status: 404 });
  if (!body || typeof body !== "object" || (body as Record<string, unknown>).confirmation !== clinic.name) return NextResponse.json({ message: "Type the clinic name to confirm this onboarding reset." }, { status: 400 });
  try { return NextResponse.json({ onboarding: await resetOwnerOnboarding(clinicId) }); }
  catch (failure) { return NextResponse.json({ message: failure instanceof Error ? failure.message : "Unable to reset owner onboarding." }, { status: failure instanceof OwnerOnboardingError ? 400 : 500 }); }
}
