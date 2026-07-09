import Hero from "@/components/home/hero/Hero";
import DemoSection from "@/components/demo/DemoSection";
import TrustedBy from "@/components/home/TrustedBy";
import Features from "@/components/home/Features";
import Benefits from "@/components/home/Benefits";
import ROICalculator from "@/components/roi/ROICalculator";
import TrustSection from "@/components/trust/TrustSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import PricingPreview from "@/components/home/PricingPreview";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />

      {/* Interactive AI Demo */}
      <DemoSection />

      <TrustedBy />

      <Features />

      <Benefits />

      <ROICalculator />

      <TrustSection />

      <WhyChooseUs />

      <Testimonials />

      <PricingPreview />

      <FAQ />

      <CTA />
    </main>
  );
}