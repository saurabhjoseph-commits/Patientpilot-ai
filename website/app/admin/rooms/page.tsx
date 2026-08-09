import RoomsManager from "@/components/admin/RoomsManager";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { Permissions } from "@/lib/platform/domain/identity";
import { createSchedulingService } from "@/lib/scheduling/service";
export default async function RoomsPage() { const user = await requireAdminPagePermission(Permissions.RoomsRead); const rooms = await createSchedulingService().rooms(await resolveDoctorClinic(user)); return <main className="space-y-5"><div><h1 className="text-3xl font-bold">Rooms and chairs</h1><p className="text-sm text-slate-500">Clinic-scoped room inventory.</p></div><RoomsManager rooms={rooms} canUpdate={user.permissionCodes.includes(Permissions.RoomsUpdate)} /></main>; }
