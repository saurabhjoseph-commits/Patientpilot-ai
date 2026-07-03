"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How does PatientPilot AI answer calls?",
    answer:
      "PatientPilot AI answers incoming calls 24/7 using conversational AI. It can greet patients, answer common questions, schedule appointments, and transfer urgent calls when needed.",
  },
  {
    question: "Can it book appointments automatically?",
    answer:
      "Yes. PatientPilot AI can schedule, reschedule, and cancel appointments while following your clinic's scheduling rules.",
  },
  {
    question: "Does it work after office hours?",
    answer:
      "Absolutely. Your AI receptionist is available 24 hours a day, 7 days a week, ensuring you never miss a potential patient.",
  },
  {
    question: "Can it answer common dental questions?",
    answer:
      "Yes. It can respond to FAQs about office hours, insurance, treatments, directions, payment options, and more.",
  },
  {
    question: "Is patient information secure?",
    answer:
      "Security is a top priority. Patient information is handled using modern security practices and can be configured to align with your clinic's compliance requirements.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most clinics can be onboarded within a few days depending on integrations and custom workflows.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">

        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold uppercase tracking-wide">
            Frequently Asked Questions
          </span>

          <h2 className="text-4xl font-bold mt-4 text-slate-900">
            Everything You Need to Know
          </h2>

          <p className="mt-5 text-slate-600 text-lg">
            Answers to the most common questions dental practices ask before
            getting started with PatientPilot AI.
          </p>
        </div>

        <div className="space-y-5">

          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition"
                >
                  <h3 className="font-semibold text-lg text-slate-900">
                    {faq.question}
                  </h3>

                  <ChevronDown
                    className={`transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-7">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}