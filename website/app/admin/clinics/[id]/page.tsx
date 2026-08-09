import { notFound } from "next/navigation";

import ClinicEditForm from "@/components/admin/ClinicEditForm";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { canManageDoctorsGlobally } from "@/lib/doctors/clinic-context";
import { Permissions } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

export default async function ClinicPage({ params }: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdminPagePermission(Permissions.ClinicUpdate);
  const { id } = await params;

  if (!canManageDoctorsGlobally(authorization) && id !== authorization.clinicId) {
    notFound();
  }

  const { data, error } = await supabaseServer
    .from("clinics")
    .select("id,name,email,phone,website,address,city,state,country,timezone,slug,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("Unable to load clinic.");
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clinic settings</h1>
        <p className="text-sm text-muted-foreground">Manage clinic identity and operational information.</p>
      </div>
      <ClinicEditForm clinic={data} />
    </main>
  );
}
