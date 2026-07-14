"use client";

interface StatusCardsProps {
  appointmentReady: boolean;
  patientReady: boolean;
  summaryReady: boolean;
}

interface Card {
  title: string;
  ready: boolean;
}

export default function StatusCards({
  appointmentReady,
  patientReady,
  summaryReady,
}: StatusCardsProps) {
  const cards: Card[] = [
    {
      title: "Appointment",
      ready: appointmentReady,
    },
    {
      title: "Patient",
      ready: patientReady,
    },
    {
      title: "AI Summary",
      ready: summaryReady,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              {card.title}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                card.ready
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {card.ready ? "Ready" : "Pending"}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                card.ready
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }`}
            />

            <span className="text-sm text-slate-700">
              {card.ready
                ? `${card.title} successfully processed`
                : `Waiting for ${card.title.toLowerCase()}...`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}