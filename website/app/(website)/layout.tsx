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

      <main className="pt-20 min-h-screen">
        {children}
      </main>

      <Footer />
    </>
  );
}