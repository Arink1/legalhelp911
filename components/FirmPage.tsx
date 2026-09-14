import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import { ChevronRightIcon } from "@/components/Icons";
import ScalesMark from "@/components/ScalesMark";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export type Crumb = { href?: string; label: string };

/**
 * Skeleton shared by the secondary firm pages (about, results, attorney and
 * practice bios, news): nav, breadcrumb, page H1, content, CTA panel, footer.
 */
export default function FirmPage({
  crumbs,
  title,
  intro,
  aside,
  ctaTitle = "Tell us what happened. The first review costs nothing.",
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
        <section className="px-5 pt-8 sm:px-6 md:pt-12">
          <div className="mx-auto max-w-[1280px]">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    {c.href ? (
                      <Link href={c.href} className="text-muted hover:text-ink">
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
            <ScalesMark className="mt-8 w-14 md:w-[72px]" />
            <h1 className="h1-page mt-5 max-w-[840px]">{title}</h1>
            {intro && <p className="lead mt-5 max-w-[620px]">{intro}</p>}
            {aside}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-10 sm:px-6 md:py-16">
          {children}
        </section>

        <section className="px-3 pb-16 sm:px-6 md:pb-[clamp(64px,8vw,128px)]">
          <div className="relative mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-10 overflow-hidden rounded-[28px] bg-lifted px-6 py-10 md:rounded-[40px] md:px-[clamp(28px,4vw,72px)] md:py-[clamp(48px,6vw,88px)]">
            <ScalesMark className="pointer-events-none absolute -right-8 -top-10 w-[200px] opacity-[0.12] md:-right-4 md:w-[300px]" />
            <h2 className="h2 relative max-w-[520px]">{ctaTitle}</h2>
            <div className="flex flex-col gap-5 md:justify-self-start">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Get a free case review
                </Link>
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_firm_cta"
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
    </>
  );
}
