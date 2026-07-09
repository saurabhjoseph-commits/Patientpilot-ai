"use client";

import CountUp from "react-countup";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, PhoneMissed, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ROICalculator() {
  const [missedCalls, setMissedCalls] = useState(30);
  const [patientValue, setPatientValue] = useState(500);
  const [recoveryRate, setRecoveryRate] = useState(80);

  const results = useMemo(() => {
    const recoveredPatients = Math.round(
      missedCalls * (recoveryRate / 100)
    );

    const monthlyRevenue = recoveredPatients * patientValue;

    const yearlyRevenue = monthlyRevenue * 12;

    return {
      recoveredPatients,
      monthlyRevenue,
      yearlyRevenue,
    };
  }, [missedCalls, patientValue, recoveryRate]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-2 font-medium mb-6">
            <Calculator className="w-5 h-5" />
            Revenue Calculator
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
            How Much Revenue Are You Losing?
          </h2>

          <p className="text-xl text-slate-600 mt-6 max-w-3xl mx-auto">
            Estimate how much revenue your dental practice could recover by
            answering every patient call with PatientPilot AI.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT */}

          <motion.div
            initial={{ opacity:0,x:-40 }}
            whileInView={{ opacity:1,x:0 }}
            viewport={{ once:true }}
            transition={{ duration:.5 }}
            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xl"
          >

            {/* Missed Calls */}

            <div className="mb-10">
              <div className="flex justify-between mb-3">
                <span className="font-semibold">
                  Monthly Missed Calls
                </span>

                <span className="text-blue-600 font-bold">
                  {missedCalls}
                </span>
              </div>

              <input
                type="range"
                min={5}
                max={100}
                value={missedCalls}
                onChange={(e)=>setMissedCalls(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Patient Value */}

            <div className="mb-10">
              <div className="flex justify-between mb-3">
                <span className="font-semibold">
                  Average New Patient Value
                </span>

                <span className="text-blue-600 font-bold">
                  ${patientValue}
                </span>
              </div>

              <input
                type="range"
                min={100}
                max={2000}
                step={50}
                value={patientValue}
                onChange={(e)=>setPatientValue(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Recovery */}

            <div>

              <div className="flex justify-between mb-3">
                <span className="font-semibold">
                  AI Recovery Rate
                </span>

                <span className="text-blue-600 font-bold">
                  {recoveryRate}%
                </span>
              </div>

              <input
                type="range"
                min={40}
                max={100}
                value={recoveryRate}
                onChange={(e)=>setRecoveryRate(Number(e.target.value))}
                className="w-full"
              />
            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity:0,x:40 }}
            whileInView={{ opacity:1,x:0 }}
            viewport={{ once:true }}
            transition={{ duration:.5 }}
            className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 shadow-2xl"
          >

            <div className="space-y-8">

              <div className="flex items-center gap-4">

                <div className="bg-white/20 rounded-xl p-3">
                  <PhoneMissed className="w-7 h-7"/>
                </div>

                <div>
                  <p className="text-blue-100">
                    Recovered Patients
                  </p>

                  <h3 className="text-4xl font-bold">
                    {results.recoveredPatients}
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="bg-white/20 rounded-xl p-3">
                  <DollarSign className="w-7 h-7"/>
                </div>

                <div>

                  <p className="text-blue-100">
                    Monthly Revenue
                  </p>

                  <h3 className="text-4xl font-bold">
                    {formatCurrency(results.monthlyRevenue)}
                  </h3>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="bg-white/20 rounded-xl p-3">
                  <TrendingUp className="w-7 h-7"/>
                </div>

                <div>

                  <p className="text-blue-100">
                    Annual Revenue
                  </p>

                  <h3 className="text-5xl font-extrabold">
                    {formatCurrency(results.yearlyRevenue)}
                  </h3>

                </div>

              </div>

              <div className="pt-6">

                <Link
                  href="/book-demo"
                  className="block text-center rounded-xl bg-white text-blue-700 hover:bg-blue-50 transition py-4 font-bold text-lg"
                >
                  Book Your Free Demo →
                </Link>

              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}