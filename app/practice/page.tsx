import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import StickyActionBar from "@/components/StickyActionBar";
import BeamTick from "@/components/BeamTick";
import CtaPanel from "@/components/CtaPanel";
import PracticeJumpRow from "@/components/PracticeJumpRow";
import { PRACTICE_AREAS, SITE_NAME, OFFICE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Practice areas | ${SITE_NAME}`,
  description:
    "Five practice areas out of one Miramar office: criminal defense, family law, civil litigation, business, and personal injury. How each is priced, in writing.",
  alternates: { canonical: "/practice" },
};

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function PracticeIndex() {
  const entries = PRACTICE_AREAS.map((p, i) => ({
    ...p,
    id: `pa-${i + 1}`,
    num: num(i),
  }));

  return (
    <>
      <TopBar />
      <main>
        {/* ── Header: walnut, full bleed ───────────────────────────── */}
        <section className="bg-walnut px-5 py-8 sm:px-6 md:py-[clamp(48px,6vw,88px)]">
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-end gap-x-16 gap-y-8">
            <div className="min-w-0">
              <p className="eyebrow eyebrow-brass mb-5">Practice areas</p>
              <h1 className="h1 mb-4 text-parchment md:mb-5">
                What we handle, and how it is priced
              </h1>
              <p className="max-w-[560px] text-[15px] leading-[1.6] text-cream md:text-[17px] md:leading-[1.65]">
                Five practice areas out of one {OFFICE.city} office. Pricing
                differs by practice, and the terms are set out in writing before
                you commit to anything.
              </p>
            </div>
            <div className="flex min-w-0 flex-col items-start gap-3.5">
              <Link href="/contact" className="btn btn-primary btn-lg w-full sm:w-auto">
                Get a free case review
              </Link>
              <p className="max-w-[380px] text-[14px] leading-[1.55] text-muted-dark">
                Not sure which one you need? Describe what happened and we will
                tell you.
              </p>
            </div>
          </div>
        </section>

        <PracticeJumpRow
          items={entries.map((e) => ({ id: e.id, num: e.num, title: e.title }))}
        />

        {/* ── Five entries ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          {entries.map((p) => (
            <section
              key={p.slug}
              id={p.id}
              className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(28px,4vw,64px)] border-b border-linen py-8 md:py-[clamp(48px,6vw,88px)]"
            >
              <div className="min-w-0">
                <p className="stat">{p.num}</p>
                <h2 className="h2-name mb-4 mt-[18px] text-walnut">{p.title}</h2>
                <p className="lead mb-[22px] max-w-[520px]">{p.intro}</p>
                <p className="mb-7 flex max-w-[520px] items-start gap-3 text-[15px] font-bold leading-[1.55] text-walnut">
                  <span className="mt-2 flex text-oak">
                    <BeamTick className="h-[7px] w-4" />
                  </span>
                  <span>{p.urgency}</span>
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                  <Link href="/contact" className="btn btn-primary w-full sm:w-auto">
                    Describe your matter
                  </Link>
                  <Link
                    href={`/practice/${p.slug}`}
                    className="text-[15px] font-bold text-oak"
                  >
                    More about {p.title.toLowerCase()}
                  </Link>
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
                <div className="card !px-6 !pb-7 !pt-[26px]">
                  <p className="label mb-4">What we handle</p>
                  <ul className="flex flex-col gap-3 text-[15px] leading-[1.5] text-body">
                    {p.handles.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span className="mt-[7px] flex text-oak">
                          <BeamTick className="h-[7px] w-4" />
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card card-brass-top !px-6 !pb-7 !pt-[26px]">
                  <p className="label mb-4">How it is priced</p>
                  <p className="text-[15px] leading-[1.65] text-mid">{p.costs}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="h-[clamp(48px,6vw,88px)]" />
        <CtaPanel
          title="Not sure which practice area you need? Tell us what happened."
          legal="The first review is free in every practice area. Contacting the firm does not create an attorney-client relationship."
          analytics="call_tap_practice_cta"
        />
      </main>
      <Footer />
      <StickyActionBar />
    </>
  );
}
