import { notFound } from "next/navigation";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentLifecycleActions from "@/components/admin/AppointmentLifecycleActions";
import { requireAdminPagePermission } from "@/lib/auth-server";
import { appointmentFormData } from "@/lib/appointments/form-data";
import { getAppointmentService } from "@/lib/appointments/service";
import { resolveAdminClinic } from "@/lib/clinic/clinic-scope";
import { Permissions } from "@/lib/platform/domain/identity";

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-slate-500">{label}</dt><dd className="break-words font-medium text-slate-900">{value}</dd></div>;
}

export default async function AppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const identity = await requireAdminPagePermission(Permissions.AppointmentsUpdate);
  const appointment = await getAppointmentService((await params).id, resolveAdminClinic(identity));
  if (!appointment) notFound();
  const data = await appointmentFormData(identity.clinicId);
  const doctorName = data.doctors.find((doctor) => doctor.id === appointment.doctorId)?.fullName ?? "—";
  const roomName = data.rooms.find((room) => room.id === appointment.roomId)?.name ?? "—";

  return <main className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold">Edit appointment</h1><p className="text-sm text-slate-500">Current status: {appointment.status}{appointment.checkedInAt ? " · checked in" : ""}{appointment.completedAt ? " · completed" : ""}</p></div><section className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-bold">Appointment details</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Detail label="Patient" value={appointment.patientName} /><Detail label="Contact" value={[appointment.phone, appointment.email].filter(Boolean).join(" · ") || "—"} /><Detail label="Service" value={appointment.service} /><Detail label="Doctor" value={doctorName} /><Detail label="Room" value={roomName} /><Detail label="Date and time" value={`${appointment.appointmentDate} · ${appointment.appointmentTime}`} /><Detail label="Duration" value={appointment.durationMinutes ? `${appointment.durationMinutes} minutes` : "—"} /><Detail label="Source" value={appointment.source} /><Detail label="Status" value={appointment.status} /><Detail label="Checked in" value={appointment.checkedInAt ? new Date(appointment.checkedInAt).toLocaleString() : "Not checked in"} /><Detail label="Completed" value={appointment.completedAt ? new Date(appointment.completedAt).toLocaleString() : "Not completed"} /><Detail label="Notes" value={appointment.notes || "—"} /></dl></section><AppointmentLifecycleActions id={appointment.id} status={appointment.status} checkedInAt={appointment.checkedInAt} completedAt={appointment.completedAt} /><AppointmentForm {...data} appointment={appointment} /></main>;
}
