"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PhoneIcon, CheckIcon, ChevronRightIcon } from "@/components/Icons";
import PhotoSlot from "@/components/PhotoSlot";
import { PHONE_DISPLAY, PHONE_TEL, ATTORNEYS } from "@/lib/site";

/**
 * Screen 3d thank-you. Repeats the number we captured, names the person who
 * will review it, and offers a way to call now instead of waiting.
 *
 * The number comes from sessionStorage rather than a query parameter: it is
 * personal data and has no business sitting in a URL, a referrer header, or
 * a server log.
 *
 * The conversion event fires on page view, not on a button tap, so a lead
 * counts whether or not they also press call.
 */
export default function ThankYouPanel() {
  const [phone, setPhone] = useState<string | null>(null);
  const reviewer = ATTORNEYS[0];

  useEffect(() => {
    try {
      setPhone(sessionStorage.getItem("lh911.lastPhone"));
    } catch {
      // private mode: fall back to the generic wording
    }
    // Conversion fires here, on view.
    window.dispatchEvent(
      new CustomEvent("lh911:conversion", { detail: { type: "lead_submitted" } })
    );
  }, []);

  return (
    <div
      data-analytics="lead_submitted"
      className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10 text-center sm:px-6"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brass">
        <CheckIcon className="h-7 w-7 text-white" />
      </div>

      <h1 className="mt-5 font-display text-[26px] font-extrabold leading-tight tracking-[-0.025em]">
        Got it.{" "}
        {phone ? (
          <>
            We will call you at{" "}
            <span className="whitespace-nowrap">{phone}</span> within one
            business hour.
          </>
        ) : (
          <>We will call you within one business hour.</>
        )}
      </h1>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        If that number is wrong, fix it now. It is the only way we can reach
        you.
      </p>
      <Link
        href="/contact"
        className="mt-2 text-[13px] font-semibold text-ink underline underline-offset-4"
      >
        Edit my number
      </Link>

      {/* Who is reviewing it */}
      <div className="mt-7 flex w-full items-center gap-3 rounded-[14px] bg-card p-3 text-left">
        <PhotoSlot
          label="Attorney"
          src={reviewer.photoSquare}
          className="h-[52px] w-[52px] shrink-0"
          rounded="rounded-full"
        />
        <p className="text-[12.5px] leading-tight text-muted">
          <span className="block font-semibold text-ink">
            {reviewer.name} will review it
          </span>
          {reviewer.role}
        </p>
      </div>

      <a
        href={PHONE_TEL}
        data-analytics="call_tap_thankyou"
        className="pill pill-primary mt-4 min-h-[54px] w-full text-base"
      >
        <PhoneIcon className="h-5 w-5" />
        Call now, skip the wait
      </a>

      {/* What happens next, three lines, no fluff */}
      <div className="mt-8 w-full text-left">
        <p className="kicker mb-3">What happens next</p>
        <ol className="space-y-3">
          {[
            "An attorney reads what you sent, free.",
            `We call you${phone ? " at " + phone : ""} within one business hour.`,
            "You get a straight answer about whether you have a case.",
          ].map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass font-mono text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[14px] leading-snug text-muted">
                {line}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* While you wait */}
      <div className="mt-8 w-full text-left">
        <p className="kicker mb-2">While you wait</p>
        <ul className="divide-y divide-line border-y border-line">
          <li>
            <Link
              href="/news"
              className="flex items-center justify-between gap-3 py-3 text-[14px] font-medium hover:text-ink-3"
            >
              What to do this week
              <ChevronRightIcon className="h-4 w-4 text-muted" />
            </Link>
          </li>
          <li>
            <Link
              href="/news/insurance-adjuster-calls-what-to-say"
              className="flex items-center justify-between gap-3 py-3 text-[14px] font-medium hover:text-ink-3"
            >
              Do not talk to the insurer yet
              <ChevronRightIcon className="h-4 w-4 text-muted" />
            </Link>
          </li>
        </ul>
      </div>

      <Link
        href="/"
        className="mt-8 text-sm font-medium text-muted underline underline-offset-4 hover:text-ink"
      >
        Back to home
      </Link>

      <p className="mt-6 text-[11px] text-muted">
        Prefer to call? {PHONE_DISPLAY}
      </p>
    </div>
  );
}
