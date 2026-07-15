"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  User,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MessageSquare,
} from "lucide-react";

import SectionHeader from "@/components/demo/SectionHeader";
import { useDemo } from "./DemoProvider";

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
    >
      <div className="rounded-lg bg-white p-2 shadow-sm">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function stageMessage(stage: string) {
  switch (stage) {
    case "booking":
      return "Creating appointment...";

    case "crm_update":
      return "Appointment confirmed.";

    case "completed":
      return "Appointment successfully booked.";

    default:
      return "Waiting for booking.";
  }
}

export default function AppointmentSummary() {
  const {
    scenario,
    stage,
    progress,
  } = useDemo();

  const appointment =
    scenario.appointment;

  const showAppointment =
    stage === "booking" ||
    stage === "crm_update" ||
    stage === "completed";

  return (
    <motion.section
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="Appointment Summary"
        subtitle="Generated automatically by PatientPilot AI."
        icon={
          <CalendarDays className="h-6 w-6 text-blue-600" />
        }
      />

      <AnimatePresence mode="wait">
        {!showAppointment ? (
          <motion.div
            key="waiting"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="flex h-72 items-center justify-center"
          >
            <div className="text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Waiting for Appointment
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                The appointment card will appear automatically once
                the AI reaches the booking stage.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="appointment"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            {/* Success Banner */}

            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />

                <div>
                  <h3 className="font-bold text-emerald-900">
                    {stageMessage(stage)}
                  </h3>

                  <p className="mt-1 text-sm text-emerald-700">
                    Progress: {progress}% complete
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment */}

            <div className="grid gap-4">

              <DetailRow
                icon={<User className="h-5 w-5 text-blue-600" />}
                label="Patient"
                value={appointment.patientName}
              />

              <DetailRow
                icon={
                  <Stethoscope className="h-5 w-5 text-violet-600" />
                }
                label="Dentist"
                value={appointment.dentist}
              />

              <DetailRow
                icon={
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                }
                label="Procedure"
                value={appointment.procedure}
              />

              <DetailRow
                icon={
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                }
                label="Date"
                value={appointment.date}
              />

              <DetailRow
                icon={
                  <Clock3 className="h-5 w-5 text-sky-600" />
                }
                label="Time"
                value={appointment.time}
              />

              <DetailRow
                icon={
                  <ShieldCheck className="h-5 w-5 text-cyan-600" />
                }
                label="Insurance"
                value={
                  scenario.analysis.insurance ??
                  "Pending"
                }
              />

            </div>

            {/* Notifications */}

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">

              <h3 className="font-semibold text-slate-900">
                Confirmation Status
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="flex items-center gap-3 rounded-xl bg-white p-4">
                  <MessageSquare className="h-6 w-6 text-emerald-600" />

                  <div>
                    <p className="font-medium text-slate-900">
                      SMS
                    </p>

                    <p className="text-sm text-emerald-600">
                      Scheduled
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white p-4">
                  <Mail className="h-6 w-6 text-blue-600" />

                  <div>
                    <p className="font-medium text-slate-900">
                      Email
                    </p>

                    <p className="text-sm text-blue-600">
                      Scheduled
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}