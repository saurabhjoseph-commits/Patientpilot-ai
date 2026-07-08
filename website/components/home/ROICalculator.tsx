export default function ROICalculator() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            ROI Calculator
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            See How Much Revenue You're Missing
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Even a few missed calls can cost thousands every month.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold">
              Example Practice
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between border-b pb-3">
                <span>Missed Calls / Month</span>
                <strong>25</strong>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Average Treatment Value</span>
                <strong>$450</strong>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>Potential Revenue Lost</span>
                <strong className="text-red-600">$11,250</strong>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Recovered with PatientPilot AI</span>
                <span className="text-green-600">$9,000+</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-600 p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold">
              Why It Matters
            </h3>

            <p className="mt-6 text-lg leading-8">
              Every missed patient call is a missed opportunity.
              PatientPilot AI answers every call 24/7,
              books appointments automatically,
              and follows up with potential patients instantly.
            </p>

            <div className="mt-8 rounded-xl bg-white/10 p-6">
              <h4 className="font-semibold">
                Average Clinics Recover
              </h4>

              <p className="mt-2 text-4xl font-bold">
                $5,000–$15,000/month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}