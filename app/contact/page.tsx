import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import IntakeForm from "@/components/IntakeForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import PhotoSlot from "@/components/PhotoSlot";
import { PhoneIcon, MailIcon, ChevronLeftIcon } from "@/components/Icons";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  FIRM_NAME,
  OFFICE,
  YEARS_IN_PRACTICE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact | ${FIRM_NAME}`,
  description: `Call, text, or send the form. ${YEARS_IN_PRACTICE} years in practice, free consultation, we reply within one business hour.`,
  alternates: { canonical: "/contact" },
};

/**
 * Wireframe 1g. Channel band first so nobody is forced into the form, then
 * a two-field start that reveals the rest once name and phone are filled.
 */
export default function ContactPage() {
  return (
    <>
      <LocalBusinessSchema />
      <TopBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
        {/* 1g opens with a back bar */}
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back
        </Link>
        <h1 className="font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em]">
          Two ways to reach us. Pick the faster one.
        </h1>

        {/* Channel band: call is primary, form is the alternative */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_contact"
            className="pill pill-primary flex-col gap-1 py-3 text-[13px]"
          >
            <PhoneIcon className="h-5 w-5" />
            Call
          </a>
          <a href="#form" className="pill pill-outline flex-col gap-1 py-3 text-[13px]">
            <MailIcon className="h-5 w-5" />
            Form
          </a>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted">
          Calling is fastest. We answer 24/7.
        </p>

        {/* Short form */}
        <section id="form" className="frame mt-8 bg-card p-5 sm:p-6">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.02em]">
            Send us the basics
          </h2>
          <p className="mt-1 text-[12.5px] text-muted">
            Two fields to start. We ask for more only if it helps.
          </p>
          <div className="mt-4">
            <IntakeForm />
          </div>
        </section>

        {/* Office and hours */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold tracking-[-0.02em]">
            Office &amp; hours
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="frame p-4 text-[13px] leading-relaxed text-muted">
              <p className="font-semibold text-ink">{FIRM_NAME}</p>
              <address className="mt-1 not-italic">
                {OFFICE.street}
                <br />
                {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
              </address>
              <p className="mt-2 text-[12.5px]">{OFFICE.perks.join(" · ")}</p>
              <p className="mt-3 font-semibold text-ink">Hours</p>
              {OFFICE.hours.map(([k, v]) => (
                <p key={k}>
                  {k}: {v}
                </p>
              ))}
              <p className="mt-2 text-[12.5px]">{OFFICE.afterHours}</p>
              <a
                href={PHONE_TEL}
                className="mt-3 inline-flex items-center gap-2 font-mono text-sm font-semibold text-ink hover:text-signal"
              >
                <PhoneIcon className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
            <a
              href={OFFICE.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <PhotoSlot
                label="Our building, get directions"
                src="/media/office-exterior.webp"
                className="min-h-[180px] w-full"
              />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
