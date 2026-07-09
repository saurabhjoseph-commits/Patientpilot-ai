import {
  Users,
  CalendarDays,
  PhoneCall,
  DollarSign,
} from "lucide-react";

interface StatsGridProps {
  totalLeads: number;
  totalAppointments: number;
  aiCallsToday: number;
  revenuePotential: number;
}

export default function StatsGrid({
  totalLeads,
  totalAppointments,
  aiCallsToday,
  revenuePotential,
}: StatsGridProps) {
  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      bg: "bg-white",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-slate-900",
      subtitle: "Captured from website",
    },
    {
      title: "AI Appointments",
      value: totalAppointments,
      icon: CalendarDays,
      bg: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      valueColor: "text-cyan-700",
      subtitle: "Booked automatically",
    },
    {
      title: "AI Calls Today",
      value: aiCallsToday,
      icon: PhoneCall,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
      subtitle: "Today's conversations",
    },
    {
      title: "Revenue Potential",
      value: `$${revenuePotential}`,
      icon: DollarSign,
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-700",
      subtitle: "Estimated value",
    },
  ];

  return (
    <section className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`${stat.bg} group rounded-3xl border border-slate-200 p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2
                  className={`mt-3 text-4xl font-bold ${stat.valueColor}`}
                >
                  {stat.value}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {stat.subtitle}
                </p>
              </div>

              <div
                className={`${stat.iconBg} rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon
                  className={`h-8 w-8 ${stat.iconColor}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}