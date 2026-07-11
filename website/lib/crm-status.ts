// ======================================================
// PatientPilot AI CRM Status Configuration
// ======================================================

import { LeadStatus } from "@/types/crm";

/**
 * Ordered list of lead statuses
 */
export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Demo Scheduled",
  "Demo Completed",
  "Lost",
];

/**
 * Status badge colors
 * Tailwind classes
 */
export const STATUS_COLORS: Record<
  LeadStatus,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  "New": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },

  "Contacted": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },

  "Demo Scheduled": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },

  "Demo Completed": {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },

  "Lost": {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

/**
 * Returns true if the supplied string
 * is a valid lead status.
 */
export function isValidLeadStatus(
  status: string
): status is LeadStatus {
  return LEAD_STATUSES.includes(
    status as LeadStatus
  );
}

/**
 * Get the next logical status
 * used by workflow automation.
 */
export function getNextLeadStatus(
  current: LeadStatus
): LeadStatus | null {
  const index =
    LEAD_STATUSES.indexOf(current);

  if (
    index === -1 ||
    index ===
      LEAD_STATUSES.length - 1
  ) {
    return null;
  }

  return LEAD_STATUSES[index + 1];
}

/**
 * Returns badge styles
 */
export function getStatusStyle(
  status: LeadStatus
) {
  return STATUS_COLORS[status];
}

/**
 * Dashboard ordering
 */
export const STATUS_ORDER: Record<
  LeadStatus,
  number
> = {
  "New": 1,
  "Contacted": 2,
  "Demo Scheduled": 3,
  "Demo Completed": 4,
  "Lost": 5,
};