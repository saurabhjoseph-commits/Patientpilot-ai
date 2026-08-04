"use client";

import { Check } from "lucide-react";

import {
  CLINIC_WIZARD_STEP_DEFINITIONS,
  type WizardStepperProps,
} from "./types";

export default function WizardStepper({
  currentStep,
  completedSteps,
}: WizardStepperProps) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {CLINIC_WIZARD_STEP_DEFINITIONS.map((step, index) => {
          const completed = completedSteps.includes(index);
          const active = index === currentStep;
          const last =
            index ===
            CLINIC_WIZARD_STEP_DEFINITIONS.length - 1;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-start"
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    completed
                      ? "border-green-600 bg-green-600 text-white"
                      : active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-muted-foreground/30 bg-background text-muted-foreground",
                  ].join(" ")}
                >
                  {completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>

                {!last && (
                  <div
                    className={[
                      "mt-2 hidden h-1 w-20 rounded lg:block",
                      completed
                        ? "bg-green-600"
                        : "bg-muted",
                    ].join(" ")}
                  />
                )}
              </div>

              <div className="ml-4 flex-1">
                <h3
                  className={[
                    "font-semibold",
                    active
                      ? "text-blue-600"
                      : completed
                        ? "text-green-600"
                        : "",
                  ].join(" ")}
                >
                  {step.title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            Progress
          </span>

          <span>
            {currentStep + 1} /{" "}
            {CLINIC_WIZARD_STEP_DEFINITIONS.length}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${
                ((currentStep + 1) /
                  CLINIC_WIZARD_STEP_DEFINITIONS.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}