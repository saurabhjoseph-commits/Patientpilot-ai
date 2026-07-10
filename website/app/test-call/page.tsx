"use client";

export default function TestCallPage() {
  const createCall = async () => {
    try {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          call_sid: `CA${Date.now()}`,
          patient_name: "Sarah Johnson",
          phone: "+14155552184",
        }),
      });

      const data = await response.json();

      console.log(data);

      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      alert("Request failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <button
        onClick={createCall}
        className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
      >
        Test Create Call
      </button>
    </main>
  );
}