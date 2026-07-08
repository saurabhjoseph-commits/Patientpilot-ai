const faqs = [
  {
    question: "Is there a setup fee?",
    answer:
      "No. There are no setup fees. We help you get PatientPilot AI configured as part of your onboarding.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can upgrade your plan as your practice grows or your requirements change.",
  },
  {
    question: "Does PatientPilot AI work after office hours?",
    answer:
      "Yes. Your AI receptionist answers calls 24/7, including evenings, weekends, and holidays.",
  },
  {
    question: "Can it integrate with my practice software?",
    answer:
      "Enterprise plans support custom integrations. We'll work with you to evaluate compatibility with your existing systems.",
  },
  {
    question: "Do you offer a live demo?",
    answer:
      "Absolutely. Book a free demo and we'll walk you through how PatientPilot AI works for dental practices.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Pricing Questions
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="mt-16 space-y-6">

          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl bg-white p-8 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900">
                {faq.question}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {faq.answer}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}