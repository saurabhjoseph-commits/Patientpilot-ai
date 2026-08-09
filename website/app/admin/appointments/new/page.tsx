import AppointmentForm from "@/components/admin/AppointmentForm";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { appointmentFormData } from "@/lib/appointments/form-data";
import { Permissions } from "@/lib/platform/domain/identity";
export default async function NewAppointmentPage() { const identity = await requireAdminPagePermission(Permissions.AppointmentsCreate); const data = await appointmentFormData(identity.clinicId); return <main className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold">New appointment</h1><p className="text-sm text-slate-500">Clinic scope is secured on the server.</p></div><AppointmentForm {...data} /></main>; }
