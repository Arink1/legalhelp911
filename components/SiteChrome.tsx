import LogoLockup from "@/components/LogoLockup";
import ScalesMark from "@/components/ScalesMark";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  EMAIL_DISPLAY,
  EMAIL_LINK,
  PHONE_DISPLAY,
  PHONE_TEL,
  SMS_LINK,
  SITE_NAME,
  FIRM_NAME,
  PRACTICE_AREAS,
  FOOTER_FIRM_LINKS,
  OFFICE,
} from "@/lib/site";

export { SiteNav };

/** Urgency strip plus the sticky pill nav, on every page. */
export function TopBar() {
  return <SiteNav />;
}

/* ── Footer ─────────────────────────────────────────────────────────── */

const footerLink =
  "text-[15px] leading-5 font-[450] text-white hover:text-white hover:underline hover:underline-offset-[3px] text-left";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-6 pb-[max(80px,env(safe-area-inset-bottom))] pt-16 text-white sm:pb-[120px] sm:pt-[100px]">
      <ScalesMark
        tone="white"
        className="pointer-events-none absolute -right-10 top-8 w-[220px] opacity-[0.1] sm:w-[320px] lg:right-6"
      />
      <div className="relative mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="h2 max-w-[520px] text-white">
            Someone answers, 24 hours a day
          </h2>
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_footer"
            className="text-[22px] font-medium text-white hover:text-white"
          >
            {PHONE_DISPLAY}
          </a>
        </div>

        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 sm:mt-16">
          <div>
            <p className="mb-6 text-[14px] font-bold uppercase leading-[14px] tracking-[0.04em] text-white/60">
              Get help
            </p>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/contact" className={footerLink}>
                  Free case review
                </Link>
              </li>
              <li>
                <a href={PHONE_TEL} className={footerLink}>
                  Call {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={SMS_LINK} className={footerLink}>
                  Text the firm
                </a>
              </li>
              <li>
                <a href={EMAIL_LINK} data-analytics="email_tap_footer" className={footerLink}>
                  {EMAIL_DISPLAY}
                </a>
              </li>
              <li>
                <NewsletterSignup className={footerLink} />
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-6 text-[14px] font-bold uppercase leading-[14px] tracking-[0.04em] text-white/60">
              Practice areas
            </p>
            <ul className="flex flex-col gap-4">
              {PRACTICE_AREAS.map((p) => (
                <li key={p.slug}>
                  <Link href={`/practice/${p.slug}`} className={footerLink}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-6 text-[14px] font-bold uppercase leading-[14px] tracking-[0.04em] text-white/60">
              The firm
            </p>
            <ul className="flex flex-col gap-4">
              {FOOTER_FIRM_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={footerLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-6 text-[14px] font-bold uppercase leading-[14px] tracking-[0.04em] text-white/60">
              Office
            </p>
            <address className="mb-3 text-[15px] not-italic leading-normal text-white">
              {OFFICE.street}
              <br />
              {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
            </address>
            <p className="text-[15px] leading-normal text-white/70">
              Mon to Fri, 9 to 6
              <br />
              Evenings and weekends by appointment
              <br />
              Phone intake 24 hours
            </p>
            <p className="mt-3 text-[15px] leading-normal">
              <a
                href={OFFICE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLink}
              >
                Get directions
              </a>
            </p>
          </div>
        </div>

        <div className="my-8 h-px bg-white/30 sm:mb-8 sm:mt-16" />

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <span className="inline-flex items-center rounded-full bg-white px-5 py-2.5">
            <LogoLockup className="text-[28px] sm:text-[32px]" />
          </span>
          <span className="text-[13px] text-white/60">
            &copy; {new Date().getFullYear()} {FIRM_NAME}
          </span>
        </div>

        <p className="mt-10 max-w-[820px] text-[13px] leading-normal text-white/60">
          Attorney advertising. The hiring of a lawyer is an important decision
          that should not be based solely upon advertisements. {SITE_NAME} is a
          service of the {FIRM_NAME}, {OFFICE.address}. Contacting the firm
          does not create an attorney-client relationship, and no work is
          performed on your behalf until a representation agreement is signed.
          Descriptions of matters reflect involvement, not outcomes; no result
          in any matter guarantees a similar result in yours.
        </p>
      </div>
    </footer>
  );
}
