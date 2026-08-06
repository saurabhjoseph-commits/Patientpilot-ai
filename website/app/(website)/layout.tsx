import Header from "@/components/Header";
import Footer from "@/components/home/Footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main className="min-h-screen pt-[72px] md:pt-20">
        {children}
      </main>

      <Footer />
    </>
  );
}
