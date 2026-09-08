import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav, Footer } from "@/components/SiteChrome";
import VideoHero from "@/components/VideoHero";
import PhotoSlot from "@/components/PhotoSlot";
import LeadForm from "@/components/LeadForm";
import { getPosts } from "@/lib/posts";
import { PhoneIcon, CheckIcon, ClockIcon } from "@/components/Icons";
import {
  PRACTICE_AREAS,
  getPractice,
  ATTORNEYS,
  PHONE_DISPLAY,
  PHONE_TEL,
  FIRM_NAME,
  YEARS_IN_PRACTICE,
} from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRACTICE_AREAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getPractice(slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.title} | ${FIRM_NAME}`,
    description: `${p.h1} ${p.descriptor}. Call ${PHONE_DISPLAY}.`,
    alternates: { canonical: `/practice/${p.slug}` },
    openGraph: {
      title: `${p.title} | ${FIRM_NAME}`,
      description: `${p.h1} ${p.searchedFor}.`,
      url: `/practice/${p.slug}`,
      type: "website",
    },
  };
}

/**
 * Wireframe 1e. One instance per practice area from a single template.
 * The H1 carries the ad keyword and maps 1:1 to an ad group, which is the
 * whole reason this page exists. Two-column on desktop (1.25fr text /
 * 1fr sticky form); on mobile the form card sits directly under the H1.
 */
export default async function PracticePage({ params }: Params) {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) notFound();

  // Real attorneys who actually take this kind of matter.
  const team = ATTORNEYS.filter((a) => a.practices.includes(practice.slug));
  // A couple of related explainers, so the page has somewhere to send
  // readers who are not ready to call yet.
  const reading = (await getPosts()).slice(0, 3);

  const faqLd = practice.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: practice.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <main>
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}
        {/* 2c: video behind the whole hero band, nav and H1 over the footage */}
        <VideoHero clip={practice.clip} scrim="flat">
          <div className="relative">
            <SiteNav over />

            {/* Hero grid: 1.25fr text / 1fr opaque form card */}
            <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-7 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-[22px] lg:pb-14">
              <div className="flex flex-col max-lg:contents">
                <p className="font-mono text-[8.5px] font-extrabold uppercase tracking-[0.12em] text-white/70">
                  {practice.title}
                </p>
                <h1 className="mt-2.5 font-display text-[30px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white sm:text-[36px]">
                  {practice.h1}
                </h1>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/75">
                  {practice.intro}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2 max-lg:order-3 max-lg:mt-6">
                  {practice.qualifiers.map((q) => (
                    <li
                      key={q}
                      className="flex items-center gap-1.5 rounded-full border-[1.5px] border-white/85 px-3 py-1.5 text-[11.5px] font-semibold text-white"
                    >
                      <CheckIcon className="h-3 w-3" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opaque card on top of the footage, sticky on desktop */}
              <div className="lg:self-start">
                <div className="rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.35)] lg:sticky lg:top-6">
                  <LeadForm
                    practiceSlug={practice.slug}
                    caseTypes={practice.caseTypes}
                    showDateField={practice.slug === "injury"}
                  />
                </div>
              </div>
            </div>
          </div>
        </VideoHero>

        {/* Three equal cards. The old version let each column find its own
            height and parked a tall photo under the third, which read as
            broken rather than composed. */}
        <section className="bg-card">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
            <p className="kicker">Working with us on this</p>
            <h2 className="mt-2.5 max-w-2xl font-display text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
              What we take on, what it costs, and what happens after you call.
            </h2>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="frame flex h-full flex-col bg-paper p-5">
                <p className="kicker">01 &middot; Scope</p>
                <h3 className="mt-2 font-display text-xl font-bold">
                  What we handle
                </h3>
                <ul className="mt-4 space-y-2.5 text-[15px] text-muted">
                  {practice.handles.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-brass" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="frame flex h-full flex-col bg-paper p-5">
                <p className="kicker">02 &middot; Cost</p>
                <h3 className="mt-2 font-display text-xl font-bold">
                  What it costs you
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  {practice.costs}
                </p>
                <p className="mt-auto pt-4 text-[13px] leading-relaxed text-ink">
                  The first conversation is free either way, and there is no
                  obligation to hire us.
                </p>
              </div>

              <div className="frame flex h-full flex-col bg-paper p-5">
                <p className="kicker">03 &middot; Next</p>
                <h3 className="mt-2 font-display text-xl font-bold">
                  What happens next
                </h3>
                <ol className="mt-4 mb-5 space-y-3">
                  {practice.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass font-mono text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-[15px] leading-snug text-muted">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_explainer"
                  className="pill pill-primary mt-auto w-full text-[14px]"
                >
                  <PhoneIcon className="h-4 w-4" />
                  Start with a call
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Who actually handles this, with real credentials */}
        {team.length > 0 && (
          <section className="border-t border-line bg-paper">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
              <p className="kicker">Who handles this</p>
              <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
                {team.length === 1
                  ? "The attorney who takes these matters."
                  : "The attorneys who take these matters."}
              </h2>
              <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((a) => (
                  <li key={a.slug} className="frame bg-card p-4">
                    <Link href={`/attorneys/${a.slug}`} className="group block">
                      <PhotoSlot
                        label="Attorney portrait"
                        src={a.photo}
                        className="aspect-[4/5] w-full"
                      />
                      <p className="mt-3 font-display text-base font-bold group-hover:text-ink-3">
                        {a.name}
                      </p>
                      <p className="text-[12.5px] text-muted">{a.role}</p>
                    </Link>
                    <ul className="mt-3 space-y-1 text-[11.5px] text-muted">
                      {a.admissions.slice(0, 3).map((ad) => (
                        <li key={ad} className="flex gap-1.5">
                          <CheckIcon className="mt-0.5 h-3 w-3 shrink-0 text-brass" />
                          {ad}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={a.directTel}
                      data-analytics="call_tap_practice_attorney"
                      className="mt-3 inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold hover:text-signal"
                    >
                      <PhoneIcon className="h-3.5 w-3.5" />
                      Call about this
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Common questions: the SEO payload, and the objections people
            actually raise on the first call */}
        {practice.faq.length > 0 && (
          <section className="border-t border-line bg-card">
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
              <p className="kicker">Common questions</p>
              <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
                What people ask us first.
              </h2>
              <dl className="mt-7 divide-y divide-line border-y border-line">
                {practice.faq.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="font-display text-base font-bold">{f.q}</dt>
                    <dd className="mt-2 text-[15px] leading-relaxed text-muted">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[12px] leading-relaxed text-muted">
                General information, not legal advice. Rules and deadlines vary
                and change; confirm what applies to your situation before
                relying on any of it.
              </p>
            </div>
          </section>
        )}

        {/* Urgency band: the one honest scarcity in this category */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
            <p className="flex items-center justify-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brass">
              <ClockIcon className="h-3.5 w-3.5" />
              {YEARS_IN_PRACTICE} years in this county
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-[-0.025em]">
              {practice.urgency}
            </h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link href="/contact" className="pill pill-primary w-full sm:w-auto sm:px-7">
                Free case review
              </Link>
              <a
                href={PHONE_TEL}
                data-analytics="call_tap_urgency"
                className="pill w-full border-[1.75px] border-white/40 text-white hover:border-white sm:w-auto sm:px-7"
              >
                <PhoneIcon className="h-4 w-4" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        {/* Somewhere to go for people not ready to call yet */}
        {reading.length > 0 && (
          <section className="border-t border-line">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
              <p className="kicker mb-3">Related reading</p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {reading.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/news/${r.slug}`}
                      className="frame flex h-full flex-col gap-2 bg-card p-4 transition hover:border-brass"
                    >
                      <span className="font-display text-[15px] font-bold leading-snug">
                        {r.title}
                      </span>
                      <span className="text-[11.5px] text-muted">
                        {r.readMinutes} min read
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Cross-links to the other practices */}
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="kicker mb-3">Other practice areas</p>
          <ul className="flex flex-wrap gap-2">
            {PRACTICE_AREAS.filter((p) => p.slug !== practice.slug).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/practice/${p.slug}`}
                  className="flex rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold transition hover:bg-ink hover:text-white"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
