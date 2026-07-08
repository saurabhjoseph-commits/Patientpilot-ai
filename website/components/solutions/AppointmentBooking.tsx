import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

export default function AppointmentBooking() {
  const features = [
    {
      icon: CalendarDays,
      title: "Automatic Scheduling",
      description:
        "PatientPilot AI books appointments directly into your practice schedule without manual work.",
    },
    {
      icon: Clock3,
      title: "24/7 Booking",
      description:
        "Patients can schedule appointments any time of day—even after your office closes.",
    },
    {
      icon: Smartphone,
      title: "Instant Confirmations",
      description:
        "Patients receive immediate confirmation and appointment reminders via SMS or email.",
    },
    {
      icon: CheckCircle2,
      title: "Reduce No-Shows",
      description:
        "Automated reminders help patients remember appointments and reduce missed visits.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left Side */}
          <div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Smart Appointment Booking
            </span>

            <h2 className="mt-6 text-4xl font-bold text-slate-900">
              Let AI Fill Your Calendar
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Instead of asking patients to call back later,
              PatientPilot AI checks availability,
              books appointments instantly,
              and keeps everyone informed automatically.
            </p>

            <div className="mt-8 space-y-4">
              <div>✅ Real-time appointment booking</div>
              <div>✅ Calendar synchronization</div>
              <div>✅ SMS & Email confirmations</div>
              <div>✅ Automated reminders</div>
            </div>

          </div>

          {/* Right Side */}
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

                  <p className="mt-3 leading-7 text-slate-600">
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