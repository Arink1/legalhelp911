"use client";

import { useState } from "react";
import Link from "next/link";
import { PhoneIcon, ChevronRightIcon } from "@/components/Icons";
import {
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_TEL,
  FIRM_NAME,
  PRACTICE_AREAS,
} from "@/lib/site";

/**
 * Flat six-link nav with the phone number and "Free case review" pinned
 * right, on every page. Two skins:
 *   - `over` sits on the video hero band (white text, hairline rule)
 *   - default sits on the opaque page ground
 * Mobile is logo + Call pill + hamburger, per the turn-3 wireframes.
 */
export default function SiteNav({ over = false }: { over?: boolean }) {
  const [open, setOpen] = useState(false);

  const text = over ? "text-white/80" : "text-muted";
  const textHover = over ? "hover:text-white" : "hover:text-ink";
  const rule = over ? "border-white/20" : "border-line";

  return (
    <div className={`border-b ${rule}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-7">
          <Link
            href="/"
            aria-label={`${FIRM_NAME} home`}
            className={
              // Over footage the logo keeps its real navy and red, on a small
              // light plate, rather than being flattened to a white silhouette.
              over
                ? "shrink-0 rounded-full bg-paper/95 px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
                : "shrink-0"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/logo.png"
              alt={FIRM_NAME}
              width={168}
              height={66}
              className="h-7 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`${text} ${textHover}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_nav"
            className={
              over
                ? "pill hidden border-[1.75px] border-white/85 px-4 py-2 text-[13px] text-white hover:bg-white hover:text-ink sm:flex"
                : "pill hidden border-[1.75px] border-ink px-4 py-2 text-[13px] sm:flex"
            }
          >
            <PhoneIcon className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_nav_mobile"
            className="pill pill-primary px-4 py-2 text-[13px] sm:hidden"
          >
            <PhoneIcon className="h-4 w-4" />
            Call
          </a>
          <Link
            href="/contact"
            className="pill pill-primary hidden px-4 py-2 text-[13px] sm:flex"
          >
            Free case review
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] lg:hidden ${
              over ? "border-white/60 text-white" : "border-ink text-ink"
            }`}
          >
            <span aria-hidden="true" className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-[2px] w-4 bg-current transition-transform ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-[2px] w-4 bg-current transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[2px] w-4 bg-current transition-transform ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-line bg-paper lg:hidden"
        >
          <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line py-3 text-[15px] font-semibold text-ink last:border-0"
              >
                {l.label}
                <ChevronRightIcon className="h-4 w-4 text-muted" />
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 pb-2">
              {PRACTICE_AREAS.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  href={`/practice/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-full border-[1.5px] border-ink px-3 py-1.5 text-center text-[11.5px] font-semibold"
                >
                  {p.chip}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
