import Hero from "@/components/solutions/Hero";
import AIReceptionist from "@/components/solutions/AIReceptionist";
import MissedCalls from "@/components/solutions/MissedCalls";
import AppointmentBooking from "@/components/solutions/AppointmentBooking";
import Reviews from "@/components/solutions/Reviews";
import Dashboard from "@/components/solutions/Dashboard";
import CTA from "@/components/solutions/CTA";

export default function SolutionsPage() {
  return (
    <main>
      <Hero />
      <AIReceptionist />
      <MissedCalls />
      <AppointmentBooking />
      <Reviews />
      <Dashboard />
      <CTA />
    </main>
  );
}