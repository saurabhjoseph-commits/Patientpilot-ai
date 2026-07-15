"use client";

import { motion } from "framer-motion";
import { Check, PlayCircle } from "lucide-react";

import { scenarios } from "./data";
import { useDemo } from "./DemoProvider";

export default function ScenarioSelector() {
  const {
    scenario,
    setScenario,
    isPlaying,
    restartDemo,
  } = useDemo();

  function handleSelect(id: string) {
    if (isPlaying) return;

    const selected = scenarios.find(
      (item) => item.id === id
    );

    if (!selected) return;

    restartDemo();
    setScenario(selected);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Demo Scenario
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Choose a Live Demonstration
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Select a patient scenario before starting the
          live demo.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {scenarios.map((item) => {
          const active =
            item.id === scenario.id;

          return (
            <motion.button
              key={item.id}
              whileHover={
                !isPlaying
                  ? { y: -3 }
                  : undefined
              }
              whileTap={
                !isPlaying
                  ? { scale: 0.98 }
                  : undefined
              }
              disabled={isPlaying}
              onClick={() =>
                handleSelect(item.id)
              }
              className={[
                "rounded-2xl border p-5 text-left transition-all",
                active
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50",
                isPlaying
                  ? "cursor-not-allowed opacity-60"
                  : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>

                {active ? (
                  <Check className="h-5 w-5 text-blue-600" />
                ) : (
                  <PlayCircle className="h-5 w-5 text-slate-300" />
                )}
              </div>

              {active && (
                <div className="mt-4 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Active Scenario
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {isPlaying && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Finish or restart the current demo before
            switching scenarios.
          </p>
        </div>
      )}
    </section>
  );
}