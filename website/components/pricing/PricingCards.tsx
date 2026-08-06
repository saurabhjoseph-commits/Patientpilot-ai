import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$299",
    description: "Perfect for single-location dental practices.",
    features: [
      "24/7 AI Receptionist",
      "Appointment Booking",
      "Missed Call Notifications",
      "SMS Confirmations",
      "Email Support",
    ],
    button: "Book Demo",
    popular: false,
  },
  {
    name: "Growth",
    price: "$499",
    description: "Our most popular plan for growing practices.",
    features: [
      "Everything in Starter",
      "Missed Call Recovery",
      "Google Review Automation",
      "Analytics Dashboard",
      "Priority Support",
      "CRM Integration",
    ],
    button: "Book Demo",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Designed for multi-location dental organizations.",
    features: [
      "Everything in Growth",
      "Unlimited Locations",
      "Dedicated AI Assistant",
      "API Access",
      "Custom Integrations",
      "Dedicated Success Manager",
    ],
    button: "Contact Sales",
    popular: false,
  },
];

export default function PricingCards() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative w-full rounded-3xl border bg-white p-6 text-slate-900 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl sm:p-8 ${
                plan.popular
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="mb-6 inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  ⭐ Most Popular
                </div>
              )}

              <h2 className="text-3xl font-bold text-slate-900">
                {plan.name}
              </h2>

              <p className="mt-3 text-slate-600">
                {plan.description}
              </p>

              <div className="mt-8">
                <span className="text-5xl font-extrabold text-slate-900">
                  {plan.price}
                </span>

                {plan.price !== "Custom" && (
                  <span className="ml-1 text-lg text-slate-500">
                    /month
                  </span>
                )}
              </div>

              <ul className="mt-8 space-y-4 sm:mt-10">

                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />

                    <span className="leading-6">{feature}</span>
                  </li>
                ))}

              </ul>

              <Link
                href={
                  plan.button === "Book Demo"
                    ? "/book-demo"
                    : "/contact"
                }
                className={`mt-8 block min-h-12 rounded-xl py-3.5 text-center font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:mt-10 ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {plan.button}
              </Link>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
