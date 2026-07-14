"use client";

type DemoErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: DemoErrorProps) {
  console.error(error);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Demo Center Error</h1>

        <p className="mt-4">
          Something unexpected happened while loading the Demo Center.
        </p>

        <button
          onClick={() => reset()}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}