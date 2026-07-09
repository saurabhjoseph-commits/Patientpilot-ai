"use client";

import { useEffect, useState } from "react";

import PhoneFrame from "./PhoneFrame";
import CallHeader from "./CallHeader";
import CallScreen from "./CallScreen";
import Conversation from "./Conversation";
import AppointmentCard from "./AppointmentCard";
import Controls from "./Controls";

import { saveAppointment } from "@/lib/appointments";
import { CallState } from "./types";

export default function AIReceptionist() {
  const [state, setState] = useState<CallState>("idle");
  const [saving, setSaving] = useState(false);

  // Automatically move from Ringing → Conversation
  useEffect(() => {
    if (state !== "ringing") return;

    const timer = setTimeout(() => {
      setState("conversation");
    }, 2200);

    return () => clearTimeout(timer);
  }, [state]);

  function startDemo() {
    setSaving(false);
    setState("ringing");
  }

  function restartDemo() {
    setSaving(false);
    setState("idle");
  }

  async function handleConversationComplete() {
    try {
      setSaving(true);

      await saveAppointment();

      console.log("✅ Appointment saved to Supabase");

      setTimeout(() => {
        setSaving(false);
        setState("confirmed");
      }, 800);
    } catch (error) {
      console.error("Failed to save appointment", error);

      setSaving(false);

      // Still continue so the demo never gets stuck
      setState("confirmed");
    }
  }

  return (
    <PhoneFrame>
      {(state === "conversation" ||
        state === "confirmed" ||
        saving) && <CallHeader />}

      {/* Idle */}
      {state === "idle" && (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-cyan-50 to-white px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            AI Receptionist
          </h2>

          <p className="mt-3 max-w-xs text-center text-slate-500">
            Experience how PatientPilot AI answers calls,
            speaks naturally with patients, and books
            appointments automatically.
          </p>

          <button
            onClick={startDemo}
            className="mt-10 rounded-2xl bg-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-cyan-700"
          >
            Call AI Receptionist
          </button>
        </div>
      )}

      {/* Ringing */}
      {state === "ringing" && (
        <CallScreen
          title="Calling..."
          subtitle="Connecting to PatientPilot AI Receptionist"
        />
      )}

      {/* Conversation */}
      {state === "conversation" && (
        <>
          <Conversation
            onComplete={handleConversationComplete}
          />

          <Controls
            onEnd={handleConversationComplete}
          />
        </>
      )}

      {/* Saving */}
      {saving && (
        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-cyan-50 to-white px-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />

          <h2 className="mt-8 text-2xl font-bold text-slate-900">
            Saving Appointment...
          </h2>

          <p className="mt-3 text-center text-slate-500">
            Creating your appointment in PatientPilot AI.
          </p>
        </div>
      )}

      {/* Confirmation */}
      {state === "confirmed" && (
        <AppointmentCard
          patientName="John Smith"
          service="Dental Cleaning"
          date="Thursday"
          time="2:00 PM"
          onRestart={restartDemo}
        />
      )}
    </PhoneFrame>
  );
}