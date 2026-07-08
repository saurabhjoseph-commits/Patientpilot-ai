import {
  BarChart3,
  Phone,
  CalendarCheck,
  DollarSign,
} from "lucide-react";

export default function Dashboard() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Analytics Dashboard
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Know Exactly How Your Practice Is Growing
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            PatientPilot AI gives you real-time insights into every patient
            interaction, helping you measure performance and identify growth
            opportunities.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">

          {/* Dashboard Preview */}
          <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">

            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                PatientPilot Dashboard
              </h3>

              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>

            <div className="mt-10 space-y-6">

              <div className="flex items-center justify-between rounded-xl bg-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <Phone className="text-blue-400" />
                  <span>Calls Answered</span>
                </div>

                <span className="text-2xl font-bold">248</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <CalendarCheck className="text-green-400" />
                  <span>Appointments Booked</span>
                </div>

                <span className="text-2xl font-bold">91</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-800 p-5">
                <div className="flex items-center gap-4">
                  <DollarSign className="text-yellow-400" />
                  <span>Estimated Revenue</span>
                </div>

                <span className="text-2xl font-bold">$18,500</span>
              </div>

            </div>

          </div>

          {/* Benefits */}
          <div className="space-y-6">

            <div className="rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                Track Every Call
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                See how many calls were answered by AI,
                how many appointments were booked,
                and how much revenue was recovered.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                Measure Team Performance
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Understand patient demand,
                monitor appointment trends,
                and identify opportunities to improve your practice.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                Make Smarter Business Decisions
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Use detailed analytics to optimize staffing,
                marketing campaigns,
                and patient communication.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}