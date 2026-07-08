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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl ${
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
                  <span className="text-lg text-slate-500">
                    /month
                  </span>
                )}
              </div>

              <ul className="mt-10 space-y-4">

                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5 text-green-600" />

                    <span>{feature}</span>
                  </li>
                ))}

              </ul>

              <Link
                href={
                  plan.button === "Book Demo"
                    ? "/book-demo"
                    : "/contact"
                }
                className={`mt-10 block rounded-xl py-4 text-center font-semibold transition ${
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