import LogoLockup from "@/components/LogoLockup";
import BeamTick from "@/components/BeamTick";
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

/** Urgency bar plus the sticky parchment nav, on every page. */
export function TopBar() {
  return <SiteNav />;
}

/* ── Footer ─────────────────────────────────────────────────────────── */

const footerLink =
  "text-[15px] leading-[1.5] font-normal text-parchment no-underline hover:text-brass text-left";

export function Footer() {
  return (
    <footer className="bg-walnut px-6 pb-[clamp(48px,6vw,80px)] pt-[clamp(56px,7vw,96px)] text-parchment">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <h2 className="max-w-[520px] font-display text-[clamp(24px,3vw,30px)] font-bold leading-[1.2] text-parchment [text-wrap:pretty]">
            Someone answers, 24 hours a day
          </h2>
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_footer"
            className="font-display text-[24px] font-bold text-brass no-underline hover:text-brass-deep"
          >
            {PHONE_DISPLAY}
          </a>
        </div>

        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-9">
          <div>
            <p className="label label-brass mb-5">Get help</p>
            <ul className="flex flex-col gap-3.5">
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
            <p className="label label-brass mb-5">Practice areas</p>
            <ul className="flex flex-col gap-3.5">
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
            <p className="label label-brass mb-5">The firm</p>
            <ul className="flex flex-col gap-3.5">
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
            <p className="label label-brass mb-5">Office</p>
            <address className="mb-3 text-[15px] not-italic leading-[1.6] text-parchment">
              {OFFICE.street}
              <br />
              {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
            </address>
            <p className="text-[15px] leading-[1.6] text-muted-dark">
              Mon to Fri, 9 to 6
              <br />
              Evenings and weekends by appointment
              <br />
              Phone intake 24 hours
            </p>
            <p className="mt-3 text-[15px] leading-[1.6]">
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

        <div className="mb-7 mt-14 h-px bg-oak" />

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <LogoLockup tone="dark" mark={false} className="text-[20px]" />
            <span className="text-[13px] text-muted-dark">
              &copy; {new Date().getFullYear()} {FIRM_NAME}
            </span>
          </div>
          <Link
            href="/es"
            className="flex min-h-[44px] items-center gap-2 rounded-[2px] border-[1.5px] border-oak px-4 py-3 text-[14px] font-semibold text-parchment no-underline hover:border-brass hover:text-brass"
          >
            <span className="flex text-brass">
              <BeamTick className="h-[7px] w-[16px]" />
            </span>
            En español
          </Link>
        </div>

        <p className="mt-8 max-w-[820px] text-[13px] leading-[1.5] text-muted-dark">
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
