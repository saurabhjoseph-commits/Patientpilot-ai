import Link from "next/link";
import { Building2, Plus } from "lucide-react";

import { requireAdminPagePermission } from "@/lib/auth-server";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

interface ClinicsPageProps { searchParams: Promise<{ created?: string }> }

export default async function ClinicsPage({ searchParams }: ClinicsPageProps) {
  const identity = await requireAdminPagePermission(Permissions.ClinicRead);
  const { data, error } = await supabaseServer
    .from("clinics")
    .select("id,name,slug,country,timezone,phone,created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load clinics.");
  const created = (await searchParams).created === "1";
  const canCreate = identity.permissionCodes.includes(Permissions.ClinicUpdate);

  return <main className="space-y-6">
    {created && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">Clinic created successfully.</p>}
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3"><Building2 className="h-6 w-6 text-blue-600" /></div><div><h1 className="text-3xl font-bold">Clinics</h1><p className="text-sm text-muted-foreground">Manage PatientPilot AI clinic locations.</p></div></div>
      {canCreate && <Link href="/admin/clinics/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"><Plus className="h-4 w-4" />Add Clinic</Link>}
    </section>
    {!data?.length ? <section className="rounded-xl border bg-background p-12 text-center"><Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" /><h2 className="text-xl font-semibold">No clinics yet</h2><p className="mt-2 text-sm text-muted-foreground">Create the first clinic to begin onboarding.</p>{canCreate && <Link href="/admin/clinics/new" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">Add Clinic</Link>}</section> : <section className="overflow-x-auto rounded-xl border bg-background"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Timezone</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Created</th></tr></thead><tbody>{data.map((clinic) => <tr key={clinic.id} className="border-t"><td className="px-4 py-4 font-medium">{clinic.name}</td><td className="px-4 py-4 text-muted-foreground">{clinic.slug}</td><td className="px-4 py-4">{clinic.country ?? "—"}</td><td className="px-4 py-4">{clinic.timezone ?? "—"}</td><td className="px-4 py-4">{clinic.phone ?? "—"}</td><td className="px-4 py-4">{clinic.created_at ? new Date(clinic.created_at).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></section>}
  </main>;
}
