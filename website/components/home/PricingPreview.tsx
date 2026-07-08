export default function PricingPreview() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Pricing
          </span>

          <h2 className="mt-6 text-4xl font-bold">
            Simple Pricing for Every Practice
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Choose the perfect AI receptionist for your clinic.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {/* Starter */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold">Starter</h3>

            <p className="mt-2 text-4xl font-bold">
              $299
              <span className="text-lg text-slate-500">/month</span>
            </p>

            <ul className="mt-8 space-y-4">
              <li>✅ AI Receptionist</li>
              <li>✅ Appointment Booking</li>
              <li>✅ SMS Follow-up</li>
            </ul>

            <button className="mt-10 w-full rounded-lg bg-blue-600 py-3 text-white">
              Get Started
            </button>
          </div>

          {/* Growth */}
          <div className="rounded-2xl border-4 border-blue-600 bg-white p-8 shadow-2xl">
            <div className="mb-4 inline-block rounded-full bg-blue-600 px-4 py-1 text-sm text-white">
              Most Popular
            </div>

            <h3 className="text-2xl font-bold">Growth</h3>

            <p className="mt-2 text-4xl font-bold">
              $499
              <span className="text-lg text-slate-500">/month</span>
            </p>

            <ul className="mt-8 space-y-4">
              <li>✅ Everything in Starter</li>
              <li>✅ Missed Call Recovery</li>
              <li>✅ CRM Integration</li>
              <li>✅ Analytics Dashboard</li>
            </ul>

            <button className="mt-10 w-full rounded-lg bg-blue-600 py-3 text-white">
              Book Demo
            </button>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold">Enterprise</h3>

            <p className="mt-2 text-4xl font-bold">
              Custom
            </p>

            <ul className="mt-8 space-y-4">
              <li>✅ Multi-location Support</li>
              <li>✅ Dedicated AI Assistant</li>
              <li>✅ API Access</li>
              <li>✅ Premium Support</li>
            </ul>

            <button className="mt-10 w-full rounded-lg bg-slate-900 py-3 text-white">
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}