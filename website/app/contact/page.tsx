import Hero from "@/components/contact/Hero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import FAQ from "@/components/contact/FAQ";
import CTA from "@/components/contact/CTA";

export default function ContactPage() {
  return (
    <>
      <Hero />
      <ContactInfo />
      <ContactForm />
      <FAQ />
      <CTA />
    </>
  );
}