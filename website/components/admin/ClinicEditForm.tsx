"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Clinic = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  timezone: string | null;
  slug: string;
  created_at: string | null;
};

type Field = {
  label: string;
  name: keyof Pick<Clinic, "name" | "phone" | "email" | "website" | "address" | "city" | "state" | "country" | "timezone">;
  type?: "email" | "text" | "url";
  inputMode?: "tel";
  required?: boolean;
};

const fields: readonly Field[] = [
  { label: "Clinic name", name: "name", required: true },
  { label: "Phone number", name: "phone", inputMode: "tel" },
  { label: "Email", name: "email", type: "email" },
  { label: "Website", name: "website", type: "url" },
  { label: "Address", name: "address" },
  { label: "City", name: "city" },
  { label: "State", name: "state" },
  { label: "Country", name: "country" },
  { label: "Timezone", name: "timezone" },
];

export default function ClinicEditForm({ clinic }: { clinic: Clinic }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function save(data: FormData) {
    setSaving(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await fetch(`/api/admin/clinics/${clinic.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setIsError(true);
        setMessage(result.message ?? "Unable to update clinic.");
        return;
      }
      setMessage("Clinic updated successfully.");
      router.refresh();
    } catch {
      setIsError(true);
      setMessage("Unable to update clinic. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={save} className="grid gap-4 rounded-2xl border bg-background p-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="text-lg font-semibold">Basic information</h2>
      </div>
      {fields.map((field) => (
        <label key={field.name} className="grid gap-1 text-sm font-medium">
          {field.label}
          <input
            name={field.name}
            type={field.type ?? "text"}
            inputMode={field.inputMode}
            required={field.required}
            defaultValue={clinic[field.name] ?? ""}
            className="min-h-11 rounded-lg border bg-background px-3"
          />
        </label>
      ))}
      <section className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 sm:col-span-2">
        <h2 className="font-semibold text-slate-900">System information</h2>
        <dl className="mt-2 grid gap-2 sm:grid-cols-3">
          <div><dt className="font-medium">Clinic ID</dt><dd className="break-all">{clinic.id}</dd></div>
          <div><dt className="font-medium">Slug</dt><dd>{clinic.slug}</dd></div>
          <div><dt className="font-medium">Created</dt><dd>{clinic.created_at ? new Date(clinic.created_at).toLocaleString() : "—"}</dd></div>
        </dl>
      </section>
      {message && (
        <p role="status" className={`text-sm sm:col-span-2 ${isError ? "text-red-700" : "text-green-700"}`}>
          {message}
        </p>
      )}
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button type="submit" disabled={saving} className="min-h-11 rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button type="button" disabled={saving} onClick={() => router.back()} className="min-h-11 rounded-lg border px-5 disabled:opacity-60">
          Cancel
        </button>
      </div>
    </form>
  );
}
