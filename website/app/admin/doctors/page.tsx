import Link from "next/link";
import { Plus, Stethoscope } from "lucide-react";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { createDoctorService } from "@/lib/doctors/service";
import { Permissions } from "@/lib/platform/domain/identity";
import DoctorDirectory from "./DoctorDirectory";

interface Props { searchParams: Promise<{ q?: string; status?: string; sort?: string; page?: string }>; }

export default async function DoctorsPage({ searchParams }: Props) {
  const identity = await requireAdminPagePermission(Permissions.DoctorsRead);
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);
  const service = createDoctorService();
  const result = await service.list({ clinicId: identity.clinicId, query: params.q, status: params.status === "active" || params.status === "inactive" ? params.status : undefined, sort: params.sort === "created" ? "created" : "name", page, pageSize: 20 });
  const schedules = await service.scheduleSummaries(identity.clinicId, result.doctors.map((doctor) => doctor.id));
  const canCreate = identity.permissionCodes.includes(Permissions.DoctorsCreate);
  const canUpdate = identity.permissionCodes.includes(Permissions.DoctorsUpdate);
  return <main className="space-y-6">
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3"><Stethoscope className="h-6 w-6 text-blue-700" /></div><div><h1 className="text-3xl font-bold">Doctors</h1><p className="text-sm text-muted-foreground">Clinic-scoped practitioners and their services.</p></div></div>{canCreate && <Link href="/admin/doctors/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"><Plus className="h-4 w-4" />Add doctor</Link>}</section>
    <DoctorDirectory result={result} schedules={schedules} query={params} canUpdate={canUpdate} />
  </main>;
}
