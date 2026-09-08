import type { Metadata } from "next";
import { TopBar, Footer } from "@/components/SiteChrome";
import ThankYouPanel from "@/components/ThankYouPanel";
import { FIRM_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Request received | ${FIRM_NAME}`,
  robots: { index: false },
};

export default function ThankYou() {
  return (
    <>
      <TopBar />
      <main className="min-h-[70vh]">
        <ThankYouPanel />
      </main>
      <Footer />
    </>
  );
}
