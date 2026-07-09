import Link from "next/link";
import {
  CalendarDays,
  Users,
  Globe,
  PhoneCall,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Appointments",
    description: "View AI booked appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Leads",
    description: "Manage incoming leads",
    href: "/admin",
    icon: Users,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Website",
    href: "/",
    description: "Open PatientPilot website",
    icon: Globe,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "AI Demo",
    href: "/#demo",
    description: "Launch AI Receptionist demo",
    icon: PhoneCall,
    color: "bg-purple-100 text-purple-700",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="text-sm text-slate-500">
          Frequently used shortcuts
        </p>
      </div>

      <div className="grid gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-xl p-3 ${action.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {action.description}
                  </p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-cyan-600" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}