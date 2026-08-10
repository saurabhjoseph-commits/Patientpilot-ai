import ServicesManager from "@/components/admin/ServicesManager";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { canManageDoctorsGlobally, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ clinicId?: string }> }) {
  const authorization = await requireAdminPagePermission(Permissions.ClinicUpdate);
  const requestedClinicId = (await searchParams).clinicId;
  const global = canManageDoctorsGlobally(authorization);
  const { data: clinics } = global ? await supabaseServer.from("clinics").select("id,name").order("name") : { data: [] as { id: string; name: string }[] };
  if (global && !requestedClinicId) {
    return <main className="mx-auto max-w-xl space-y-4"><h1 className="text-3xl font-bold">Services</h1><p className="text-sm text-muted-foreground">Select a clinic to manage its appointment services.</p><form className="rounded-xl border bg-background p-5"><label className="grid gap-2 text-sm font-medium">Clinic<select name="clinicId" required className="min-h-11 rounded-lg border bg-background px-3"><option value="">Select clinic</option>{clinics?.map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}</select></label><button className="mt-4 min-h-11 rounded-lg bg-blue-600 px-4 font-semibold text-white">Open services</button></form></main>;
  }
  const clinicId = await resolveDoctorClinic(authorization, requestedClinicId);
  const { data, error } = await supabaseServer.from("clinic_services").select("id,name,code,description,category,default_duration_minutes,default_price,currency,active,emergency").eq("clinic_id", clinicId).order("name");
  if (error) throw new Error("Unable to load clinic services.");
  return <main className="mx-auto max-w-5xl space-y-5"><div><h1 className="text-3xl font-bold">Services</h1><p className="text-sm text-muted-foreground">Clinic-scoped appointment catalogue and authoritative default durations.</p></div>{global && <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">Global clinic context: {clinics?.find((clinic) => clinic.id === clinicId)?.name ?? clinicId}</p>}<ServicesManager services={data ?? []} clinicId={global ? clinicId : undefined} /></main>;
}
