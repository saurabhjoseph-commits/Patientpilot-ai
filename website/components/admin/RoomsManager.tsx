"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Room = { id: string; name: string; code: string | null; active: boolean };
type Assignment = { id: string; room_id: string; doctorName: string; active: boolean; effective_from: string | null; effective_to: string | null };

export default function RoomsManager({ rooms, assignments, canUpdate }: { rooms: Room[]; assignments: Assignment[]; canUpdate: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(input: { id?: string; name: string; code?: string; active: boolean }) {
    setSaving(true); setError(null);
    try { const response = await fetch("/api/admin/rooms", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }); if (!response.ok) { const data = await response.json().catch(() => ({})); setError(data.message ?? "Unable to save room."); return; } setName(""); setCode(""); router.refresh(); } catch { setError("Unable to save room. Check your connection and try again."); } finally { setSaving(false); }
  }

  return <div className="space-y-5">{canUpdate && <form action={() => save({ name, code, active: true })} className="grid gap-2 rounded-xl border bg-white p-4 sm:grid-cols-3"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Room / chair name" className="min-h-11 rounded border px-3"/><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code (optional)" className="min-h-11 rounded border px-3"/><button disabled={saving} className="min-h-11 rounded bg-blue-600 px-4 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Add room"}</button></form>}<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{rooms.map((room) => { const roomAssignments = assignments.filter((assignment) => assignment.room_id === room.id); const current = roomAssignments.filter((assignment) => assignment.active && (!assignment.effective_to || assignment.effective_to >= new Date().toISOString().slice(0, 10))); return <article key={room.id} className="rounded-xl border bg-white p-4"><p className="font-semibold">{room.name}</p><p className="text-sm text-slate-500">{room.code ?? "No code"}</p><p className="mt-2 text-xs">{room.active ? "Active" : "Inactive"}</p><section className="mt-4 border-t pt-3"><h2 className="text-sm font-semibold">Current assignments</h2>{current.length ? <ul className="mt-2 space-y-1 text-sm text-slate-600">{current.map((assignment) => <li key={assignment.id}>{assignment.doctorName} · {assignment.effective_from ?? "Current"}–{assignment.effective_to ?? "Open"}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">No current doctor assignment.</p>}{roomAssignments.length > current.length && <p className="mt-2 text-xs text-slate-500">{roomAssignments.length - current.length} historical assignment{roomAssignments.length - current.length === 1 ? "" : "s"}</p>}</section>{canUpdate && <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { const nextName = window.prompt("Room name", room.name); const nextCode = window.prompt("Room code", room.code ?? ""); if (nextName) save({ id: room.id, name: nextName, code: nextCode ?? undefined, active: room.active }); }} className="min-h-11 rounded border px-3 text-sm">Edit</button><button type="button" onClick={() => save({ id: room.id, name: room.name, code: room.code ?? undefined, active: !room.active })} className="min-h-11 rounded border px-3 text-sm">{room.active ? "Deactivate" : "Activate"}</button></div>}</article>; })}</div>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}</div>;
}
