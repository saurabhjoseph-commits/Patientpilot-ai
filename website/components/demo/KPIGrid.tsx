"use client";

import { motion } from "framer-motion";

import MetricCard from "./MetricCard";
import SectionHeader from "./SectionHeader";
import { executiveMetrics } from "./data";

export default function KPIGrid() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Executive Dashboard"
        subtitle="Today's AI Receptionist performance across your dental practice."
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >
        {executiveMetrics.map((metric) => (
          <motion.div
            key={metric.id}
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
              change={metric.change}
              prefix={metric.prefix}
              suffix={metric.suffix}
              decimals={metric.decimals}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}