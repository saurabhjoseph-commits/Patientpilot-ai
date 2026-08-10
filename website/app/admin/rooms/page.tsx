import RoomsManager from "@/components/admin/RoomsManager";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { canManageDoctorsGlobally, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { Permissions } from "@/lib/platform/domain/identity";
import { createSchedulingService } from "@/lib/scheduling/service";
import { supabaseServer } from "@/lib/supabase-server";

export default async function RoomsPage({ searchParams }: { searchParams: Promise<{ clinicId?: string }> }) {
  const user = await requireAdminPagePermission(Permissions.RoomsRead);
  const requestedClinicId = (await searchParams).clinicId;
  const global = canManageDoctorsGlobally(user);
  if (global && !requestedClinicId) {
    const { data: clinics } = await supabaseServer.from("clinics").select("id,name").order("name");
    return <main className="mx-auto max-w-xl space-y-4"><h1 className="text-3xl font-bold">Rooms and chairs</h1><p className="text-sm text-slate-500">Select a clinic to manage its room inventory.</p><form className="rounded-xl border bg-white p-5"><select name="clinicId" required className="min-h-11 w-full rounded border px-3"><option value="">Select clinic</option>{(clinics ?? []).map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}</select><button className="mt-3 min-h-11 rounded bg-blue-600 px-4 font-semibold text-white">Open rooms</button></form></main>;
  }
  const clinicId = await resolveDoctorClinic(user, requestedClinicId);
  const service = createSchedulingService();
  const [rooms, assignments, doctors] = await Promise.all([service.rooms(clinicId), service.roomAssignmentsForClinic(clinicId), supabaseServer.from("doctors").select("id,full_name").eq("clinic_id", clinicId)]);
  const doctorNames = Object.fromEntries((doctors.data ?? []).map((doctor) => [doctor.id, doctor.full_name]));
  return <main className="space-y-5"><div><h1 className="text-3xl font-bold">Rooms and chairs</h1><p className="text-sm text-slate-500">Clinic-scoped room inventory and assignments.</p></div><RoomsManager rooms={rooms} assignments={assignments.map((assignment) => ({ ...assignment, doctorName: doctorNames[assignment.doctor_id] ?? "Unknown doctor" }))} canUpdate={user.permissionCodes.includes(Permissions.RoomsUpdate)} /></main>;
}
