import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import { PhoneIcon, ChevronRightIcon } from "@/components/Icons";
import { PHONE_DISPLAY, PHONE_TEL, YEARS_IN_PRACTICE } from "@/lib/site";

export type Crumb = { href?: string; label: string };

/**
 * The one skeleton all six firm pages share: nav, breadcrumb, H1 band on the
 * tinted ground, content, CTA band, footer. Only the content block changes.
 */
export default function FirmPage({
  crumbs,
  title,
  intro,
  aside,
  ctaTitle = "Reading about it is not the same as asking about it.",
  children,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  aside?: React.ReactNode;
  ctaTitle?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-paper">
          <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-4 pt-5 text-[11.5px] text-muted sm:px-6">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
                {i < crumbs.length - 1 && (
                  <ChevronRightIcon className="h-3 w-3 opacity-60" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* H1 band on the tinted ground */}
        <section className="border-b border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 lg:py-12">
            <h1 className="max-w-3xl font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-4xl">
              {title}
            </h1>
            {intro && (
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                {intro}
              </p>
            )}
            {aside}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          {children}
        </section>

        {/* CTA band */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
            <h2 className="mx-auto max-w-2xl font-display text-2xl font-extrabold leading-tight tracking-[-0.025em] sm:text-3xl">
              {ctaTitle}
            </h2>
            <p className="mt-3 text-sm text-white/70">
              {YEARS_IN_PRACTICE} years in practice. The first conversation is
              free.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link href="/contact" className="pill pill-primary w-full sm:w-auto sm:px-7">
                Free case review
              </Link>
              <a
                href={PHONE_TEL}
                data-analytics="call_tap_firm_cta"
                className="pill w-full border-[1.75px] border-white/40 text-white hover:border-white sm:w-auto sm:px-7"
              >
                <PhoneIcon className="h-4 w-4" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
