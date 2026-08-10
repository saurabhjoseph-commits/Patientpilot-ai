"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS_HOUR_DAYS, type ClinicBusinessHours, type DayOfWeek, validateClinicBusinessHours } from "@/lib/clinic/models/business-hours";
import { type ClinicBookingPolicy, validateClinicBookingPolicy } from "@/lib/clinic/booking-policy";

type Clinic = { id: string; name: string; email: string | null; phone: string | null; website: string | null; address: string | null; city: string | null; state: string | null; country: string | null; timezone: string | null; slug: string; created_at: string | null; };
type Field = { label: string; name: keyof Pick<Clinic, "name" | "phone" | "email" | "website" | "address" | "city" | "state" | "country" | "timezone">; type?: "email" | "text" | "url"; inputMode?: "tel"; required?: boolean; };
const basicFields: readonly Field[] = [{ label: "Clinic name", name: "name", required: true }, { label: "Phone number", name: "phone", inputMode: "tel" }, { label: "Email", name: "email", type: "email" }, { label: "Website", name: "website", type: "url" }];
const locationFields: readonly Field[] = [{ label: "Address", name: "address" }, { label: "City", name: "city" }, { label: "State", name: "state" }, { label: "Country", name: "country" }, { label: "Timezone", name: "timezone" }];

