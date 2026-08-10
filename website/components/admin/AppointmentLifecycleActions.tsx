"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Action = "confirm" | "check-in" | "complete" | "cancel";

interface AppointmentLifecycleActionsProps {
  id: string;
  status: string;
  checkedInAt: string | null;
  completedAt: string | null;
  compact?: boolean;
  canManage?: boolean;
}

export default function AppointmentLifecycleActions({
  id,
  status,
  checkedInAt,
  completedAt,
  compact = false,
  canManage = true,
}: AppointmentLifecycleActionsProps) {
  const router = useRouter();
  const [saving, setSaving] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const closed = status === "Cancelled" || Boolean(completedAt);

  async function act(action: Action) {
    if (action === "cancel" && !window.confirm("Cancel this appointment? It will remain in the appointment history.")) return;
    setSaving(action);
    setError(null);
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message ?? "Unable to update appointment.");
        return;
      }
      router.refresh();
    } catch {
      setError("Unable to update appointment. Check your connection and try again.");
    } finally {
      setSaving(null);
    }
  }

  const controls = canManage && !closed && (
    <div className="flex flex-wrap gap-2">
      {status !== "Confirmed" && <Button label="Confirm" action="confirm" onClick={act} saving={saving} compact={compact} />}
      {!checkedInAt && <Button label="Check in" action="check-in" onClick={act} saving={saving} compact={compact} />}
      {checkedInAt && <Button label="Complete" action="complete" onClick={act} saving={saving} compact={compact} />}
      <Button label="Cancel" action="cancel" onClick={act} saving={saving} danger compact={compact} />
    </div>
  );

  if (compact) return <div className="space-y-2">{controls}{error && <p role="alert" className="text-xs text-red-600">{error}</p>}</div>;

  return (
    <section className="rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-bold">Appointment actions</h2>
      <div className="mt-3">{controls}</div>
      <p className="mt-3 text-sm text-slate-500">
        {checkedInAt ? `Checked in: ${new Date(checkedInAt).toLocaleString()}` : "Not checked in"}
        {completedAt ? ` · Completed: ${new Date(completedAt).toLocaleString()}` : ""}
      </p>
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}

function Button({ label, action, onClick, saving, danger, compact }: { label: string; action: Action; onClick: (action: Action) => void; saving: Action | null; danger?: boolean; compact: boolean }) {
  return (
    <button
      type="button"
      disabled={Boolean(saving)}
      onClick={() => onClick(action)}
      className={`min-h-11 rounded-lg font-semibold text-white disabled:opacity-60 ${compact ? "px-3 text-xs" : "px-4 text-sm"} ${danger ? "bg-red-600" : "bg-blue-600"}`}
    >
      {saving === action ? "Saving…" : label}
    </button>
  );
}
