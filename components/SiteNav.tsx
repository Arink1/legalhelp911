"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_TEL,
  SITE_NAME,
  OFFICE,
} from "@/lib/site";

const LINKS = [{ href: "/", label: "Home" }, ...NAV_LINKS] as const;

/**
 * Ink urgency strip, then the sticky white pill nav.
 *
 * The active page is marked by a 5px orange dot under the label (not a
 * pill, not a colour change). On phones the pill collapses to logo +
 * hamburger, and the menu opens as a rounded card under the pill.
 *
 * `over` is accepted for the practice landing pages that still render the
 * nav on top of a video band. The white pill reads fine over footage, so
 * the prop changes nothing today.
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
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-ink px-4 py-2 text-center text-[12px] leading-4 text-canvas sm:px-6 sm:py-3 sm:text-[14px] sm:leading-5">
        <span className="hidden sm:inline">
          Phone intake 24 hours a day. {OFFICE.afterHours}
        </span>
        <span className="sm:hidden">Phone intake 24 hours</span>
        <a
          href={PHONE_TEL}
          data-analytics="call_tap_strip"
          className="font-medium text-canvas underline underline-offset-[3px] hover:text-white"
        >
          {PHONE_DISPLAY}
        </a>
      </div>

      {/* The sticky wrapper must sit directly in the page flow: a sticky
          element can only travel within its parent's box, so wrapping it in
          a short <header> would pin it to the top of the page instead. */}
      <header className="sticky top-3 z-40 px-3 pt-3 sm:top-6 sm:px-6 sm:pt-6">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 rounded-full bg-white py-2 pl-4 pr-2 shadow-nav sm:gap-6 sm:py-3 sm:pl-7 sm:pr-5"
        >
          <Link
            href="/"
            aria-label={`${SITE_NAME} home`}
            className="flex shrink-0 items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/logo-lockup.png"
              alt={SITE_NAME}
              width={900}
              height={236}
              className="block h-6 w-auto sm:h-9"
            />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-3.5 py-2 text-[15px] font-medium leading-[22px] tracking-[-0.01em] text-ink hover:text-ink hover:no-underline"
                  >
                    <span>{l.label}</span>
                    <span
                      aria-hidden="true"
                      className={`block h-[5px] w-[5px] rounded-full ${
                        active ? "bg-accent" : "bg-transparent"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={PHONE_TEL}
              data-analytics="call_tap_nav"
              className="hidden whitespace-nowrap text-[15px] font-medium text-ink hover:text-ink md:inline"
            >
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              className="btn btn-primary hidden min-h-[44px] px-6 text-[15px] md:inline-flex"
            >
              Free case review
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink shadow-[inset_0_0_0_1.5px_#141413] lg:hidden"
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
        </nav>

        {open && (
          <div
            id="mobile-nav"
            className="mx-auto mt-2 max-w-[1280px] rounded-[28px] bg-white p-3 shadow-card lg:hidden"
          >
            <ul>
              {LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className="flex min-h-[48px] items-center gap-3 rounded-[20px] px-4 text-[17px] font-medium text-ink hover:bg-canvas hover:text-ink hover:no-underline"
                    >
                      {l.label}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="block h-[5px] w-[5px] rounded-full bg-accent"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 grid gap-2 border-t border-hairline pt-3">
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
