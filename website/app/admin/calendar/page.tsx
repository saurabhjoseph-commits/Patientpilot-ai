import Link from "next/link";

import CalendarAppointmentCard, { type CalendarAppointment } from "@/components/admin/CalendarAppointmentCard";
import { requireAdminPageAnyPermission } from "@/lib/auth-server";
import { canManageDoctorsGlobally, resolveDoctorClinic } from "@/lib/doctors/clinic-context";
import { resolveDoctorIdentity } from "@/lib/doctors/identity-resolver";
import { Permissions } from "@/lib/platform/domain/identity";
import { createSchedulingService } from "@/lib/scheduling/service";
import { supabaseServer } from "@/lib/supabase-server";

type View = "day" | "week" | "month";
type Params = { clinicId?: string; date?: string; selectedDate?: string; view?: View; status?: string; doctorId?: string; serviceId?: string; roomId?: string };
type NamedRow = { id: string; name?: string; full_name?: string };
type BlockedTime = { id: string; starts_at: string; ends_at: string; source: string | null; active: boolean };

export default async function CalendarPage({ searchParams }: { searchParams: Promise<Params> }) {
  const user = await requireAdminPageAnyPermission([Permissions.CalendarRead, Permissions.CalendarReadOwn]);
  const params = await searchParams;
  const doctorIdentity = user.roleCodes.includes("dentist") || user.roleCodes.includes("doctor") ? await resolveDoctorIdentity(user.userId) : null;
  const global = canManageDoctorsGlobally(user);

  if ((user.roleCodes.includes("dentist") || user.roleCodes.includes("doctor")) && !doctorIdentity) {
    return <main className="rounded-xl border bg-white p-6">Your doctor profile is not configured for calendar access.</main>;
  }

  const { data: clinics } = global
    ? await supabaseServer.from("clinics").select("id,name,timezone").order("name")
    : { data: [] as { id: string; name: string; timezone: string | null }[] };

  if (global && !params.clinicId) {
    return <main className="mx-auto max-w-xl space-y-4"><h1 className="text-3xl font-bold">Calendar</h1><form className="rounded-xl border bg-white p-5"><select name="clinicId" required className="w-full rounded-lg border p-2"><option value="">Select clinic</option>{(clinics ?? []).map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}</select><button className="mt-3 min-h-11 rounded-lg bg-blue-600 px-4 text-white">Open calendar</button></form></main>;
  }

  const clinicId = doctorIdentity?.clinicId ?? await resolveDoctorClinic(user, params.clinicId);
  const date = validDate(params.date) ? params.date : today();
  const view = params.view ?? "day";
  const range = rangeFor(date, view);
  const selectedDate = validDate(params.selectedDate) && inRange(params.selectedDate, range) ? params.selectedDate : date;
  const doctorId = doctorIdentity?.doctorId ?? params.doctorId;
  const scheduling = createSchedulingService();
  const [appointments, blockedTime, doctors, services, rooms] = await Promise.all([
    scheduling.calendar(clinicId, range.from, range.to, { status: params.status, doctorId, serviceId: params.serviceId, roomId: params.roomId }),
    scheduling.blockedTime(clinicId, doctorId),
    supabaseServer.from("doctors").select("id,full_name").eq("clinic_id", clinicId).eq("status", "active").order("full_name"),
    supabaseServer.from("clinic_services").select("id,name").eq("clinic_id", clinicId).eq("active", true).order("name"),
    scheduling.rooms(clinicId),
  ]);
  const canCreate = user.permissionCodes.includes(Permissions.AppointmentsCreate);
  const canUpdate = user.permissionCodes.includes(Permissions.AppointmentsUpdate);
  const activeBlocks = (blockedTime as BlockedTime[]).filter((entry) => entry.active && fallsInRange(entry.starts_at, range));
  const base = { clinicId: global ? clinicId : undefined, doctorId: doctorIdentity ? undefined : params.doctorId, serviceId: params.serviceId, roomId: params.roomId, status: params.status };

  return (
    <main className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Calendar</h1><p className="text-sm text-slate-500">{viewLabel(view)} view · {range.from} to {range.to}</p></div>
        <div className="flex flex-wrap gap-2">
          {canCreate && <Link href="/admin/appointments/new" className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">+ New Appointment</Link>}
          <Link href={href({ ...base, date: today(), view })} className="inline-flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold">Today</Link>
        </div>
      </header>
      <nav aria-label="Calendar navigation" className="flex items-center justify-between rounded-xl border bg-white p-3">
        <Link href={href({ ...base, date: shiftDate(date, view, -1), view })} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-slate-100">Previous</Link>
        <span className="text-sm font-medium">{navigationLabel(date, view)}</span>
        <Link href={href({ ...base, date: shiftDate(date, view, 1), view })} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-slate-100">Next</Link>
      </nav>
      <form className="grid gap-2 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input type="date" name="date" defaultValue={date} className="min-h-11 rounded border px-3" />
        {global && <input type="hidden" name="clinicId" value={clinicId} />}
        <select name="view" defaultValue={view} className="min-h-11 rounded border px-3"><option value="day">Day</option><option value="week">Week</option><option value="month">Month</option></select>
        {!doctorIdentity && <select name="doctorId" defaultValue={params.doctorId ?? ""} className="min-h-11 rounded border px-3"><option value="">All doctors</option>{(doctors.data ?? []).map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>)}</select>}
        <select name="serviceId" defaultValue={params.serviceId ?? ""} className="min-h-11 rounded border px-3"><option value="">All services</option>{(services.data ?? []).map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select>
        <select name="roomId" defaultValue={params.roomId ?? ""} className="min-h-11 rounded border px-3"><option value="">All rooms</option>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select>
        <select name="status" defaultValue={params.status ?? ""} className="min-h-11 rounded border px-3"><option value="">All statuses</option><option value="Confirmed">Confirmed</option><option value="Checked In">Checked in</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select>
        <button className="min-h-11 rounded bg-slate-900 px-4 text-white">Apply filters</button>
      </form>
      {view === "day" && <Agenda date={date} appointments={appointments} blocks={activeBlocks} doctors={doctors.data} services={services.data} rooms={rooms} canUpdate={canUpdate} />}
      {view === "week" && <WeekView date={date} selectedDate={selectedDate} appointments={appointments} blocks={activeBlocks} doctors={doctors.data} services={services.data} rooms={rooms} canUpdate={canUpdate} base={base} />}
      {view === "month" && <MonthView date={date} selectedDate={selectedDate} appointments={appointments} blocks={activeBlocks} doctors={doctors.data} services={services.data} rooms={rooms} canUpdate={canUpdate} base={base} />}
    </main>
  );
}

function Agenda({ date, appointments, blocks, doctors, services, rooms, canUpdate }: { date: string; appointments: CalendarAppointment[]; blocks: BlockedTime[]; doctors: NamedRow[] | null; services: NamedRow[] | null; rooms: NamedRow[]; canUpdate: boolean }) {
  const dayAppointments = appointments.filter((item) => item.appointment_date === date);
  const dayBlocks = blocks.filter((entry) => fallsOn(entry.starts_at, date));
  return <section className="grid gap-3"><h2 className="text-lg font-semibold">{date}</h2><AgendaItems appointments={dayAppointments} blocks={dayBlocks} doctors={doctors} services={services} rooms={rooms} canUpdate={canUpdate} empty="No appointments or blocked time for this day." /></section>;
}

function WeekView({ date, selectedDate, appointments, blocks, doctors, services, rooms, canUpdate, base }: { date: string; selectedDate: string; appointments: CalendarAppointment[]; blocks: BlockedTime[]; doctors: NamedRow[] | null; services: NamedRow[] | null; rooms: NamedRow[]; canUpdate: boolean; base: Record<string, string | undefined> }) {
  const days = weekDays(date);
  return <section><div className="hidden md:grid md:grid-cols-7 md:gap-2"><div className="col-span-7 grid grid-cols-7 gap-2">{days.map((day) => <DayHeader key={day} day={day} />)}</div>{days.map((day) => <div key={day} className="min-h-64 rounded-xl border bg-slate-50 p-2"><AgendaItems appointments={appointments.filter((item) => item.appointment_date === day)} blocks={blocks.filter((entry) => fallsOn(entry.starts_at, day))} doctors={doctors} services={services} rooms={rooms} canUpdate={canUpdate} empty="No appointments" compact /></div>)}</div><div className="md:hidden"><div className="flex gap-2 overflow-x-auto pb-2" aria-label="Week date selector">{days.map((day) => <Link key={day} href={href({ ...base, date, view: "week", selectedDate: day })} className={`min-h-11 shrink-0 rounded-lg border px-3 py-2 text-sm ${selectedDate === day ? "bg-blue-600 text-white" : "bg-white"}`}>{shortDay(day)}<br />{day.slice(-2)}</Link>)}</div><Agenda date={selectedDate} appointments={appointments} blocks={blocks} doctors={doctors} services={services} rooms={rooms} canUpdate={canUpdate} /></div></section>;
}

function MonthView({ date, selectedDate, appointments, blocks, doctors, services, rooms, canUpdate, base }: { date: string; selectedDate: string; appointments: CalendarAppointment[]; blocks: BlockedTime[]; doctors: NamedRow[] | null; services: NamedRow[] | null; rooms: NamedRow[]; canUpdate: boolean; base: Record<string, string | undefined> }) {
  const days = monthCells(date);
  return <section className="space-y-4"><div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-slate-200"><div className="col-span-7 grid grid-cols-7 bg-white">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => <div key={label} className="p-2 text-center text-xs font-semibold text-slate-500">{label}</div>)}</div>{days.map((day, index) => day ? <div key={day} className={`min-h-20 bg-white p-2 ${day === today() ? "ring-2 ring-inset ring-blue-400" : ""} ${selectedDate === day ? "bg-blue-50" : ""}`}><Link href={href({ ...base, date: day, view: "day" })} className="hidden min-h-11 rounded font-semibold hover:underline md:inline">{Number(day.slice(-2))}</Link><Link href={href({ ...base, date, view: "month", selectedDate: day })} className="inline min-h-11 rounded font-semibold hover:underline md:hidden">{Number(day.slice(-2))}</Link><p className="hidden text-xs text-slate-500 md:block">{appointments.filter((item) => item.appointment_date === day).length} appointments{blocks.some((entry) => fallsOn(entry.starts_at, day)) ? " · blocked" : ""}</p></div> : <div key={`blank-${index}`} className="min-h-20 bg-slate-50" />)}</div><div className="md:hidden"><Agenda date={selectedDate} appointments={appointments} blocks={blocks} doctors={doctors} services={services} rooms={rooms} canUpdate={canUpdate} /></div></section>;
}

function AgendaItems({ appointments, blocks, doctors, services, rooms, canUpdate, empty, compact = false }: { appointments: CalendarAppointment[]; blocks: BlockedTime[]; doctors: NamedRow[] | null; services: NamedRow[] | null; rooms: NamedRow[]; canUpdate: boolean; empty: string; compact?: boolean }) {
  if (!appointments.length && !blocks.length) return <p className="rounded-lg border border-dashed bg-white p-4 text-center text-sm text-slate-500">{empty}</p>;
  return <div className="grid gap-2">{appointments.map((appointment) => <CalendarAppointmentCard key={appointment.id} appointment={appointment} doctorName={nameFor(doctors, appointment.doctor_id)} serviceName={nameFor(services, appointment.service_id, appointment.service)} roomName={nameFor(rooms, appointment.room_id)} canManage={canUpdate} />)}{blocks.map((entry) => <article key={entry.id} className={`rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900 ${compact ? "p-2" : "p-4"}`}><b>Blocked time</b> · {formatBlock(entry.starts_at)} to {formatBlock(entry.ends_at)}{entry.source ? ` · ${entry.source}` : ""}</article>)}</div>;
}

function DayHeader({ day }: { day: string }) { return <div className={`rounded-xl border p-3 text-center text-sm font-semibold ${day === today() ? "border-blue-400 bg-blue-50 text-blue-800" : "bg-white"}`}>{shortDay(day)}<br />{day}</div>; }
function validDate(value: string | undefined): value is string { return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))); }
function today() { return new Date().toISOString().slice(0, 10); }
function rangeFor(date: string, view: View) { const current = new Date(`${date}T00:00:00Z`); if (view === "day") return { from: date, to: date }; if (view === "week") { current.setUTCDate(current.getUTCDate() - ((current.getUTCDay() + 6) % 7)); const from = iso(current); current.setUTCDate(current.getUTCDate() + 6); return { from, to: iso(current) }; } const from = `${date.slice(0, 7)}-01`; return { from, to: iso(new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 0))) }; }
function weekDays(date: string) { const range = rangeFor(date, "week"); return Array.from({ length: 7 }, (_, index) => shiftIso(range.from, index)); }
function monthCells(date: string) { const current = new Date(`${date.slice(0, 7)}-01T00:00:00Z`); const lead = (current.getUTCDay() + 6) % 7; const days = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 0)).getUTCDate(); return [...Array<string | null>(lead).fill(null), ...Array.from({ length: days }, (_, index) => `${date.slice(0, 7)}-${String(index + 1).padStart(2, "0")}`), ...Array<string | null>((7 - ((lead + days) % 7)) % 7).fill(null)]; }
function shiftDate(date: string, view: View, amount: number) { const current = new Date(`${date}T00:00:00Z`); if (view === "month") current.setUTCMonth(current.getUTCMonth() + amount); else current.setUTCDate(current.getUTCDate() + (view === "week" ? amount * 7 : amount)); return iso(current); }
function shiftIso(date: string, amount: number) { const current = new Date(`${date}T00:00:00Z`); current.setUTCDate(current.getUTCDate() + amount); return iso(current); }
function iso(date: Date) { return date.toISOString().slice(0, 10); }
function inRange(date: string, range: { from: string; to: string }) { return date >= range.from && date <= range.to; }
function fallsInRange(value: string, range: { from: string; to: string }) { const date = value.slice(0, 10); return inRange(date, range); }
function fallsOn(value: string, date: string) { return value.slice(0, 10) === date; }
function shortDay(date: string) { return new Intl.DateTimeFormat("en", { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function formatBlock(value: string) { return new Date(value).toLocaleString(); }
function viewLabel(view: View) { return view[0].toUpperCase() + view.slice(1); }
function navigationLabel(date: string, view: View) { return view === "month" ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)) : view === "week" ? `${rangeFor(date, view).from} – ${rangeFor(date, view).to}` : date; }
function href(values: Record<string, string | undefined>) { const query = new URLSearchParams(Object.entries(values).filter(([, value]) => value).map(([key, value]) => [key, value ?? ""])); return `/admin/calendar?${query}`; }
function nameFor(rows: readonly NamedRow[] | null, id: string | null, fallback = "—") { const row = rows?.find((item) => item.id === id); return row?.name ?? row?.full_name ?? fallback; }