export default function ClinicEditForm({ clinic, officeHours, bookingPolicy, policyAvailable }: { clinic: Clinic; officeHours: ClinicBusinessHours; bookingPolicy: ClinicBookingPolicy | null; policyAvailable: boolean }) {
  const router = useRouter();
  const [hours, setHours] = useState(officeHours);
  const [policy, setPolicy] = useState({
    minimumBookingNoticeMinutes: bookingPolicy?.minimumBookingNoticeMinutes.toString() ?? "",
    maximumBookingHorizonDays: bookingPolicy?.maximumBookingHorizonDays.toString() ?? "",
    slotIntervalMinutes: bookingPolicy?.slotIntervalMinutes.toString() ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function updateDay(day: DayOfWeek, changes: Partial<ClinicBusinessHours[DayOfWeek]>) { setHours((current) => ({ ...current, [day]: { ...current[day], ...changes } })); }
  function parsedBookingPolicy(): ClinicBookingPolicy | null {
    if (!policyAvailable) return null;
    if (!policy.minimumBookingNoticeMinutes || !policy.maximumBookingHorizonDays || !policy.slotIntervalMinutes) return null;
    return {
      minimumBookingNoticeMinutes: Number(policy.minimumBookingNoticeMinutes),
      maximumBookingHorizonDays: Number(policy.maximumBookingHorizonDays),
      slotIntervalMinutes: Number(policy.slotIntervalMinutes),
    };
  }
  async function save(data: FormData) {
    if (saving) return;
    const hoursError = validateClinicBusinessHours(hours);
    if (hoursError) { setMessage(hoursError); return; }
    const nextPolicy = parsedBookingPolicy();
    const policyError = policyAvailable ? validateClinicBookingPolicy(nextPolicy) : null;
    if (policyError) { setMessage(policyError); return; }
    setSaving(true); setMessage(null);
    try {
      const response = await fetch(`/api/admin/clinics/${clinic.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(data), officeHours: hours, ...(nextPolicy ? { bookingPolicy: nextPolicy } : {}) }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setMessage(typeof result.message === "string" ? result.message : "Unable to update clinic."); return; }
      router.replace("/admin/clinics"); router.refresh();
    } catch { setMessage("Unable to update clinic. Check your connection and try again."); } finally { setSaving(false); }
  }

  return <form action={save} className="space-y-5">
    <SettingsCard title="Basic Information"><div className="grid gap-4 sm:grid-cols-2">{basicFields.map((field) => <Field key={field.name} field={field} clinic={clinic} disabled={saving} />)}</div></SettingsCard>
    <SettingsCard title="Location"><div className="grid gap-4 sm:grid-cols-2">{locationFields.map((field) => <Field key={field.name} field={field} clinic={clinic} disabled={saving} />)}</div></SettingsCard>
    <SettingsCard title="Business Hours" description="Clinic operating hours are stored separately from individual doctor schedules. Times use this clinic's timezone."><div className="grid gap-3">{BUSINESS_HOUR_DAYS.map((day) => { const schedule = hours[day]; return <fieldset key={day} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-[minmax(7rem,1fr)_auto_minmax(8rem,1fr)_minmax(8rem,1fr)] sm:items-end"><legend className="sr-only">{label(day)} business hours</legend><p className="font-medium">{label(day)}</p><label className="flex min-h-11 items-center gap-2 text-sm"><input aria-label={`${label(day)} open`} type="checkbox" checked={schedule.enabled} disabled={saving} onChange={(event) => updateDay(day, { enabled: event.target.checked })} />Open</label><TimeField label="Opening time" value={schedule.open} disabled={saving || !schedule.enabled} onChange={(open) => updateDay(day, { open })} /><TimeField label="Closing time" value={schedule.close} disabled={saving || !schedule.enabled} onChange={(close) => updateDay(day, { close })} /></fieldset>; })}</div></SettingsCard>
    <SettingsCard title="Booking Policy" description="These clinic-specific limits control how far ahead and how close to an appointment bookings can be made.">{policyAvailable ? <div className="grid gap-4 sm:grid-cols-3"><PolicyField label="Minimum notice (minutes)" value={policy.minimumBookingNoticeMinutes} disabled={saving} onChange={(value) => setPolicy((current) => ({ ...current, minimumBookingNoticeMinutes: value }))} /><PolicyField label="Maximum horizon (days)" value={policy.maximumBookingHorizonDays} disabled={saving} onChange={(value) => setPolicy((current) => ({ ...current, maximumBookingHorizonDays: value }))} /><PolicyField label="Slot interval (minutes)" value={policy.slotIntervalMinutes} disabled={saving} onChange={(value) => setPolicy((current) => ({ ...current, slotIntervalMinutes: value }))} /></div> : <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Booking policy is unavailable until the approved booking-policy migration is applied.</p>}</SettingsCard>
    <SettingsCard title="System information"><dl className="grid gap-3 text-sm sm:grid-cols-3"><System label="Clinic ID" value={clinic.id} /><System label="Slug" value={clinic.slug} /><System label="Created" value={clinic.created_at ? new Date(clinic.created_at).toLocaleString() : "—"} /></dl></SettingsCard>
    {message && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>}
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={saving} onClick={() => router.push("/admin/clinics")} className="min-h-11 rounded-lg border px-5 font-semibold disabled:opacity-60">Cancel</button><button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving…" : "Save Changes"}</button></div>
  </form>;
}

function SettingsCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) { return <section className="rounded-2xl border bg-background p-5 sm:p-6"><h2 className="text-lg font-semibold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}<div className="mt-5">{children}</div></section>; }
function Field({ field, clinic, disabled }: { field: Field; clinic: Clinic; disabled: boolean }) { return <label className="grid gap-1 text-sm font-medium">{field.label}<input name={field.name} type={field.type ?? "text"} inputMode={field.inputMode} required={field.required} disabled={disabled} defaultValue={clinic[field.name] ?? ""} className="min-h-11 rounded-lg border bg-background px-3 disabled:opacity-60" /></label>; }
function TimeField({ label: text, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) { return <label className="grid gap-1 text-sm font-medium">{text}<input aria-label={text} type="time" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-lg border bg-background px-3 disabled:cursor-not-allowed disabled:opacity-50" /></label>; }
function PolicyField({ label: text, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) { return <label className="grid gap-1 text-sm font-medium">{text}<input aria-label={text} type="number" min="0" step="1" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-lg border bg-background px-3 disabled:opacity-60" /></label>; }
function System({ label: text, value }: { label: string; value: string }) { return <div><dt className="font-medium">{text}</dt><dd className="mt-1 break-all text-muted-foreground">{value}</dd></div>; }
function label(day: DayOfWeek) { return `${day.slice(0, 1).toUpperCase()}${day.slice(1)}`; }
