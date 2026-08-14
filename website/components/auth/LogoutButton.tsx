"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className, onComplete }: { className?: string; onComplete?: () => void }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  async function handleLogout() {
    if (busy) return; setBusy(true); setError(null);
    try {
      const response = await fetch("/api/auth/sign-out", { method: "POST" });
      if (!response.ok) { setError("Unable to sign out. Please try again."); return; }
      onComplete?.(); router.replace("/login"); router.refresh();
    } catch { setError("Unable to sign out. Please try again."); }
    finally { setBusy(false); }
  }
  return <div><button type="button" disabled={busy} onClick={() => void handleLogout()} className={className ?? "inline-flex min-h-11 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"}><LogOut className="h-5 w-5" />{busy ? "Signing out…" : "Sign out"}</button>{error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}</div>;
}
