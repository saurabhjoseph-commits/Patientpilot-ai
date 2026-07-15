"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Database,
  Users,
  ShieldCheck,
  CalendarDays,
  BellRing,
} from "lucide-react";

import SectionHeader from "@/components/demo/SectionHeader";
import { useDemo } from "./DemoProvider";

function stageDescription(stage: string) {
  switch (stage) {
    case "booking":
      return "Preparing CRM updates...";
    case "crm_update":
      return "Writing patient data into the CRM...";
    case "completed":
      return "CRM successfully synchronized.";
    default:
      return "Waiting for workflow completion.";
  }
}

export default function CRMUpdatePanel() {
  const {
    scenario,
    stage,
    progress,
  } = useDemo();

  const showTimeline =
    stage === "crm_update" ||
    stage === "completed";

  const icons = [
    <Users key="users" className="h-5 w-5" />,
    <ShieldCheck key="insurance" className="h-5 w-5" />,
    <CalendarDays key="calendar" className="h-5 w-5" />,
    <BellRing key="notify" className="h-5 w-5" />,
  ];

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="CRM Automation"
        subtitle="Automatic practice management updates."
        icon={<Database className="h-6 w-6 text-blue-600" />}
      />

      <AnimatePresence mode="wait">
        {!showTimeline ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-72 items-center justify-center"
          >
            <div className="text-center">
              <Database className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Waiting for CRM Update
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Patient records will update automatically after
                appointment booking.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Status Banner */}

            <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {stageDescription(stage)}
                  </h3>

                  <p className="mt-2 text-sm text-blue-700">
                    CRM Workflow Progress
                  </p>
                </div>

                <div className="rounded-full bg-white px-4 py-2 font-semibold text-blue-700 shadow-sm">
                  {progress}%
                </div>
              </div>
            </div>

            {/* Timeline */}

            <div className="space-y-5">
              {scenario.crmEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.15,
                  }}
                  className="flex gap-4"
                >
                  {/* Timeline */}

                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                      {event.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>

                    {index <
                      scenario.crmEvents.length - 1 && (
                      <div className="mt-2 h-12 w-px bg-slate-200" />
                    )}
                  </div>

                  {/* Event */}

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm">
                          {icons[index] ?? (
                            <Database className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {event.title}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-slate-500">
                        {event.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Completion */}

            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600" />

                <div>
                  <h3 className="font-semibold text-emerald-900">
                    Workflow Complete
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    PatientPilot AI created the patient
                    record, attached insurance, scheduled
                    the appointment, and generated patient
                    notifications without staff
                    intervention.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}