import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Michael Johnson",
    clinic: "Bright Smile Dental",
    review:
      "PatientPilot AI has transformed how we manage patient calls. Our front desk is less overwhelmed, and appointment bookings have increased.",
  },
  {
    name: "Dr. Sarah Williams",
    clinic: "Elite Family Dentistry",
    review:
      "The AI receptionist answers patient questions instantly. It's like having an extra team member working 24/7.",
  },
  {
    name: "Dr. David Chen",
    clinic: "Modern Dental Care",
    review:
      "We no longer lose patients because of missed calls. The automation has saved us hours every week.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-blue-600 font-semibold uppercase tracking-wide">
            Testimonials
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            What Dental Professionals Say
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Hear how AI-powered communication can improve patient experience and
            help dental teams work more efficiently.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-600 leading-7">
                "{testimonial.review}"
              </p>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {testimonial.clinic}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}