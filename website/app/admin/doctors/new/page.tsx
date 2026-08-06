import { requireAdminPagePermission } from "@/lib/auth-server";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import { canManageDoctorsGlobally, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import DoctorForm from "../DoctorForm";

export default async function NewDoctorPage({ searchParams }: { searchParams: Promise<{ clinicId?: string }> }) {
  const identity = await requireAdminPagePermission(Permissions.DoctorsCreate);
  const requestedClinicId = (await searchParams).clinicId; const clinicId = await resolveDoctorClinic(identity, requestedClinicId);
  const { data } = await supabaseServer.from("clinic_services").select("id,name,active").eq("clinic_id", clinicId).order("name");
  return <main className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold">Add doctor</h1><p className="mt-1 text-sm text-slate-500">Create a practitioner for this clinic.</p></div><DoctorForm clinicId={canManageDoctorsGlobally(identity) ? clinicId : undefined} services={data ?? []} canAssignServices={identity.permissionCodes.includes(Permissions.DoctorsAssignServices)} /></main>;
}
