import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import { PRACTICE_AREAS, SITE_NAME, OFFICE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Practice areas | ${SITE_NAME}`,
  description:
    "Five practice areas out of one Plantation office: criminal defense, family law, civil litigation, business, and personal injury. How each is priced, in writing.",
  alternates: { canonical: "/practice" },
};

export default function PracticeIndex() {
  return (
    <>
      <TopBar />
      <main>
        <section className="px-5 pt-12 sm:px-6 md:pt-[72px]">
          <div className="mx-auto max-w-[840px]">
            <p className="eyebrow">Practice areas</p>
            <h1 className="h1-page my-6">What we handle, and how it is priced</h1>
            <p className="lead max-w-[620px]">
              Five practice areas out of one {OFFICE.city} office. Pricing
              differs by practice, and the terms are set out in writing before
              you commit to anything.
            </p>
          </div>
        </section>

        <section className="px-5 pt-10 sm:px-6 md:pt-16">
          <ul className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
            {PRACTICE_AREAS.map((p) => (
              <li key={p.slug} className="card flex flex-col">
                <p className="label">{p.chip}</p>
                <h2 className="mb-2 mt-4 text-[24px] font-medium leading-[1.2] tracking-[-0.02em]">
                  <Link href={`/practice/${p.slug}`} className="text-ink hover:text-ink">
                    {p.title}
                  </Link>
                </h2>
                <p className="mb-5 text-[15px] leading-normal text-muted">{p.intro}</p>
                <ul className="mb-5 flex list-disc flex-col gap-2 pl-[18px] text-[15px] leading-[1.4]">
                  {p.handles.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="mt-auto border-t border-hairline pt-5">
                  <p className="label">How it is priced</p>
                  <p className="mb-5 mt-2.5 text-[15px] leading-normal text-muted">
                    {p.costs}
                  </p>
                  <p className="text-[15px] font-medium leading-[1.4]">{p.urgency}</p>
                  <p className="mt-5">
                    <Link
                      href={`/practice/${p.slug}`}
                      className="inline-flex items-center gap-2 text-[15px] font-medium"
                    >
                      More about {p.title.toLowerCase()}
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 py-16 sm:px-6 md:py-[clamp(64px,8vw,112px)]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get a free case review
            </Link>
            <Link href="/attorneys" className="btn btn-secondary btn-lg">
              Meet the attorneys
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
