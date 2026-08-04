"use client";
export default function ClinicsError({ reset }: { reset: () => void }) {
  return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">Unable to load clinics. <button type="button" onClick={reset} className="ml-2 underline">Try again</button></div>;
}
