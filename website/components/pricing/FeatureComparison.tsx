import { Check, Minus } from "lucide-react";

const features = [
  {
    feature: "24/7 AI Receptionist",
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Appointment Booking",
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    feature: "SMS & Email Confirmations",
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Missed Call Recovery",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Google Review Automation",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Analytics Dashboard",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: "CRM Integration",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: "Multi-location Support",
    starter: false,
    growth: false,
    enterprise: true,
  },
  {
    feature: "API Access",
    starter: false,
    growth: false,
    enterprise: true,
  },
  {
    feature: "Dedicated Success Manager",
    starter: false,
    growth: false,
    enterprise: true,
  },
];

export default function FeatureComparison() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Compare Plans
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Compare Every Feature
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Choose the plan that best fits your dental practice today,
            with the flexibility to upgrade as you grow.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl bg-white shadow-xl">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-5 text-left">Feature</th>
                <th className="p-5 text-center">Starter</th>
                <th className="p-5 text-center">Growth</th>
                <th className="p-5 text-center">Enterprise</th>
              </tr>
            </thead>

            <tbody>

              {features.map((item) => (
                <tr
                  key={item.feature}
                  className="border-b last:border-none"
                >
                  <td className="p-5 font-medium">
                    {item.feature}
                  </td>

                  <td className="text-center">
                    {item.starter ? (
                      <Check className="mx-auto text-green-600" />
                    ) : (
                      <Minus className="mx-auto text-slate-400" />
                    )}
                  </td>

                  <td className="text-center">
                    {item.growth ? (
                      <Check className="mx-auto text-green-600" />
                    ) : (
                      <Minus className="mx-auto text-slate-400" />
                    )}
                  </td>

                  <td className="text-center">
                    {item.enterprise ? (
                      <Check className="mx-auto text-green-600" />
                    ) : (
                      <Minus className="mx-auto text-slate-400" />
                    )}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </section>
  );
}