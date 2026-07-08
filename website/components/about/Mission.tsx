import { Target, HeartHandshake, Lightbulb } from "lucide-react";

export default function Mission() {
  const items = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "Help every dental practice answer every patient call, improve communication, and increase appointment bookings through reliable AI automation.",
    },
    {
      icon: HeartHandshake,
      title: "Patient First",
      description:
        "Every patient deserves a prompt, friendly response. We build technology that supports a better patient experience while reducing the workload on your team.",
    },
    {
      icon: Lightbulb,
      title: "Innovation with Purpose",
      description:
        "We focus on practical AI solutions that solve real business problems instead of adding unnecessary complexity.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Our Mission
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Technology That Helps Practices Grow
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            We believe AI should make dental practices more efficient without
            replacing the personal care patients expect. PatientPilot AI is
            designed to support your team, improve communication, and create
            more opportunities for growth.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}