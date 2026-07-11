"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CRMCard from "./CRMCard";
import Button from "@/components/ui/Button";

import { Lead } from "@/types/crm";

interface LeadNotesProps {
  lead: Lead;
}

export default function LeadNotes({
  lead,
}: LeadNotesProps) {
  const router = useRouter();

  const [notes, setNotes] = useState(
    lead.notes ?? ""
  );

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function saveNotes() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/notes",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            leadId: lead.id,
            notes,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to save notes."
        );
      }

      setMessage(
        "Notes saved successfully."
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save notes."
      );
    } finally {
      setSaving(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }

  return (
    <CRMCard title="Internal Notes">
      <div className="space-y-5">
        <textarea
          rows={8}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Add private notes about this lead..."
          className="w-full rounded-lg border border-gray-300 p-4 text-sm leading-6 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Internal CRM notes are only visible to your team.
          </p>

          <Button
            variant="primary"
            loading={saving}
            onClick={saveNotes}
          >
            Save Notes
          </Button>
        </div>

        {message && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              message.includes(
                "successfully"
              )
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </CRMCard>
  );
}