import {
  CalendarCheck,
  UserPlus,
  Clock,
} from "lucide-react";

interface Contact {
  id: string;
  clinic_name: string;
  created_at: string;
}

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  created_at: string;
}

interface ActivityFeedProps {
  contacts: Contact[];
  appointments: Appointment[];
}

export default function ActivityFeed({
  contacts,
  appointments,
}: ActivityFeedProps) {
  const activities = [
    ...(appointments ?? []).map((appointment) => ({
      id: `appointment-${appointment.id}`,
      type: "appointment",
      title: "Appointment Booked",
      name: appointment.patient_name,
      subtitle: `${appointment.appointment_date} • ${appointment.appointment_time}`,
      created_at: appointment.created_at,
    })),

    ...(contacts ?? []).map((contact) => ({
      id: `contact-${contact.id}`,
      type: "lead",
      title: "New Lead",
      name: contact.clinic_name,
      subtitle: "Website Contact Form",
      created_at: contact.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 8);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Activity
          </h2>

          <p className="text-sm text-slate-500">
            Latest AI Receptionist activity
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No recent activity yet.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >
              <div
                className={`rounded-xl p-3 ${
                  activity.type === "appointment"
                    ? "bg-green-100"
                    : "bg-blue-100"
                }`}
              >
                {activity.type === "appointment" ? (
                  <CalendarCheck className="h-6 w-6 text-green-600" />
                ) : (
                  <UserPlus className="h-6 w-6 text-blue-600" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {activity.title}
                </h3>

                <p className="mt-1 font-medium text-slate-700">
                  {activity.name}
                </p>

                <p className="text-sm text-slate-500">
                  {activity.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4" />

                {new Date(
                  activity.created_at
                ).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}