import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import StickyActionBar from "@/components/StickyActionBar";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import HeroMosaic from "@/components/HeroMosaic";
import Accordion from "@/components/Accordion";
import StepPortraits from "@/components/StepPortraits";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_NAME,
  FIRM_NAME,
  YEARS_IN_PRACTICE,
  PRACTICE_AREAS,
  ATTORNEYS,
  NOTABLE_MATTERS,
  OFFICE,
  getPractice,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Talk to a lawyer today, not next month`,
  description: `${FIRM_NAME} handles criminal defense, family law, civil litigation, business matters, and personal injury from Plantation, Florida. The first case review is free. Phone intake 24 hours. Call ${PHONE_DISPLAY}.`,
  alternates: { canonical: "/", languages: { "es-US": "/es" } },
};

// Five questions for the homepage, one per practice plus the cost question.
// Answers come from lib/site.ts wherever one exists there.
const FAQ = [
  {
    q: "Should I talk to the police before I have a lawyer?",
    a: getPractice("criminal-defense")!.faq[0].a,
  },
  {
    q: "I was just served. What do I do first?",
    a: getPractice("civil-litigation")!.faq[0].a,
  },
  {
    q: "How long do I have to bring an injury claim?",
    a: getPractice("personal-injury")!.faq[0].a,
  },
  {
    q: "Do we have to go to court for a family matter?",
    a: getPractice("family-law")!.faq[0].a,
  },
  {
    q: "What does the first review cost?",
    a: "Nothing. The first case review is free in every practice area. If we take the matter, how it is priced depends on the practice, and the terms are in writing before you commit.",
  },
];

export default function Home() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <LocalBusinessSchema />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <TopBar />
      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="px-5 pt-8 sm:px-6 md:pt-12">
          <div className="mx-auto grid max-w-[1280px] items-center gap-8 pb-16 pt-2 md:grid-cols-[repeat(auto-fit,minmax(340px,1fr))] md:gap-x-[72px] md:gap-y-14 md:pb-24 md:pt-6">
            <div className="flex min-w-0 max-w-[540px] flex-col gap-7">
              <div>
                <p className="eyebrow">{OFFICE.county}, Florida</p>
                <h1 className="h1 mb-5 mt-4 md:mt-6">
                  Talk to a lawyer today, not next month
                </h1>
                <p className="lead max-w-[470px] text-[15px] md:text-[17px]">
                  The {FIRM_NAME} handles criminal defense, family law, civil
                  litigation, business matters, and personal injury from our{" "}
                  {OFFICE.city} office. The first case review is free.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Get a free case review
                </Link>
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_hero"
                  className="btn btn-secondary btn-lg"
                >
                  Call {PHONE_DISPLAY}
                </a>
              </div>
              <ul className="hidden flex-wrap gap-2.5 sm:flex">
                {["Free consultation", "Phone intake 24 hours", "Se habla español"].map(
                  (c) => (
                    <li key={c} className="chip chip-outline">
                      {c}
                    </li>
                  )
                )}
              </ul>
            </div>
            <HeroMosaic />
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <section className="px-5 pb-6 sm:px-6">
          <div className="rule mx-auto max-w-[1280px] pt-10 md:pt-16">
            <p className="mb-8 text-center text-[16px] leading-[1.4] text-muted md:mb-12">
              What the firm offers every caller
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 text-center md:gap-12">
              {[
                [`${YEARS_IN_PRACTICE} yrs`, "Of practice behind the firm"],
                ["Free", "First case review, every practice area"],
                ["24 hrs", "Phone intake, answered by a person"],
              ].map(([num, label]) => (
                <div key={num}>
                  <div className="stat">{num}</div>
                  <p className="mt-3 text-[14px] leading-[1.4] text-muted md:mt-4 md:text-[15px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Practice chips ───────────────────────────────────────── */}
        <section className="px-5 pt-16 sm:px-6 md:pt-24">
          <div className="mx-auto max-w-[1280px]">
            <p className="eyebrow">Practice areas</p>
            <h2 className="h2 mb-8 mt-4 max-w-[620px] md:mb-10">
              Five kinds of matter, one office
            </h2>
            <ul className="flex flex-wrap gap-3">
              {PRACTICE_AREAS.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/practice/${p.slug}`}
                    className={`chip ${i === 0 ? "chip-ink" : "chip-outline"}`}
                  >
                    {p.chip}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── First steps ──────────────────────────────────────────── */}
        <StepPortraits />

        {/* ── What we handle ───────────────────────────────────────── */}
        <section className="px-3 sm:px-6 md:mt-16">
          <div className="panel">
            <div className="mx-auto max-w-[1280px]">
              <p className="eyebrow">What we handle</p>
              <h2 className="h2 mt-4 max-w-[640px]">
                Bring us the matter and the deadline attached to it
              </h2>
              <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-x-16 gap-y-8 md:mt-14 md:gap-y-12">
                <div className="min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/media/practice-areas.webp"
                    alt="A client reviewing an agreement across the desk from an attorney"
                    width={1100}
                    height={1640}
                    loading="lazy"
                    decoding="async"
                    className="block h-[180px] w-full rounded-[28px] object-cover md:h-[520px] md:rounded-[40px]"
                  />
                </div>
                <div className="min-w-0">
                  <Accordion
                    variant="bare"
                    items={PRACTICE_AREAS.map((p) => ({
                      title: p.title,
                      body: (
                        <>
                          <p className="mb-2.5 text-[15px] leading-normal text-muted">
                            {p.handles.join(" · ")}
                          </p>
                          <p className="text-[14px] leading-normal text-ink">
                            {p.urgency}{" "}
                            <Link
                              href={`/practice/${p.slug}`}
                              className="font-medium"
                            >
                              More about {p.title.toLowerCase()}
                            </Link>
                          </p>
                        </>
                      ),
                    }))}
                  />
                  <div className="mt-6 md:mt-10">
                    <Link href="/contact" className="btn btn-primary w-full sm:w-auto">
                      Describe your matter
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The firm ─────────────────────────────────────────────── */}
        <section className="px-5 pt-16 sm:px-6 md:pt-[clamp(64px,8vw,128px)]">
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-x-20 gap-y-10">
            <div className="min-w-0">
              <p className="eyebrow">The firm</p>
              <h2 className="h2 mb-6 mt-4">{FIRM_NAME}</h2>
              <p className="mb-8 max-w-[480px] text-[16px] leading-[1.45]">
                A {OFFICE.city} firm serving {OFFICE.county}, with trial
                attorneys Of Counsel for high-exposure criminal and civil
                matters. Admitted in Florida and New York and before the federal
                courts of the Southern, Middle, and Northern Districts of Florida
                and the Eleventh Circuit.
              </p>
              <Link href="/attorneys" className="btn btn-primary w-full sm:w-auto">
                Meet the attorneys
              </Link>
            </div>
            <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
              <div className="rounded-[28px] bg-lifted px-6 py-7 md:rounded-[40px] md:px-7 md:py-8">
                <div className="text-[18px] font-medium leading-[1.3] tracking-[-0.01em]">
                  {OFFICE.street}
                </div>
                <p className="mt-2 text-[15px] leading-[1.4] text-muted">
                  {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
                  <br />
                  {OFFICE.county}
                </p>
                <p className="mt-4 text-[14px] leading-[1.4]">
                  <a
                    href={OFFICE.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions
                  </a>
                </p>
              </div>
              <div className="rounded-[28px] bg-lifted px-6 py-7 md:rounded-[40px] md:px-7 md:py-8">
                <div className="text-[18px] font-medium leading-[1.3] tracking-[-0.01em]">
                  Mon to Fri, 9 to 6
                </div>
                <p className="mt-2 text-[15px] leading-[1.4] text-muted">
                  Evenings and weekends by appointment. Phone intake 24 hours,
                  every day.
                </p>
                <p className="mt-4 text-[14px] leading-[1.4] text-ink">
                  Accessible entrance. Se habla español.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Notable matters ──────────────────────────────────────── */}
        <section id="notable-matters" className="px-5 pt-16 sm:px-6 md:pt-[clamp(64px,8vw,128px)]">
          <div className="mx-auto max-w-[1280px]">
            <p className="eyebrow">Notable matters</p>
            <h2 className="h2 mt-4 max-w-[620px]">
              Matters our attorneys have been part of
            </h2>
            <p className="mt-4 max-w-[620px] text-[15px] leading-normal text-muted">
              These describe involvement, not outcomes. No result in any matter
              guarantees a similar result in yours.
            </p>
            <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 md:mt-12">
              {NOTABLE_MATTERS.map((m) => {
                const practice = getPractice(m.practiceSlug);
                const attorney = ATTORNEYS.find((a) => a.slug === m.attorneySlug);
                return (
                  <li key={m.headline} className="card">
                    <p className="label">{practice?.title}</p>
                    <h3 className="mb-3 mt-4 text-[20px] font-medium leading-[1.25] tracking-[-0.01em]">
                      {m.headline}
                    </h3>
                    <p className="text-[15px] leading-normal text-muted">
                      {m.detail}
                    </p>
                    {attorney && (
                      <p className="mt-3 text-[14px] leading-normal text-muted">
                        <Link
                          href={`/attorneys/${attorney.slug}`}
                          className="font-medium text-ink"
                        >
                          {attorney.name.replace(", Esq.", "")}
                        </Link>
                        , {attorney.role}.
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="px-5 pt-16 sm:px-6 md:pt-[clamp(64px,8vw,128px)]">
          <div className="mx-auto max-w-[840px]">
            <p className="eyebrow">Questions</p>
            <h2 className="h2 mb-8 mt-4 md:mb-10">Before you call</h2>
            <Accordion
              variant="circle"
              items={FAQ.map((f) => ({
                title: f.q,
                body: (
                  <p className="text-[16px] leading-normal text-muted">{f.a}</p>
                ),
              }))}
            />
          </div>
        </section>

        {/* ── CTA panel ────────────────────────────────────────────── */}
        <section className="px-3 py-16 sm:px-6 md:py-[clamp(64px,8vw,128px)]">
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-10 rounded-[28px] bg-lifted px-6 py-10 md:rounded-[40px] md:px-[clamp(28px,4vw,72px)] md:py-[clamp(48px,6vw,88px)]">
            <h2 className="h2 max-w-[520px]">
              Tell us what happened. The first review costs nothing.
            </h2>
            <div className="flex flex-col gap-5 md:justify-self-start">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Get a free case review
                </Link>
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_cta"
                  className="inline-flex items-center py-2 text-[18px] font-medium text-ink hover:text-ink sm:py-4"
                >
                  Or call {PHONE_DISPLAY}
                </a>
              </div>
              <p className="text-[14px] leading-5 text-muted">
                Contacting the firm does not create an attorney-client
                relationship. Please do not send confidential details until a
                representation agreement is signed.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyActionBar />
    </>
  );
}
