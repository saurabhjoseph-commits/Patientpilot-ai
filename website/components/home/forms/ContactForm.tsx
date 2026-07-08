"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    clinic: "",
    email: "",
    phone: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    alert("Demo submitted successfully!");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border bg-white p-8 shadow-lg"
    >
      <input
        name="name"
        placeholder="Full Name"
        className="w-full rounded-lg border p-3"
        onChange={handleChange}
      />

      <input
        name="clinic"
        placeholder="Dental Clinic"
        className="w-full rounded-lg border p-3"
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email Address"
        className="w-full rounded-lg border p-3"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone Number"
        className="w-full rounded-lg border p-3"
        onChange={handleChange}
      />

      <textarea
        name="message"
        rows={5}
        placeholder="Tell us about your clinic..."
        className="w-full rounded-lg border p-3"
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white"
      >
        Book Free Demo
      </button>
    </form>
  );
}