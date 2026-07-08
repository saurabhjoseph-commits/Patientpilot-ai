import {
  Stethoscope,
  PhoneCall,
  CalendarDays,
  Users,
} from "lucide-react";

export default function WhyDental() {
  const reasons = [
    {
      icon: Stethoscope,
      title: "Built for Dental Practices",
      description:
        "PatientPilot AI is designed specifically for dental clinics, understanding common patient questions, appointment types, and practice workflows.",
    },
    {
      icon: PhoneCall,
      title: "Never Miss Patient Calls",
      description:
        "Every unanswered call is a potential missed opportunity. Our AI helps ensure every patient receives a timely response.",
    },
    {
      icon: CalendarDays,
      title: "Simplify Scheduling",
      description:
        "From routine checkups to consultations, PatientPilot AI helps streamline appointment scheduling and reduces administrative work.",
    },
    {
      icon: Users,
      title: "Support Your Team",
      description:
        "Your front desk staff can focus on patients in the office while PatientPilot AI assists with incoming calls and common inquiries.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why Dental Practices?
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Focused on the Needs of Dental Clinics
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Instead of trying to serve every industry, we focus on dental
            practices. That allows us to build features that fit the daily
            challenges of dentists, hygienists, office managers, and front desk
            teams.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {reason.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {reason.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}