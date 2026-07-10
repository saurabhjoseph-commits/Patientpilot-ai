"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";

export default function RegisterPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const { error } =
      await signUp(email, password);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Account created successfully."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-3xl font-bold">
          Register
        </h1>

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="mb-4 w-full rounded border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="w-full rounded bg-blue-600 py-3 text-white">
          Create Account
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