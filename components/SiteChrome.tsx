import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import RevealGroup from "@/components/RevealGroup";
import PhotoSlot from "@/components/PhotoSlot";
import { PhoneIcon, ChevronRightIcon } from "@/components/Icons";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_NAME,
  FIRM_NAME,
  YEARS_IN_PRACTICE,
  PRACTICE_AREAS,
  ATTORNEYS,
  NAV_LINKS,
  OFFICE,
} from "@/lib/site";

export { SiteNav };

/** Nav on the opaque page ground. Pages with a video band use SiteNav over. */
export function TopBar() {
  return (
    <header className="bg-paper">
      <SiteNav />
    </header>
  );
}

/* ── Homepage / shared sections ─────────────────────────────────────── */

/** All five practice areas. This grid is the site's primary navigation. */
export function PracticeGrid() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="kicker">Practice areas</p>
        <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
          Five things we do. Pick the one that sounds like your week.
        </h2>
        <RevealGroup
          as="ul"
          className="reveal-cards mt-7 grid grid-cols-2 gap-3 lg:grid-cols-5"
        >
          {PRACTICE_AREAS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/practice/${p.slug}`}
                className="frame flex h-full flex-col justify-between gap-3 bg-card p-4 transition hover:border-brass"
              >
                <span className="font-display text-[15px] font-bold leading-tight">
                  {p.title}
                </span>
                <span className="text-[11.5px] leading-snug text-muted">
                  {p.descriptor}
                </span>
              </Link>
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/** Three numbered steps, no jargon. */
export function HowItWorks() {
  const steps = [
    "Tell us what happened",
    "A lawyer reviews it, free",
    "We tell you your options",
  ];
  return (
    <section className="border-b border-line bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="kicker">How it works</p>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((label, i) => (
            <li key={label} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brass font-mono text-[13px] font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-1 font-display text-lg font-bold leading-tight">
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}


/**
 * Short about-the-firm block for the homepage. Three paragraphs maximum:
 * the full story lives on /about.
 */
export function AboutFirmShort() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:py-14">
        <PhotoSlot
          label="The firm"
          src="/media/office-exterior-tall.webp"
          className="aspect-[4/3] w-full"
        />
        <div>
          <p className="kicker">About the firm</p>
          <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
            {YEARS_IN_PRACTICE} years of {OFFICE.county} work, five things we do
            well.
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
            <p>
              We have practised in {OFFICE.county} long enough that the
              courthouse staff, the local judges, and most of the opposing
              counsel are people we know by name.
            </p>
            <p>
              We take five kinds of matter rather than everything, because
              depth in the work we do beats a longer list we do not.
            </p>
            <p>
              The first conversation is free and carries no obligation. If we
              take your case, the fee arrangement is in writing before you sign.
            </p>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {[`${YEARS_IN_PRACTICE} years`, "Free consultation", "Broward County"].map(
              (c) => (
                <li
                  key={c}
                  className="rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold"
                >
                  {c}
                </li>
              )
            )}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/about" className="pill pill-outline px-5 text-[13px]">
              More about the firm
            </Link>
            <Link href="/attorneys" className="pill pill-outline px-5 text-[13px]">
              Meet the attorneys
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Strip of four attorneys linking to their bios. */
export function AttorneysStrip() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">Attorneys</p>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em]">
              The people who will actually handle your case.
            </h2>
          </div>
          <Link
            href="/attorneys"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-ink hover:text-ink-3 sm:flex"
          >
            All attorneys
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <ul className="strip mt-7 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {ATTORNEYS.map((a) => (
            <li key={a.slug} className="w-[220px] sm:w-auto">
              <Link href={`/attorneys/${a.slug}`} className="group block">
                {a.photo && (
                  <PhotoSlot
                    label="Attorney portrait"
                    src={a.photo}
                    className="aspect-[4/5] w-full"
                  />
                )}
                <p className="mt-3 font-display text-base font-bold group-hover:text-ink-3">
                  {a.name}
                </p>
                <p className="text-[12.5px] text-muted">
                  {a.role} &middot;{" "}
                  {a.practices
                    .map(
                      (s) => PRACTICE_AREAS.find((p) => p.slug === s)?.chip ?? s
                    )
                    .join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/attorneys"
          className="mt-5 block text-center text-sm font-semibold text-ink underline underline-offset-4 sm:hidden"
        >
          All attorneys
        </Link>
      </div>
    </section>
  );
}

/** Office location: address, parking, directions. */
export function OfficeAndMap() {
  return (
    <section className="border-b border-line bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-14">
        <div>
          <p className="kicker">Office location</p>
          <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
            {OFFICE.street}
          </h2>
          <p className="mt-1 font-display text-xl font-bold text-muted">
            {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
          </p>
          <p className="mt-4 text-[15px] text-muted">
            {OFFICE.perks.join(" \u00b7 ")}
          </p>
          <p className="mt-1 text-[15px] text-muted">{OFFICE.hoursLine}</p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href={OFFICE.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-outline px-5"
            >
              Get directions
            </a>
            <Link href="/contact" className="pill pill-primary px-5">
              Book a visit
            </Link>
          </div>
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_office"
            className="mt-5 inline-flex items-center gap-2 font-mono text-[15px] font-semibold hover:text-signal"
          >
            <PhoneIcon className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
        </div>
        <PhotoSlot
          label="Our building"
          src="/media/office-exterior.webp"
          className="min-h-[240px] w-full lg:min-h-[300px]"
        />
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────── */

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/logo.png"
              alt={FIRM_NAME}
              width={150}
              height={59}
              className="h-7 w-auto"
            />
            <p className="mt-3 text-xs text-muted">
              {YEARS_IN_PRACTICE} years in practice. Free consultation.
            </p>
            <address className="mt-3 text-xs not-italic leading-relaxed text-muted">
              {OFFICE.street}
              <br />
              {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
            </address>
            <a
              href={PHONE_TEL}
              className="mt-3 inline-flex items-center gap-2 font-mono text-sm font-semibold hover:text-signal"
            >
              <PhoneIcon className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>

          <div>
            <p className="kicker mb-3">Practice areas</p>
            <ul className="space-y-1.5 text-xs text-muted">
              {PRACTICE_AREAS.map((p) => (
                <li key={p.slug}>
                  <Link href={`/practice/${p.slug}`} className="hover:text-ink">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="kicker mb-3">Firm</p>
            <ul className="space-y-1.5 text-xs text-muted">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/es" className="hover:text-ink">
                  Espanol
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="kicker mb-3">Legal</p>
            <div className="space-y-3 text-[11px] leading-relaxed text-muted">
              <p>
                ATTORNEY ADVERTISING. This website is advertising for{" "}
                {FIRM_NAME}, operating as {SITE_NAME}. The information here is
                general and is not legal advice. Using this site, calling, or
                texting does not create an attorney-client relationship; that
                relationship begins only when a written agreement is signed.
              </p>
              <p>
                Every case is different and prior results do not guarantee a
                similar outcome. Consultations are free; fee arrangements vary
                by matter and are explained in writing before any engagement.
              </p>
              <p>
                &copy; {new Date().getFullYear()} {FIRM_NAME}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
