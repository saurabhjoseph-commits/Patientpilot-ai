"use client";

interface DemoErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function DemoError({
  error,
  reset,
}: DemoErrorProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">⚠️</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Demo Center Error
        </h1>

        <p className="mt-4 text-slate-600">
          Something unexpected happened while loading the Demo Center.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 rounded-xl bg-slate-100 p-4 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Error Details
            </p>

            <code className="break-words text-sm text-red-600">
              {error.message}
            </code>

            {error.digest && (
              <p className="mt-2 text-xs text-slate-500">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <button
          onClick={reset}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}