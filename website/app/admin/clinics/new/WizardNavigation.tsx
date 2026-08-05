"use client";

import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";

import type { WizardNavigationProps } from "./types";

interface Props extends WizardNavigationProps {
  isLastStep?: boolean;
}

export default function WizardNavigation({
  canGoBack,
  canGoNext,
  canSubmit,
  loading = false,
  isLastStep = false,
  onBack,
  onNext,
  onSaveDraft,
  onSubmit,
}: Props) {
  return (
    <div className="mt-8 rounded-xl border bg-background p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {onSaveDraft && (
            <button
              type="button"
              disabled={loading}
              onClick={onSaveDraft}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              Save Draft
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={!canGoBack || loading}
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {!isLastStep ? (
            <button
              type="button"
              disabled={!canGoNext || loading}
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!canSubmit || loading}
              onClick={onSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}

              Create Clinic
            </button>
          )}
        </div>
      </div>
    </div>
  );
}