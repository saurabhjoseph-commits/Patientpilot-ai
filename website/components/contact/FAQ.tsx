const faqs = [
  {
    question: "How quickly will someone contact me?",
    answer:
      "We aim to respond to all inquiries within one business day. Demo requests are typically confirmed much sooner.",
  },
  {
    question: "Is the demo really free?",
    answer:
      "Yes. Your strategy session is completely free with no obligation to purchase.",
  },
  {
    question: "Can PatientPilot AI work with my existing workflow?",
    answer:
      "We'll discuss your current process during the demo and explain how PatientPilot AI can fit into your practice.",
  },
  {
    question: "Who is PatientPilot AI designed for?",
    answer:
      "PatientPilot AI is designed specifically for dental practices looking to improve patient communication and appointment management.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Have Questions?
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Here are answers to some of the most common questions we receive.
          </p>

        </div>

        <div className="mt-16 space-y-6">

          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl bg-slate-50 p-8 shadow-lg"
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