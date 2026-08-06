import { NextRequest, NextResponse } from "next/server";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { createDoctorService } from "@/lib/doctors/service";
import { requirePermission } from "@/lib/infrastructure/identity/AuthorizationContext";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

const BUCKET = "doctor-profile-photos";
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authorization = requirePermission(request, Permissions.DoctorsUpdate);
  if (authorization instanceof Response) return authorization;
  const file = (await request.formData()).get("photo");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > MAX_BYTES) return NextResponse.json({ message: "Upload a JPG, PNG, or WebP image smaller than 2 MB." }, { status: 400 });
  const clinicId = resolveAdminClinic(authorization).clinicId; const doctorId = (await params).id;
  if (!await createDoctorService().get(clinicId, doctorId)) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${clinicId}/${doctorId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabaseServer.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ message: "Unable to upload profile photo." }, { status: 500 });
  const { data } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);
  const doctor = await createDoctorService().update(clinicId, doctorId, { profilePhotoUrl: data.publicUrl });
  return NextResponse.json({ doctor });
}
