import {
  Star,
  MessageCircle,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

export default function Reviews() {
  const features = [
    {
      icon: Star,
      title: "Ask Happy Patients",
      description:
        "PatientPilot AI automatically invites satisfied patients to leave a Google review after their visit.",
    },
    {
      icon: MessageCircle,
      title: "Automatic SMS & Email",
      description:
        "Review requests are sent automatically through SMS or email, saving your staff valuable time.",
    },
    {
      icon: ThumbsUp,
      title: "Build Trust",
      description:
        "A steady flow of positive reviews helps attract new patients and strengthens your online reputation.",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Practice",
      description:
        "More positive reviews improve local search visibility and help convert more website visitors into patients.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Google Review Automation
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Turn Great Patient Experiences into 5-Star Reviews
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Your happiest patients are often willing to leave a review—they just
            need a reminder. PatientPilot AI automates the process, helping your
            practice build a stronger online reputation.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 rounded-3xl bg-white p-10 shadow-xl">
          <div className="grid gap-10 md:grid-cols-3 text-center">

            <div>
              <h3 className="text-5xl font-bold text-blue-600">4.9★</h3>
              <p className="mt-3 text-slate-600">
                Average Rating Goal
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-blue-600">+65%</h3>
              <p className="mt-3 text-slate-600">
                More Reviews
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-blue-600">24/7</h3>
              <p className="mt-3 text-slate-600">
                Automatic Requests
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}