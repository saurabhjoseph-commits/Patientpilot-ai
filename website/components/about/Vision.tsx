import {
  Globe,
  Brain,
  TrendingUp,
  Users,
} from "lucide-react";

export default function Vision() {
  const goals = [
    {
      icon: Globe,
      title: "Expand Globally",
      description:
        "Our vision is to help dental practices around the world provide exceptional patient communication through intelligent AI solutions.",
    },
    {
      icon: Brain,
      title: "Smarter AI",
      description:
        "We're continuously improving PatientPilot AI with more natural conversations, deeper insights, and better automation.",
    },
    {
      icon: TrendingUp,
      title: "Help Practices Grow",
      description:
        "We want every dental clinic to spend less time chasing missed calls and more time caring for patients and growing their business.",
    },
    {
      icon: Users,
      title: "Long-Term Partnerships",
      description:
        "Our success is measured by the success of our customers. We aim to build lasting relationships with every practice we serve.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Our Vision
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Building the Future of AI for Dental Practices
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            We believe AI should help practices become more responsive,
            more efficient, and more patient-focused. Our goal is to create
            technology that supports dental teams while improving every
            patient interaction.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          {goals.map((goal) => {
            const Icon = goal.icon;

            return (
              <div
                key={goal.title}
                className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {goal.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {goal.description}
                </p>
              </div>
            );
          })}

        </div>

        <div className="mt-20 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-center text-white">

          <h3 className="text-4xl font-bold">
            We're Just Getting Started
          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            PatientPilot AI is committed to continuously evolving alongside
            dental practices. As technology advances, we'll keep building
            smarter tools that help practices provide outstanding service and
            operate more efficiently.
          </p>

        </div>

      </div>
    </section>
  );
}