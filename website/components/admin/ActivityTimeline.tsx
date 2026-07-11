import CRMCard from "./CRMCard";
import { Clock3 } from "lucide-react";

import { LeadActivity } from "@/types/crm";
import {
  relativeTime,
  formatDateTime,
} from "@/lib/date";

interface ActivityTimelineProps {
  activities: LeadActivity[];
}

export default function ActivityTimeline({
  activities,
}: ActivityTimelineProps) {
  return (
    <CRMCard title="Activity Timeline">
      {activities.length === 0 ? (
        <div className="py-10 text-center">
          <Clock3
            size={42}
            className="mx-auto mb-4 text-gray-300"
          />

          <p className="font-medium text-gray-700">
            No activity yet
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Status updates, notes, demos,
            emails and phone calls will
            automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="relative pl-10"
            >
              {/* Timeline Line */}
              {index !==
                activities.length - 1 && (
                <div className="absolute left-[11px] top-7 h-full w-0.5 bg-gray-200" />
              )}

              {/* Timeline Dot */}
              <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                <Clock3
                  size={12}
                  className="text-white"
                />
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {activity.type}
                  </span>

                  <span
                    title={formatDateTime(
                      activity.created_at
                    )}
                    className="text-xs text-gray-500"
                  >
                    {relativeTime(
                      activity.created_at
                    )}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-800">
                  {activity.description}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  {formatDateTime(
                    activity.created_at
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CRMCard>
  );
}