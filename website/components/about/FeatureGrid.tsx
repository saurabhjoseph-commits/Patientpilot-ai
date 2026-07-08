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
      "Automatically text every missed caller and help convert them into booked appointments.",
  },
  {
    icon: CalendarDays,
    title: "24/7 Appointment Booking",
    description:
      "Patients can schedule appointments anytime without waiting for office hours.",
  },
  {
    icon: MessageSquare,
    title: "AI Text Conversations",
    description:
      "Answer FAQs, confirm appointments, and follow up with patients automatically.",
  },
  {
    icon: Bot,
    title: "Voice AI Receptionist",
    description:
      "An intelligent AI receptionist answers calls naturally and never misses a lead.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track call recovery, appointments booked, and ROI in one simple dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "HIPAA Ready",
    description:
      "Built with healthcare security practices to help protect patient communication.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Everything Your Dental Practice Needs
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            PatientPilot AI combines automation, AI communication, and appointment
            management into one powerful platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition duration-300"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
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