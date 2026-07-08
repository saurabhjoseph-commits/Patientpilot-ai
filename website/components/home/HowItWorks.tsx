import { PhoneCall, Bot, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    step: "Step 1",
    title: "Patient Calls or Messages",
    description:
      "Patients contact your practice by phone or text anytime, even after business hours.",
  },
  {
    icon: Bot,
    step: "Step 2",
    title: "PatientPilot AI Responds",
    description:
      "Our AI answers questions, qualifies leads, and helps schedule appointments instantly.",
  },
  {
    icon: CalendarCheck,
    step: "Step 3",
    title: "Appointments Get Booked",
    description:
      "Your calendar stays full while your staff spends less time answering repetitive calls.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            How It Works
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Three Simple Steps to Grow Your Practice
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            PatientPilot AI works around the clock so you never miss another
            patient opportunity.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl bg-white border border-gray-200 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600">
                  {step.step}
                </p>

                <h3 className="mt-3 text-2xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}