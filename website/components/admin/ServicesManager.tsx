"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Service = { id: string; name: string; code: string | null; description: string | null; category: string | null; default_duration_minutes: number; default_price: number | null; currency: string | null; active: boolean; emergency: boolean; };
type Draft = { id?: string; name: string; code: string; description: string; category: string; defaultDurationMinutes: string; defaultPrice: string; currency: string; active: boolean; emergency: boolean; };

const emptyDraft: Draft = { name: "", code: "", description: "", category: "", defaultDurationMinutes: "", defaultPrice: "", currency: "", active: true, emergency: false };

export default function ServicesManager({ services, clinicId }: { services: readonly Service[]; clinicId?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setMessage(null);
    try {
      const response = await fetch("/api/admin/services", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...draft, clinicId }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setMessage(typeof result.message === "string" ? result.message : "Unable to save service."); return; }
      setDraft(emptyDraft); router.refresh();
    } catch { setMessage("Unable to save service. Check your connection and try again."); } finally { setSaving(false); }
  }
  function edit(service: Service) { setDraft({ id: service.id, name: service.name, code: service.code ?? "", description: service.description ?? "", category: service.category ?? "", defaultDurationMinutes: String(service.default_duration_minutes), defaultPrice: service.default_price === null ? "" : String(service.default_price), currency: service.currency ?? "", active: service.active, emergency: service.emergency }); }
  return <div className="space-y-5"><form onSubmit={save} className="grid gap-4 rounded-2xl border bg-background p-5 sm:grid-cols-2"><h2 className="sm:col-span-2 text-lg font-semibold">{draft.id ? "Edit service" : "Add service"}</h2><Input label="Service name" value={draft.name} required onChange={(name) => setDraft((current) => ({ ...current, name }))} /><Input label="Default duration (minutes)" value={draft.defaultDurationMinutes} type="number" required onChange={(defaultDurationMinutes) => setDraft((current) => ({ ...current, defaultDurationMinutes }))} /><Input label="Code" value={draft.code} onChange={(code) => setDraft((current) => ({ ...current, code }))} /><Input label="Category" value={draft.category} onChange={(category) => setDraft((current) => ({ ...current, category }))} /><Input label="Default price" value={draft.defaultPrice} type="number" onChange={(defaultPrice) => setDraft((current) => ({ ...current, defaultPrice }))} /><Input label="Currency" value={draft.currency} onChange={(currency) => setDraft((current) => ({ ...current, currency }))} /><label className="grid gap-1 text-sm font-medium sm:col-span-2">Description<textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="min-h-20 rounded-lg border bg-background px-3 py-2" /></label><label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft((current) => ({ ...current, active: event.target.checked }))} />Active</label><label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={draft.emergency} onChange={(event) => setDraft((current) => ({ ...current, emergency: event.target.checked }))} />Emergency service</label><div className="flex gap-3 sm:col-span-2"><button disabled={saving} className="min-h-11 rounded-lg bg-blue-600 px-4 font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : draft.id ? "Save service" : "Create service"}</button>{draft.id && <button type="button" onClick={() => setDraft(emptyDraft)} className="min-h-11 rounded-lg border px-4 font-semibold">Cancel edit</button>}</div></form><div className="grid gap-3 md:grid-cols-2">{services.map((service) => <article key={service.id} className="rounded-xl border bg-background p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{service.name}</h2><p className="text-sm text-muted-foreground">{service.default_duration_minutes} minutes{service.category ? ` · ${service.category}` : ""}</p></div><span className={`rounded-full px-2 py-1 text-xs font-medium ${service.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{service.active ? "Active" : "Inactive"}</span></div>{service.description && <p className="mt-3 text-sm text-muted-foreground">{service.description}</p>}<div className="mt-4 flex gap-2"><button type="button" onClick={() => edit(service)} className="min-h-11 rounded-lg border px-3 text-sm font-medium">Edit</button><button type="button" onClick={() => { void saveToggle(service); }} className="min-h-11 rounded-lg border px-3 text-sm font-medium">{service.active ? "Deactivate" : "Activate"}</button></div></article>)}</div>{!services.length && <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">No services are configured. Add a service before assigning doctors or enabling AI booking.</p>}{message && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>}</div>;

  async function saveToggle(service: Service) {
    setSaving(true); setMessage(null);
    try {
      const response = await fetch("/api/admin/services", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: service.id, clinicId, name: service.name, code: service.code, description: service.description, category: service.category, defaultDurationMinutes: service.default_duration_minutes, defaultPrice: service.default_price, currency: service.currency, active: !service.active, emergency: service.emergency }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) setMessage(typeof result.message === "string" ? result.message : "Unable to update service."); else router.refresh();
    } catch { setMessage("Unable to update service. Check your connection and try again."); } finally { setSaving(false); }
  }
}

function Input({ label, value, type = "text", required = false, onChange }: { label: string; value: string; type?: "text" | "number"; required?: boolean; onChange: (value: string) => void }) { return <label className="grid gap-1 text-sm font-medium">{label}<input type={type} min={type === "number" ? "0" : undefined} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-lg border bg-background px-3" /></label>; }
