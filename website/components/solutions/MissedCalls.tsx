import {
  PhoneMissed,
  PhoneCall,
  TrendingUp,
  Bell,
} from "lucide-react";

export default function MissedCalls() {
  const features = [
    {
      icon: PhoneMissed,
      title: "Detects Every Missed Call",
      description:
        "PatientPilot AI instantly detects unanswered calls so no opportunity is forgotten.",
    },
    {
      icon: PhoneCall,
      title: "Instant AI Follow-up",
      description:
        "Within seconds, AI contacts the patient, answers questions, and helps schedule an appointment.",
    },
    {
      icon: Bell,
      title: "Staff Notifications",
      description:
        "Your team receives instant notifications whenever AI recovers a missed patient call.",
    },
    {
      icon: TrendingUp,
      title: "Recover Lost Revenue",
      description:
        "Turn missed calls into booked appointments and increase monthly revenue without hiring more staff.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Missed Call Recovery
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Every Missed Call Is a Missed Opportunity
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Dental practices lose thousands of dollars every month because
            potential patients can't reach someone when they call.
            PatientPilot AI automatically follows up, answers questions,
            and helps convert those missed calls into booked appointments.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl"
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

        <div className="mt-20 rounded-3xl bg-blue-600 p-10 text-center text-white shadow-xl">
          <h3 className="text-3xl font-bold">
            Recover More Patients. Increase Revenue.
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-blue-100">
            Even recovering just a few missed patient calls every week can
            generate thousands of dollars in additional treatment revenue
            over the course of a year.
          </p>
        </div>

      </div>
    </section>
  );
}