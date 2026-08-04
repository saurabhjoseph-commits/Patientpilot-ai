"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { isValidRecoveryEmail, PASSWORD_RECOVERY_MESSAGE } from "@/lib/auth/password-recovery";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!isValidRecoveryEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/auth/password-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // The response remains neutral even when delivery cannot be confirmed.
    } finally {
      setMessage(PASSWORD_RECOVERY_MESSAGE);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold">Reset your password</h1>
        <p className="mb-8 text-center text-gray-500">We will send a secure reset link if the account is eligible.</p>

        <label htmlFor="recovery-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
        <input
          id="recovery-email"
          type="email"
          autoComplete="email"
          className="mb-4 w-full rounded-lg border p-3"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={error ? "recovery-error" : undefined}
          required
        />

        {error && <p id="recovery-error" role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
        {message && <p role="status" className="mb-4 text-sm text-green-700">{message}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Sending link..." : "Send reset link"}
        </button>

        <p className="mt-6 text-center text-sm"><Link href="/login" className="text-blue-600 hover:underline">Back to sign in</Link></p>
      </form>
    </main>
  );
}
