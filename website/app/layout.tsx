import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "PatientPilot AI",
  description: "AI Receptionist for Modern Dental Practices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        <Header />

        <main className="pt-20">{children}</main>

        <Footer />
      </body>
    </html>
  );
}