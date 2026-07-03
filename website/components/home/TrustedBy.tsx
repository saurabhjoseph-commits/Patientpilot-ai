"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  PhoneCall,
  CalendarCheck,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Reliable AI",
    description: "Built to provide consistent, professional patient interactions.",
  },
  {
    icon: Clock3,
    title: "24/7 Availability",
    description: "Never miss a patient call, even after office hours.",
  },
  {
    icon: PhoneCall,
    title: "Always Answering",
    description: "Capture more appointment opportunities with every incoming call.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Ready",
    description: "Book, reschedule, and confirm appointments automatically.",
  },
];

export default function TrustedBy() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            Why Clinics Choose PatientPilot AI
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Built to Help Dental Practices Grow
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            PatientPilot AI helps clinics respond faster, improve patient
            experience, and reduce front desk workload through intelligent
            automation.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-cyan-100 p-4">
                  <Icon className="h-7 w-7 text-cyan-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}