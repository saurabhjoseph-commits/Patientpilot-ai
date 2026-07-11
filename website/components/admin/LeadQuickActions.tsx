"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CRMCard from "./CRMCard";
import Button from "@/components/ui/Button";

import { Lead } from "@/types/crm";

interface QuickActionsProps {
  lead: Lead;
}

type ActionType =
  | "contacted"
  | "schedule-demo"
  | "convert";

export default function QuickActions({
  lead,
}: QuickActionsProps) {
  const router = useRouter();

  const [loadingAction, setLoadingAction] =
    useState<ActionType | null>(null);

  async function performAction(
    action: ActionType
  ) {
    setLoadingAction(action);

    try {
      const body: Record<string, unknown> = {
        leadId: lead.id,
        action,
      };

      // Default demo date = tomorrow
      if (
        action === "schedule-demo" &&
        !lead.demo_date
      ) {
        body.demoDate = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0];
      }

      const response = await fetch(
        "/api/admin/quick-actions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to complete action."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <CRMCard title="Quick Actions">
      <div className="space-y-3">
        <a
          href={`tel:${lead.phone}`}
          className="block rounded-lg bg-green-600 px-5 py-3 text-center font-medium text-white transition hover:bg-green-700"
        >
          📞 Call Clinic
        </a>

        <a
          href={`mailto:${lead.email}`}
          className="block rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
        >
          ✉️ Send Email
        </a>

        <Button
          variant="warning"
          fullWidth
          loading={
            loadingAction ===
            "contacted"
          }
          onClick={() =>
            performAction(
              "contacted"
            )
          }
        >
          ☎️ Mark Contacted
        </Button>

        <Button
          variant="primary"
          fullWidth
          loading={
            loadingAction ===
            "schedule-demo"
          }
          onClick={() =>
            performAction(
              "schedule-demo"
            )
          }
        >
          📅 Schedule Demo
        </Button>

        <Button
          variant="success"
          fullWidth
          loading={
            loadingAction ===
            "convert"
          }
          onClick={() =>
            performAction(
              "convert"
            )
          }
        >
          🏥 Convert to Patient
        </Button>
      </div>
    </CRMCard>
  );
}