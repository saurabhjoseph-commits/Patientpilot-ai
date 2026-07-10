"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await resetPassword(email);

    setMessage(
      "Password reset email sent."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-3xl font-bold">
          Forgot Password
        </h1>

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button className="w-full rounded bg-blue-600 py-3 text-white">
          Reset Password
        </button>

        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}