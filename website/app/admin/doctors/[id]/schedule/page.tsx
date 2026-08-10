import DoctorSchedulingPanel from "@/components/admin/DoctorSchedulingPanel";
import { requireAdminPageAnyPermission } from "@/lib/auth-server";
import { canManageDoctorsGlobally, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { resolveDoctorIdentity } from "@/lib/doctors/identity-resolver";
import { Permissions } from "@/lib/platform/domain/identity";
import { createSchedulingService } from "@/lib/scheduling/service";

export default async function SchedulePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ clinicId?: string }> }) {
  const user = await requireAdminPageAnyPermission([Permissions.SchedulesRead, Permissions.CalendarReadOwn]);
  const id = (await params).id;
  const requestedClinicId = (await searchParams).clinicId;
  const own = user.roleCodes.includes("dentist") || user.roleCodes.includes("doctor") ? await resolveDoctorIdentity(user.userId) : null;
  if (own && own.doctorId !== id) return <main className="rounded-xl border bg-white p-6">You may manage only your own schedule.</main>;
  const clinicId = own?.clinicId ?? await resolveDoctorClinic(user, requestedClinicId);
  const service = createSchedulingService();
  const [schedules, leave, blocked, assignments, rooms] = await Promise.all([service.schedules(clinicId, id), service.leaves(clinicId, id), service.blockedTime(clinicId, id), service.roomAssignments(clinicId, id), service.rooms(clinicId)]);
  const permissions = {
    schedule: user.permissionCodes.includes(Permissions.SchedulesUpdate) || user.permissionCodes.includes(Permissions.CalendarUpdateOwn),
    leave: user.permissionCodes.includes(Permissions.LeaveUpdate) || user.permissionCodes.includes(Permissions.CalendarUpdateOwn),
    block: user.permissionCodes.includes(Permissions.CalendarUpdate) || user.permissionCodes.includes(Permissions.CalendarUpdateOwn),
    assignment: user.permissionCodes.includes(Permissions.SchedulesUpdate),
  };
  return <main className="mx-auto max-w-4xl space-y-5"><div><h1 className="text-3xl font-bold">Doctor schedule</h1><p className="text-sm text-slate-500">Working hours, leave, blocked time, and room assignments.</p></div><DoctorSchedulingPanel doctorId={id} clinicId={canManageDoctorsGlobally(user) ? clinicId : undefined} schedules={schedules} leave={leave} blocked={blocked} assignments={assignments} rooms={rooms} permissions={permissions} /></main>;
}
