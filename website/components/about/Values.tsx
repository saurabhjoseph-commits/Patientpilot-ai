import {
  ShieldCheck,
  Heart,
  Lightbulb,
  Rocket,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Reliability",
    description:
      "Dental practices rely on us to answer every patient call consistently, securely, and professionally.",
  },
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description:
      "Technology should improve the patient experience by making communication faster, friendlier, and more accessible.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description:
      "We continuously improve PatientPilot AI with new features that help dental practices operate more efficiently.",
  },
  {
    icon: Rocket,
    title: "Growth Partnership",
    description:
      "Our goal is to become a long-term partner that helps practices grow by capturing more patient opportunities.",
  },
];

export default function Values() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Our Values
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Principles That Guide Everything We Build
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Every feature we create is guided by our commitment to helping
            dental practices provide outstanding patient experiences while
            making day-to-day operations simpler and more efficient.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {value.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {value.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}