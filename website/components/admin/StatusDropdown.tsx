"use client";

import { useState } from "react";

import { LEAD_STATUSES } from "@/lib/crm-status";
import { Lead } from "@/types/crm";

interface Props {
  lead: Lead;
}

export default function StatusDropdown({
  lead,
}: Props) {
  const [status, setStatus] =
    useState(lead.status);

  const [saving, setSaving] =
    useState(false);

  async function updateStatus(
    value: Lead["status"]
  ) {
    if (value === status) return;

    setSaving(true);

    try {
      const response = await fetch(
        `/api/leads/${lead.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: value,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to update status."
        );
      }

      setStatus(value);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update status."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-600">
        Lead Status
      </label>

      <select
        value={status}
        disabled={saving}
        onChange={(e) =>
          updateStatus(
            e.target.value as Lead["status"]
          )
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
      >
        {LEAD_STATUSES.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      {saving && (
        <p className="text-xs text-gray-500">
          Saving...
        </p>
      )}
    </div>
  );
}