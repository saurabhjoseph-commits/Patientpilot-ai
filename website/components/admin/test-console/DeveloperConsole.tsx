"use client";

import { useEffect, useState } from "react";

import ConversationPanel from "./ConversationPanel";
import MessageInput from "./MessageInput";
import SessionPanel from "./SessionPanel";
import StatusCards from "./StatusCards";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface WorkflowResponse {
  success: boolean;

  callSid: string;

  completed?: boolean;

  state?: string;

  intent?: string;

  analysis?: {
    completed: boolean;
    confidence?: number;
    reason?: string;
  };

  workflowStatus?: {
    appointmentCreated: boolean;
    patientCreated: boolean;
    summaryCreated: boolean;
  };

  ai?: {
    response: {
      message: string;
    };
  };

  session?: {
    state: string;
    intent: string;
  };

  appointment?: unknown | null;

  patient?: unknown | null;

  summary?: unknown | null;

  error?: string;
}

export default function DeveloperConsole() {
  /**
   * Hydration-safe Call SID.
   */
  const [callSid, setCallSid] =
    useState("");

  useEffect(() => {
    setCallSid(
      `TEST-${crypto.randomUUID()}`
    );
  }, []);

  const [messages, setMessages] =
    useState<ConversationMessage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [state, setState] =
    useState("idle");

  const [intent, setIntent] =
    useState("unknown");

  const [completed, setCompleted] =
    useState(false);

  const [
    appointmentCreated,
    setAppointmentCreated,
  ] = useState(false);

  const [
    patientCreated,
    setPatientCreated,
  ] = useState(false);

  const [
    summaryCreated,
    setSummaryCreated,
  ] = useState(false);

  function resetConversation() {
    setMessages([]);

    setState("idle");

    setIntent("unknown");

    setCompleted(false);

    setAppointmentCreated(false);

    setPatientCreated(false);

    setSummaryCreated(false);

    setCallSid(
      `TEST-${crypto.randomUUID()}`
    );
  }

  async function handleSend(
    message: string
  ) {
    /**
     * Wait until the client has
     * generated the Call SID.
     */
    if (!callSid) {
      return;
    }

    setLoading(true);

    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      },
    ]);

    try {
      const response = await fetch(
        "/api/test-console",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            callSid,
            message,
          }),
        }
      );

      const data: WorkflowResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            "Developer Console request failed."
        );
      }

      if (data.state) {
        setState(data.state);
      } else if (data.session) {
        setState(data.session.state);
      }

      if (data.intent) {
        setIntent(data.intent);
      } else if (data.session) {
        setIntent(data.session.intent);
      }

      setCompleted(
        data.completed ??
          data.analysis?.completed ??
          false
      );

      if (data.workflowStatus) {
        setAppointmentCreated(
          data.workflowStatus
            .appointmentCreated
        );

        setPatientCreated(
          data.workflowStatus
            .patientCreated
        );

        setSummaryCreated(
          data.workflowStatus
            .summaryCreated
        );
      } else {
        setAppointmentCreated(
          !!data.appointment
        );

        setPatientCreated(
          !!data.patient
        );

        setSummaryCreated(
          !!data.summary
        );
      }

      const aiMessage =
        data.ai?.response?.message;

      if (aiMessage) {
        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiMessage,
          },
        ]);
      }
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Unknown server error.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              AI Conversation Simulator
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Test the complete
              PatientPilot AI workflow
              without making a Twilio
              phone call.
            </p>
          </div>

          <button
            onClick={resetConversation}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Reset Session
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm">
            <span className="font-semibold">
              Call SID:
            </span>{" "}
            {callSid || "Initializing..."}
          </div>

          <div
            className={`rounded-lg px-4 py-3 text-sm font-semibold ${
              completed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {completed
              ? "Conversation Complete"
              : "Conversation In Progress"}
          </div>
        </div>
      </div>

      <StatusCards
        appointmentReady={
          appointmentCreated
        }
        patientReady={
          patientCreated
        }
        summaryReady={
          summaryCreated
        }
      />

      <SessionPanel
        callSid={callSid}
        state={state}
        intent={intent}
        loading={loading}
      />

      <ConversationPanel
        messages={messages}
      />

      <MessageInput
        loading={
          loading || !callSid
        }
        onSend={handleSend}
      />
    </div>
  );
}