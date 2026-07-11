import CRMCard from "./CRMCard";

import { Lead } from "@/types/crm";
import {
  getStatusStyle,
} from "@/lib/crm-status";
import {
  formatDateTime,
} from "@/lib/date";

interface LeadSummaryProps {
  lead: Lead;
}

export default function LeadSummary({
  lead,
}: LeadSummaryProps) {
  const statusStyle =
    getStatusStyle(lead.status);

  return (
    <CRMCard title="Lead Summary">
      <div className="space-y-5">
        {/* Lead ID */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Lead ID
          </span>

          <span className="font-semibold">
            #{lead.id}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Status
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {lead.status}
          </span>
        </div>

        {/* Monthly Calls */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Monthly Calls
          </span>

          <span className="font-semibold">
            {lead.monthly_calls}
          </span>
        </div>

        {/* Demo Date */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Demo Date
          </span>

          <span className="font-medium">
            {lead.demo_date
              ? formatDateTime(
                  lead.demo_date
                )
              : "-"}
          </span>
        </div>

        {/* Contacted */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Contacted
          </span>

          <span className="font-medium">
            {lead.contacted_at
              ? formatDateTime(
                  lead.contacted_at
                )
              : "-"}
          </span>
        </div>

        {/* Converted */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Converted
          </span>

          <span
            className={
              lead.converted
                ? "font-semibold text-green-600"
                : "text-gray-500"
            }
          >
            {lead.converted
              ? "Yes"
              : "No"}
          </span>
        </div>

        {/* Created */}
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm text-gray-500">
            Created
          </span>

          <span className="font-medium">
            {formatDateTime(
              lead.created_at
            )}
          </span>
        </div>

        {/* Updated */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Last Updated
          </span>

          <span className="font-medium">
            {lead.updated_at
              ? formatDateTime(
                  lead.updated_at
                )
              : "-"}
          </span>
        </div>
      </div>
    </CRMCard>
  );
}