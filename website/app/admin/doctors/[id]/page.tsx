import { notFound } from "next/navigation";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { createDoctorService } from "@/lib/doctors/service";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import { canManageDoctorsGlobally, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import DoctorForm from "../DoctorForm";

export default async function EditDoctorPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ clinicId?: string }> }) {
  const identity = await requireAdminPagePermission(Permissions.DoctorsUpdate); const id = (await params).id;
  const clinicId = await resolveDoctorClinic(identity, (await searchParams).clinicId); const service = createDoctorService(); const doctor = await service.get(clinicId, id); if (!doctor) notFound();
  const [{ data: services }, assigned] = await Promise.all([supabaseServer.from("clinic_services").select("id,name,active").eq("clinic_id", clinicId).order("name"), service.assignedServiceIds(clinicId, id)]);
  return <main className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold">Edit doctor</h1><p className="mt-1 text-sm text-slate-500">Working schedule is configured in the scheduling module after G4 is deployed.</p></div><DoctorForm doctor={doctor} clinicId={canManageDoctorsGlobally(identity) ? clinicId : undefined} services={services ?? []} assignedServiceIds={assigned} canAssignServices={identity.permissionCodes.includes(Permissions.DoctorsAssignServices)} /></main>;
}
