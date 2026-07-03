import Hero from "@/components/pricing/Hero";
import PricingCards from "@/components/pricing/PricingCards";
import FeatureComparison from "@/components/pricing/FeatureComparison";
import ROI from "@/components/pricing/ROI";
import FAQ from "@/components/pricing/FAQ";
import CTA from "@/components/pricing/CTA";

export default function PricingPage() {
  return (
    <>
      <Hero />

      <PricingCards />

      <FeatureComparison />

      <ROI />

      <FAQ />

      <CTA />
    </>
  );
}