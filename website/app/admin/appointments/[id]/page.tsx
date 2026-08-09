import { notFound } from "next/navigation";
import AppointmentForm from "@/components/admin/AppointmentForm";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { appointmentFormData } from "@/lib/appointments/form-data";
import { getAppointmentService } from "@/lib/appointments/service";
import { Permissions } from "@/lib/platform/domain/identity";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import AppointmentLifecycleActions from "@/components/admin/AppointmentLifecycleActions";
export default async function AppointmentPage({ params }: { params: Promise<{ id: string }> }) { const identity = await requireAdminPagePermission(Permissions.AppointmentsUpdate); const appointment = await getAppointmentService((await params).id, resolveAdminClinic(identity)); if (!appointment) notFound(); const data = await appointmentFormData(identity.clinicId); return <main className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold">Edit appointment</h1><p className="text-sm text-slate-500">Current status: {appointment.status}{appointment.checkedInAt ? " · checked in" : ""}{appointment.completedAt ? " · completed" : ""}</p></div><AppointmentLifecycleActions id={appointment.id} status={appointment.status} checkedInAt={appointment.checkedInAt} completedAt={appointment.completedAt} /><AppointmentForm {...data} appointment={appointment} /></main>; }
