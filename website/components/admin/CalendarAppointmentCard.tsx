"use client";

import Link from "next/link";
import AppointmentLifecycleActions from "@/components/admin/AppointmentLifecycleActions";

export interface CalendarAppointment {
  id: string;
  patient_name: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  doctor_id: string | null;
  service_id: string | null;
  room_id: string | null;
  duration_minutes: number | null;
  checked_in_at: string | null;
  completed_at: string | null;
}

export default function CalendarAppointmentCard({ appointment, doctorName, serviceName, roomName, canManage }: { appointment: CalendarAppointment; doctorName: string; serviceName: string; roomName: string; canManage: boolean }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{appointment.patient_name}</p>
          <p className="text-sm text-slate-600">{appointment.appointment_time} · {appointment.duration_minutes ?? "—"} min</p>
          <p className="mt-1 text-xs text-slate-500">Doctor: {doctorName} · Service: {serviceName} · Room: {roomName}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{appointment.status}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link href={`/admin/appointments/${appointment.id}`} className="inline-flex min-h-11 items-center rounded-lg border px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">Open</Link>
        <AppointmentLifecycleActions id={appointment.id} status={appointment.status} checkedInAt={appointment.checked_in_at} completedAt={appointment.completed_at} compact canManage={canManage} />
      </div>
    </article>
  );
}
