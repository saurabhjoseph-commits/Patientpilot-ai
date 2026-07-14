"use client";

import { useState } from "react";

interface Props {
  loading: boolean;

  onSend(
    message: string
  ): void;
}

export default function MessageInput({
  loading,
  onSend,
}: Props) {
  const [message, setMessage] =
    useState("");

  function submit() {
    const value = message.trim();

    if (!value) {
      return;
    }

    onSend(value);

    setMessage("");
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <label className="mb-2 block font-medium">
        Patient Message
      </label>

      <textarea
        rows={5}
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        className="w-full rounded-lg border px-4 py-3"
        placeholder="I'd like to book a cleaning tomorrow."
      />

      <button
        onClick={submit}
        disabled={loading}
        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading
          ? "Thinking..."
          : "Send Message"}
      </button>

    </div>
  );
}