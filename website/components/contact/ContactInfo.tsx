import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default function ContactInfo() {
  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@patientpilotai.com",
      description: "We'll respond within one business day.",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Monday – Friday, 9:00 AM – 6:00 PM",
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon – Fri",
      description: "9:00 AM – 6:00 PM",
    },
    {
      icon: MapPin,
      title: "Serving",
      value: "Dental Practices",
      description: "Across the United States",
    },
    {
      icon: Calendar,
      title: "Book a Demo",
      value: "Free 30-Minute Session",
      description: "Personalized strategy consultation.",
    },
    {
      icon: MessageSquare,
      title: "Support",
      value: "Fast Response",
      description: "Questions, onboarding, and technical assistance.",
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Contact Information
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Get in Touch
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Whether you're interested in PatientPilot AI, have questions
            about pricing, or want to schedule a demo, we'd love to hear
            from you.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-lg font-semibold text-blue-600">
                  {item.value}
                </p>

                <p className="mt-3 text-slate-600 leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}