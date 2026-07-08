import Hero from "@/components/home/Hero";
import DemoSection from "@/components/demo/DemoSection";
import TrustedBy from "@/components/home/TrustedBy";
import Features from "@/components/home/Features";
import ServicesPreview from "@/components/home/ServicesPreview";
import Benefits from "@/components/home/Benefits";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Comparison from "@/components/home/Comparison";
import HowItWorks from "@/components/home/HowItWorks";
import AIDemo from "@/components/home/AIDemo";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import PricingPreview from "@/components/home/PricingPreview";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />

      {/* Sprint 1 - Interactive AI Demo */}
      <DemoSection />

      <TrustedBy />

      <Features />

      <ServicesPreview />

      <Benefits />

      <WhyChooseUs />

      <Comparison />

      <HowItWorks />

      <AIDemo />

      <Stats />

      <Testimonials />

      <PricingPreview />

      <FAQ />

      <CTA />
    </main>
  );
}