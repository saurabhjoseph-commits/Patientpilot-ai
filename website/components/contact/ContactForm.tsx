import ContactForm from "@/components/forms/ContactForm";

export default function ContactSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-6">

        <div className="mb-12 text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Contact Us
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Tell Us About Your Practice
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Complete the form below and our team will get in touch with you.
          </p>

        </div>

        <ContactForm />

      </div>
    </section>
  );
}