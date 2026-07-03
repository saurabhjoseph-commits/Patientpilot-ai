import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import {
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function BookDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Left Side */}
          <div>

            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
              Free Strategy Session
            </span>

            <h1 className="mt-8 text-5xl font-black leading-tight text-slate-900">
              Book Your
              <span className="text-blue-600"> Free AI Demo</span>
            </h1>

            <p className="mt-8 text-xl leading-9 text-slate-600">
              Discover how PatientPilot AI can help your dental practice
              answer more calls, book more appointments, and improve
              patient experience without increasing front desk workload.
            </p>

            <div className="mt-12 space-y-6">
              <Benefit text="30-minute live demonstration" />
              <Benefit text="Personalized for your dental practice" />
              <Benefit text="Questions & answers session" />
              <Benefit text="No obligation or commitment" />
            </div>

            <div className="mt-12 rounded-3xl bg-blue-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <Calendar size={40} />
                <div>
                  <h3 className="text-2xl font-bold">
                    What You'll Learn
                  </h3>
                  <p className="text-blue-100">
                    How AI can transform your front desk.
                  </p>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                <li>• AI Receptionist</li>
                <li>• Appointment Automation</li>
                <li>• Missed Call Recovery</li>
                <li>• Patient Communication</li>
                <li>• ROI for Your Practice</li>
              </ul>
            </div>

          </div>

          {/* Right Side */}

          <div className="rounded-3xl bg-white p-10 shadow-2xl">

            <h2 className="text-3xl font-bold text-slate-900">
              Schedule Your Demo
            </h2>

            <p className="mt-3 text-slate-500">
              Fill out the form and we'll contact you shortly.
            </p>

            <div className="mt-10">
              <ContactForm />
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
              <Clock size={18} />
              Average response time: under 24 hours
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="font-semibold text-blue-600 hover:underline"
              >
                ← Back to Home
              </Link>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="text-green-600" />
      <span className="text-lg text-slate-700">{text}</span>
    </div>
  );
}