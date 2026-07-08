import { Bot, Clock, MessageSquare, Languages } from "lucide-react";

export default function AIReceptionist() {
  const features = [
    {
      icon: Bot,
      title: "Natural AI Conversations",
      description:
        "PatientPilot AI speaks naturally with patients, answers common questions, and provides a professional first impression.",
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description:
        "Your AI receptionist never takes a break. It answers calls after hours, on weekends, and during holidays.",
    },
    {
      icon: MessageSquare,
      title: "Answers Common Questions",
      description:
        "Patients can ask about office hours, services, insurance, directions, and more without waiting for staff.",
    },
    {
      icon: Languages,
      title: "Supports Multiple Languages",
      description:
        "Serve more patients with multilingual conversations and improve accessibility for your community.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Left */}
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              AI Receptionist
            </span>

            <h2 className="mt-6 text-4xl font-bold text-slate-900">
              Your Front Desk, Powered by AI
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Every incoming call is answered instantly with a friendly,
              professional voice. PatientPilot AI handles routine questions,
              captures new patient information, and ensures every caller has
              a great experience.
            </p>

            <div className="mt-8 space-y-4">
              <div>✅ Never miss another patient call</div>
              <div>✅ Consistent patient experience</div>
              <div>✅ Reduces workload for your team</div>
              <div>✅ Works alongside your existing staff</div>
            </div>
          </div>

          {/* Right */}
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-slate-600 leading-7">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}