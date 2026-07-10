import { startOfMonth } from "date-fns";

type Contact = {
  id: string;
  created_at: string;
  source?: string | null;
};

type Appointment = {
  id: string;
  created_at: string;
  status?: string | null;
};

export interface DashboardAnalytics {
  totalLeads: number;
  totalAppointments: number;
  aiCallsToday: number;
  revenuePotential: number;

  revenueTrend: {
    month: string;
    revenue: number;
  }[];

  callsTrend: {
    day: string;
    calls: number;
  }[];

  appointmentTrend: {
    month: string;
    scheduled: number;
    recovered: number;
  }[];

  leadSources: {
    name: string;
    value: number;
  }[];
}

export function buildDashboardAnalytics(
  contacts: Contact[],
  appointments: Appointment[]
): DashboardAnalytics {

  const today = new Date().toDateString();

  const totalLeads = contacts.length;

  const totalAppointments = appointments.length;

  const aiCallsToday = appointments.filter(
    (appointment) =>
      new Date(appointment.created_at).toDateString() === today
  ).length;

  const revenuePotential = totalAppointments * 150;

  const revenueTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const count = appointments.filter((appointment) => {
      const created = new Date(appointment.created_at);

      return (
        created.getMonth() === date.getMonth() &&
        created.getFullYear() === date.getFullYear()
      );
    }).length;

    return {
      month,
      revenue: count * 150,
    };
  });

  const callsTrend = (() => {
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const count = appointments.filter((appointment) => {
        const created = new Date(appointment.created_at);

        return (
          created.toDateString() === day.toDateString()
        );
      }).length;

      result.push({
        day: day.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        calls: count,
      });
    }

    return result;
  })();

  const appointmentTrend = revenueTrend.map((month) => ({
    month: month.month,
    scheduled: Math.round(month.revenue / 150),
    recovered: Math.round((month.revenue / 150) * 0.35),
  }));

  const sourceMap = new Map<string, number>();

  contacts.forEach((contact) => {
    const source = contact.source || "Unknown";

    sourceMap.set(
      source,
      (sourceMap.get(source) || 0) + 1
    );
  });

  const leadSources = Array.from(sourceMap.entries()).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return {
    totalLeads,
    totalAppointments,
    aiCallsToday,
    revenuePotential,
    revenueTrend,
    callsTrend,
    appointmentTrend,
    leadSources,
  };
}