"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { validateNewPassword } from "@/lib/auth/password-recovery";
import { createClient } from "@/lib/supabase/browser";

type RecoveryState = "checking" | "valid" | "invalid" | "complete";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<RecoveryState>("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    const recoveryError = new URLSearchParams(window.location.search).get("error");
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (active && event === "PASSWORD_RECOVERY") setState("valid");
    });

    async function establishRecoverySession() {
      if (recoveryError === "invalid_recovery_link") {
        setState("invalid");
        window.history.replaceState({}, "", "/reset-password");
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        if (active) setState("valid");
        return;
      }

      // A valid session can only be established by the server-side callback.
      window.setTimeout(() => {
        if (active) setState((current) => current === "checking" ? "invalid" : current);
      }, 500);
    }

    void establishRecoverySession();
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const passwordError = validateNewPassword(password);
    if (passwordError) return setError(passwordError);
    if (password !== confirmation) return setError("Passwords do not match.");
    if (state !== "valid") return setError("This recovery link is invalid or has expired.");

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("This recovery link is invalid or has expired. Request a new link and try again.");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setError("This recovery link is invalid or has expired. Request a new link and try again.");
      setLoading(false);
      return;
    }

    const syncResponse = await fetch("/api/auth/complete-password-recovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, password }),
    });
    if (!syncResponse.ok) {
      setError("Unable to complete password reset. Contact support if the problem continues.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setState("complete");
    window.setTimeout(() => router.replace("/login?reset=success"), 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Choose a new password</h1>
        <p className="mb-8 text-center text-gray-500">Use at least 12 characters with uppercase, lowercase, and a number.</p>

        {state === "invalid" && <p role="alert" className="mb-4 text-sm text-red-600">This recovery link is invalid or has expired. Request a new link.</p>}
        {state === "complete" && <p role="status" className="mb-4 text-sm text-green-700">Password updated. Redirecting to sign in…</p>}

        <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">New password</label>
        <div className="mb-4 flex gap-2">
          <input id="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" className="w-full rounded-lg border p-3" value={password} onChange={(event) => setPassword(event.target.value)} disabled={state !== "valid" || loading} required />
          <button type="button" className="rounded-lg border px-3 text-sm" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button>
        </div>

        <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">Confirm new password</label>
        <input id="confirm-password" type={showPassword ? "text" : "password"} autoComplete="new-password" className="mb-4 w-full rounded-lg border p-3" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={state !== "valid" || loading} required />

        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={state !== "valid" || loading} className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "Updating password..." : "Update password"}</button>
        <p className="mt-6 text-center text-sm"><Link href="/forgot-password" className="text-blue-600 hover:underline">Request a new link</Link></p>
      </form>
    </main>
  );
}
