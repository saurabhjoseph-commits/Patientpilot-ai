"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

import { Lead } from "@/types/crm";

interface DeleteLeadButtonProps {
  lead: Lead;
}

export default function DeleteLeadButton({
  lead,
}: DeleteLeadButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] =
    useState(false);

  async function deleteLead() {
    const confirmed = window.confirm(
      `Delete "${lead.clinic_name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `/api/leads/${lead.id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to delete lead."
        );
      }

      router.push("/admin/leads");

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete lead."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Button
      variant="danger"
      fullWidth
      loading={deleting}
      onClick={deleteLead}
    >
      🗑 Delete Lead
    </Button>
  );
}