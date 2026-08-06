import Link from "next/link";
import { Plus, Stethoscope } from "lucide-react";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { canManageDoctorsGlobally, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { createDoctorService } from "@/lib/doctors/service";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import DoctorDirectory from "./DoctorDirectory";

interface Props { searchParams: Promise<{ clinicId?: string; q?: string; status?: string; sort?: string; page?: string }>; }

export default async function DoctorsPage({ searchParams }: Props) {
  const identity = await requireAdminPagePermission(Permissions.DoctorsRead); const params = await searchParams;
  const global = canManageDoctorsGlobally(identity);
  const { data: clinics } = global ? await supabaseServer.from("clinics").select("id,name").order("name") : { data: [] as { id: string; name: string }[] };
  if (global && !params.clinicId) return <main className="mx-auto max-w-xl space-y-6"><div><h1 className="text-3xl font-bold">Doctors</h1><p className="mt-1 text-sm text-slate-500">Select a clinic to manage its doctors.</p></div><form className="rounded-xl border bg-white p-6"><label className="block text-sm font-medium">Clinic<select name="clinicId" required className="mt-2 block w-full rounded-lg border px-3 py-2"><option value="">Select clinic</option>{clinics?.map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}</select></label><button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">Open clinic</button></form></main>;
  const clinicId = await resolveDoctorClinic(identity, params.clinicId); const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1); const service = createDoctorService();
  const result = await service.list({ clinicId, query: params.q, status: params.status === "active" || params.status === "inactive" ? params.status : undefined, sort: params.sort === "created" ? "created" : "name", page, pageSize: 20 });
  const schedules = await service.scheduleSummaries(clinicId, result.doctors.map((doctor) => doctor.id)); const canCreate = identity.permissionCodes.includes(Permissions.DoctorsCreate); const canUpdate = identity.permissionCodes.includes(Permissions.DoctorsUpdate);
  return <main className="space-y-6"><section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3"><Stethoscope className="h-6 w-6 text-blue-700" /></div><div><h1 className="text-3xl font-bold">Doctors</h1><p className="text-sm text-muted-foreground">Clinic-scoped practitioners and their services.</p></div></div>{canCreate && <Link href={`/admin/doctors/new${global ? `?clinicId=${clinicId}` : ""}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"><Plus className="h-4 w-4" />Add doctor</Link>}</section>{global && <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">Global clinic context: {clinics?.find((clinic) => clinic.id === clinicId)?.name ?? clinicId}</p>}<DoctorDirectory result={result} schedules={schedules} query={params} clinicId={global ? clinicId : undefined} canUpdate={canUpdate} /></main>;
}
