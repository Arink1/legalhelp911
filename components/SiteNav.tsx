"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoLockup from "@/components/LogoLockup";
import {
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_NAME,
  OFFICE,
} from "@/lib/site";

const LINKS = [{ href: "/", label: "Home" }, ...NAV_LINKS] as const;

/**
 * Walnut urgency bar, then the sticky parchment nav with a 2px walnut rule.
 *
 * Links are Karla 700, uppercase, with a 2px brass underline bar under the
 * active label. Right side carries the phone in Baskerville and the brass
 * "Free case review" button. Below the desktop breakpoint the nav collapses
 * to mark + wordmark + a 44px square hamburger, and the menu opens as a
 * parchment panel under the rule.
 *
 * `over` is accepted for the practice landing pages that render the nav on
 * top of a video band; the opaque parchment bar reads fine there.
 */
export default function SiteNav({ over: _over = false }: { over?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-walnut px-4 py-2 text-center text-[12px] leading-[1.5] text-parchment sm:px-6 sm:py-[11px] sm:text-[13px]">
        <span className="hidden sm:inline">
          Phone intake 24 hours a day. {OFFICE.afterHours}
        </span>
        <span className="sm:hidden">Phone intake 24 hours</span>
        <a
          href={PHONE_TEL}
          data-analytics="call_tap_strip"
          className="font-bold text-brass no-underline hover:text-brass hover:underline"
        >
          {PHONE_DISPLAY}
        </a>
      </div>

      <header className="sticky top-0 z-40 border-b-2 border-walnut bg-parchment">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-[1280px] items-center justify-between gap-x-6 gap-y-3 px-4 py-2.5 sm:px-6 sm:py-3.5"
        >
          <Link
            href="/"
            aria-label={`${SITE_NAME} home`}
            className="flex shrink-0 items-center no-underline"
          >
            <LogoLockup className="text-[18px] sm:text-[22px] lg:text-[26px]" />
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className="flex min-h-[44px] flex-col items-center justify-center gap-[5px] px-3.5 py-2.5 text-[14px] font-bold uppercase leading-[1.2] tracking-[0.08em] text-walnut no-underline hover:text-oak"
                  >
                    <span>{l.label}</span>
                    <span
                      aria-hidden="true"
                      className={`block h-[2px] w-full ${
                        active ? "bg-brass" : "bg-transparent"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={PHONE_TEL}
              data-analytics="call_tap_nav"
              className="hidden whitespace-nowrap font-display text-[19px] font-bold text-walnut no-underline hover:text-oak md:inline"
            >
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              className="btn btn-primary btn-nav hidden md:inline-flex"
            >
              Free case review
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[2px] border-[1.5px] border-walnut text-walnut lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-3.5 w-[18px]">
                <span
                  className={`absolute left-0 block h-[2px] w-[18px] bg-current transition-transform ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-[2px] w-[18px] bg-current transition-opacity ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-[18px] bg-current transition-transform ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-nav"
            className="border-t border-linen bg-parchment lg:hidden"
          >
            <ul className="mx-auto max-w-[1280px] px-4 py-2 sm:px-6">
              {LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className="flex min-h-[48px] items-center gap-3 border-b border-linen text-[14px] font-bold uppercase tracking-[0.08em] text-walnut no-underline hover:text-oak"
                    >
                      {l.label}
                      {active && (
                        <span aria-hidden="true" className="block h-[2px] w-6 bg-brass" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mx-auto grid max-w-[1280px] gap-2.5 px-4 pb-5 pt-2 sm:px-6">
              <Link href="/contact" className="btn btn-primary btn-lg w-full">
                Free case review
              </Link>
              <a
                href={PHONE_TEL}
                data-analytics="call_tap_nav_mobile"
                className="btn btn-secondary btn-lg w-full"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
