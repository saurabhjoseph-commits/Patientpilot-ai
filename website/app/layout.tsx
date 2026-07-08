import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}