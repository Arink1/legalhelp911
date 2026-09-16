import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import StickyActionBar from "@/components/StickyActionBar";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import HeroMosaic from "@/components/HeroMosaic";
import BeamTick from "@/components/BeamTick";
import CtaPanel from "@/components/CtaPanel";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_NAME,
  FIRM_NAME,
  PRACTICE_AREAS,
  ATTORNEYS,
  NOTABLE_MATTERS,
  OFFICE,
  getPractice,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Talk to a lawyer today, not next month`,
  description: `${FIRM_NAME} handles criminal defense, family law, civil litigation, business matters, and personal injury from Miramar, Florida. The first case review is free. Phone intake 24 hours. Call ${PHONE_DISPLAY}.`,
  alternates: { canonical: "/", languages: { "es-US": "/es" } },
};

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function Home() {
  const principal =
    ATTORNEYS.find((a) => a.slug === "tyler-trumbach") ?? ATTORNEYS[0];

  return (
    <>
      <LocalBusinessSchema />
      <TopBar />
      <main>
        {/* ── Hero: walnut panel, full bleed ───────────────────────── */}
        <section className="bg-walnut">
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            <div className="flex min-w-0 flex-col justify-center gap-6 px-5 pb-6 pt-8 sm:px-[clamp(24px,3vw,56px)] md:gap-7 md:py-[clamp(48px,6vw,88px)]">
              <p className="eyebrow eyebrow-brass">{OFFICE.county}, Florida</p>
              <h1 className="h1 text-parchment">
                Talk to a lawyer today, not next month
              </h1>
              <p className="max-w-[480px] text-[15px] leading-[1.6] text-cream md:text-[17px] md:leading-[1.65]">
                The {FIRM_NAME} handles criminal defense, family law, civil
                litigation, business matters, and personal injury from our{" "}
                {OFFICE.city} office. The first case review is free.
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3.5">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Get a free case review
                </Link>
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_hero"
                  className="btn btn-cream btn-lg"
                >
                  Call {PHONE_DISPLAY}
                </a>
              </div>
              <ul className="flex flex-wrap gap-x-7 gap-y-2.5">
                {["Free consultation", "Phone intake 24 hours", "Se habla español"].map(
                  (c) => (
                    <li
                      key={c}
                      className="flex items-center gap-2 text-[14px] font-semibold text-cream"
                    >
                      <span className="flex text-brass">
                        <BeamTick className="h-2 w-[18px]" />
                      </span>
                      {c}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="min-w-0 px-5 pb-7 md:p-0">
              <HeroMosaic />
            </div>
          </div>
        </section>

        {/* ── Principal attorney ───────────────────────────────────── */}
        {principal && (
          <section className="px-5 py-[clamp(48px,6vw,88px)] sm:px-6">
            <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(32px,4vw,64px)]">
              <div className="min-w-0 max-w-[440px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={principal.photoSquare ?? principal.photo}
                  alt={`${principal.name.replace(", Esq.", "")}, ${principal.role}`}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[4/5] w-full rounded-[2px] border border-linen object-cover object-[50%_20%]"
                />
                <p className="eyebrow mt-[18px]">Principal attorney</p>
              </div>
              <div className="min-w-0">
                <h2 className="h2-name mb-1.5 text-walnut">{principal.name}</h2>
                <p className="mb-6 font-display text-[19px] italic leading-[1.4] text-oak">
                  {FIRM_NAME}
                </p>
                <p className="mb-4 max-w-[560px] text-[17px] leading-[1.65] text-body">
                  {principal.bio}
                </p>
                <p className="mb-7 max-w-[560px] text-[16px] leading-[1.65] text-muted">
                  He is admitted before the federal courts of the Southern and
                  Middle Districts of Florida, and works with trial attorneys Of
                  Counsel on high-exposure criminal and civil matters. Columbia
                  University, B.A.; Fordham University School of Law, J.D.
                </p>
                <div className="grid max-w-[600px] grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-7 border-t border-linen pt-[26px]">
                  <div>
                    <p className="label mb-3">Admitted</p>
                    <ul className="flex flex-col gap-2 text-[15px] leading-[1.5] text-mid">
                      <li>The Florida Bar</li>
                      <li>New York, First Judicial Department</li>
                      <li>S.D. and M.D. of Florida</li>
                    </ul>
                  </div>
                  <div>
                    <p className="label mb-3">Focus</p>
                    <ul className="flex flex-col gap-2 text-[15px] leading-[1.5] text-mid">
                      <li>Complex civil litigation</li>
                      <li>Criminal defense</li>
                      <li>Commercial and business disputes</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3.5">
                  <Link href="/contact" className="btn btn-primary btn-lg">
                    Get a free case review
                  </Link>
                  <Link href="/attorneys" className="btn btn-secondary btn-lg">
                    Attorneys Of Counsel
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Practice areas: white band ───────────────────────────── */}
        <section className="panel">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-6 md:mb-[clamp(32px,4vw,48px)]">
              <div>
                <p className="eyebrow mb-3.5">Practice areas</p>
                <h2 className="h2 max-w-[620px] text-walnut">What we handle</h2>
              </div>
              <Link href="/practice" className="btn btn-secondary hidden sm:inline-flex">
                See how each is priced
              </Link>
            </div>

            {/* Desktop: five cards with a 3px oak top rule. */}
            <ul className="hidden grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-5 md:grid">
              {PRACTICE_AREAS.map((p, i) => (
                <li key={p.slug} className="flex">
                  <Link
                    href={`/practice/${p.slug}`}
                    className="card flex w-full flex-col items-start text-left no-underline hover:border-t-walnut"
                  >
                    <span className="font-display text-[15px] font-bold leading-none text-oak">
                      {num(i)}
                    </span>
                    <span className="mb-2.5 mt-[18px] font-display text-[22px] font-bold leading-[1.2] text-walnut">
                      {p.title}
                    </span>
                    <span className="text-[14px] leading-[1.55] text-muted">
                      {p.handles.join(" · ")}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2.5 text-[14px] font-bold leading-none text-walnut">
                      <span className="flex text-oak">
                        <BeamTick className="h-[7px] w-4" />
                      </span>
                      Learn more
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Phones: full-width rows with a 3px oak left rule. */}
            <ul className="flex flex-col gap-3 md:hidden">
              {PRACTICE_AREAS.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/practice/${p.slug}`}
                    className="flex min-h-[44px] items-center justify-between gap-3.5 rounded-[2px] border border-linen border-l-[3px] border-l-oak bg-parchment py-4 pl-[18px] pr-4 no-underline"
                  >
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-2.5">
                        <span className="font-display text-[12px] font-bold text-oak">
                          {num(i)}
                        </span>
                        <span className="font-display text-[17px] font-bold leading-[1.2] text-walnut">
                          {p.title}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-[12px] leading-[1.45] text-muted">
                        {p.handles.join(" · ")}
                      </span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-[18px] text-oak">
                      &rsaquo;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 sm:hidden">
              <Link href="/practice" className="btn btn-secondary w-full">
                See how each is priced
              </Link>
            </p>
          </div>
        </section>

        {/* ── Recent matters ───────────────────────────────────────── */}
        <section id="notable-matters" className="px-5 py-[clamp(48px,6vw,88px)] sm:px-6">
          <div className="mx-auto max-w-[1280px]">
            <p className="eyebrow mb-3.5">Recent matters</p>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <h2 className="h2 max-w-[560px] text-walnut">
                Matters our attorneys have been part of
              </h2>
              <p className="max-w-[400px] text-[14px] leading-[1.6] text-muted">
                These describe involvement, not outcomes. No result in any
                matter guarantees a similar result in yours.
              </p>
            </div>
            <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(24px,3vw,40px)] md:mt-11">
              {NOTABLE_MATTERS.map((m) => {
                const practice = getPractice(m.practiceSlug);
                const attorney = ATTORNEYS.find((a) => a.slug === m.attorneySlug);
                return (
                  <li key={m.headline} className="border-t-[3px] border-oak pt-6">
                    <p className="label">{practice?.title}</p>
                    <h3 className="mb-3 mt-3.5 font-display text-[21px] font-bold leading-[1.3] text-walnut">
                      {m.headline}
                    </h3>
                    <p className="text-[15px] leading-[1.65] text-muted">
                      {m.detail}
                      {attorney && (
                        <>
                          {" "}
                          <Link
                            href={`/attorneys/${attorney.slug}`}
                            className="font-semibold text-walnut"
                          >
                            {attorney.name.replace(", Esq.", "")}
                          </Link>
                          , {attorney.role}.
                        </>
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────── */}
        <CtaPanel
          title="Tell us what happened. The first review costs nothing."
          legal="Contacting the firm does not create an attorney-client relationship. Please do not send confidential details until a representation agreement is signed."
        />
      </main>
      <Footer />
      <StickyActionBar />
    </>
  );
}
