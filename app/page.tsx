import type { Metadata } from "next";
import {
  SiteNav,
  Footer,
  PracticeGrid,
  HowItWorks,
  AboutFirmShort,
  AttorneysStrip,
  OfficeAndMap,
} from "@/components/SiteChrome";
import StickyActionBar from "@/components/StickyActionBar";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import VideoHero from "@/components/VideoHero";
import LeadForm from "@/components/LeadForm";
import { PhoneIcon } from "@/components/Icons";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  FIRM_NAME,
  YEARS_IN_PRACTICE,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${FIRM_NAME} | Talk to a lawyer in the next 5 minutes`,
  description: `Hurt, arrested, or served papers? ${YEARS_IN_PRACTICE} years in practice, free consultation, we answer 24/7. Call or text ${PHONE_DISPLAY}.`,
  alternates: { canonical: "/", languages: { "es-US": "/es" } },
};

/**
 * Screen 3a. Video hero band carrying the 2c treatment on desktop (nav and
 * H1 over the footage, form card beside them) and the 2a treatment on
 * mobile (full-bleed video, content on a bottom-up scrim). Then the ten
 * practice tiles, which are the site's real navigation, how it works, the
 * attorneys strip, and the office. Nothing sits between hero and grid.
 */
export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <main>
        <VideoHero clip="hero-loop" scrim="bottom">
          <div className="relative flex min-h-[560px] flex-col lg:min-h-0">
            <SiteNav over />

            {/* Mobile: spacer pushes the content block to the hero's bottom */}
            <div className="flex-1 lg:hidden" />

            <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-5 pt-14 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-[22px] lg:py-14">
              <div>
                <h1 className="max-w-xl font-display text-[26px] font-extrabold leading-[1.12] tracking-[-0.025em] text-white sm:text-[34px] lg:text-[38px]">
                  Hurt, arrested, or served papers? Talk to a lawyer in the next
                  5 minutes.
                </h1>

                <p className="mt-3 text-[13px] font-semibold text-white/60 lg:hidden">
                  {YEARS_IN_PRACTICE} years &middot; free consultation &middot; 24/7
                </p>
                <ul className="mt-5 hidden flex-wrap gap-2 lg:flex">
                  {[
                    `${YEARS_IN_PRACTICE} years`,
                    "Free consultation",
                    "We answer 24/7",
                  ].map((c) => (
                    <li
                      key={c}
                      className="rounded-full border-[1.5px] border-white/85 px-3 py-1.5 text-[11.5px] font-semibold text-white"
                    >
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 max-w-md lg:mt-7 lg:max-w-none">
                  <a
                    href={PHONE_TEL}
                    data-analytics="call_tap_hero"
                    className="pill pill-primary min-h-[60px] w-full text-[17px] lg:inline-flex lg:w-auto lg:px-8"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    {PHONE_DISPLAY}
                  </a>
                </div>

                <p className="mt-3 max-w-md text-center text-[11px] text-white/60 lg:text-left">
                  No cost to ask. No obligation.
                </p>
              </div>

              {/* Form card sits inside the hero on desktop only */}
              <div className="hidden lg:block">
                <div className="rounded-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <LeadForm title="Start a free case review" />
                </div>
              </div>
            </div>
          </div>
        </VideoHero>

        {/* Nothing between hero and grid: the grid is the real navigation */}
        <PracticeGrid />
        <HowItWorks />
        <AboutFirmShort />
        <AttorneysStrip />
        <OfficeAndMap />
      </main>
      <Footer />
      <StickyActionBar />
    </>
  );
}
