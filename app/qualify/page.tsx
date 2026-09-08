import type { Metadata } from "next";
import { TopBar, Footer } from "@/components/SiteChrome";
import QualifierFlow from "@/components/QualifierFlow";
import { FIRM_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Check my case | ${FIRM_NAME}`,
  description:
    "Answer four questions and an attorney will tell you today whether your case is worth pursuing. Free and confidential.",
  alternates: { canonical: "/qualify" },
};

export default function QualifyPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto min-h-[70vh] w-full max-w-md px-4 py-8 sm:px-6">
        <QualifierFlow />
      </main>
      <Footer />
    </>
  );
}
