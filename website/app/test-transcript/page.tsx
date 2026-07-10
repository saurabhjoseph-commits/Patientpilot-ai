"use client";

import { useState } from "react";

export default function TestTranscriptPage() {
  const [callId, setCallId] = useState("");

  async function saveTranscript() {
    try {
      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_id: callId.trim(),
          sender: "ai",
          message: "Hello! Thank you for calling PatientPilot AI.",
        }),
      });

      const text = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", text);

      alert(text);
    } catch (error) {
      console.error(error);
      alert("Request failed");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100">
      <input
        value={callId}
        onChange={(e) => setCallId(e.target.value)}
        placeholder="Paste Call ID"
        className="w-[500px] rounded border p-3"
      />

      <button
        onClick={saveTranscript}
        className="rounded bg-blue-600 px-8 py-3 text-white"
      >
        Save Transcript
      </button>
    </main>
  );
}