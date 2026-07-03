import {
  PhoneCall,
  CalendarDays,
  MessageSquare,
  Bot,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: PhoneCall,
    title: "Missed Call Recovery",
    description:
      "Automatically follow up with every missed caller and convert more inquiries into booked appointments.",
  },
  {
    icon: CalendarDays,
    title: "24/7 Online Booking",
    description:
      "Allow patients to schedule appointments anytime without waiting for office hours.",
  },
  {
    icon: MessageSquare,
    title: "AI Text Assistant",
    description:
      "Instantly answer common questions and send reminders through intelligent conversations.",
  },
  {
    icon: Bot,
    title: "AI Voice Receptionist",
    description:
      "Never miss another patient call with a natural AI receptionist available 24/7.",
  },
  {
    icon: BarChart3,
    title: "Practice Analytics",
    description:
      "Track appointments, recovered leads, and business growth from one dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Designed with healthcare-grade security practices to protect patient communication.",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center max-w-3xl mx-auto">
          <span className="text-blue-600 font-semibold uppercase tracking-wide">
            Powerful Features
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Everything Your Practice Needs
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            PatientPilot AI automates patient communication,
            appointment scheduling, and lead management so your team can
            focus on delivering exceptional care.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-gray-600 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}