"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    clinicName: "",
    dentistName: "",
    email: "",
    phone: "",
    monthlyCalls: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.clinicName ||
      !formData.dentistName ||
      !formData.email ||
      !formData.phone ||
      !formData.monthlyCalls
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(true);

      setFormData({
        clinicName: "",
        dentistName: "",
        email: "",
        phone: "",
        monthlyCalls: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to book your demo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-lg">
        <h2 className="text-3xl font-bold text-green-700">
          🎉 Thank You!
        </h2>

        <p className="mt-4 text-lg text-slate-700">
          Your free strategy session has been booked successfully.
        </p>

        <p className="mt-2 text-slate-600">
          A PatientPilot AI specialist will contact you within 24 hours.
        </p>

        <button
          onClick={() => setSuccess(false)}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Book Another Demo
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-3xl font-bold text-slate-900">
        Schedule Your Free Demo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block font-medium">Full Name *</label>
          <input
            type="text"
            name="dentistName"
            value={formData.dentistName}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Dental Practice *
          </label>
          <input
            type="text"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Business Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Monthly Patient Calls *
          </label>
          <input
            type="number"
            name="monthlyCalls"
            value={formData.monthlyCalls}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Additional Information
          </label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Scheduling..." : "Schedule Free Demo"}
        </button>
      </form>
    </div>
  );
}