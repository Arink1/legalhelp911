import Link from "next/link";
import ScalesMark from "@/components/ScalesMark";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

/**
 * The closing walnut panel: animated brass mark, a headline, the primary
 * button, the phone in Baskerville, and one legal line. Sits inside a
 * parchment section on Home and Practice areas.
 */
export default function CtaPanel({
  title,
  legal,
  analytics = "call_tap_cta",
}: {
  title: string;
  legal: string;
  analytics?: string;
}) {
  return (
    <section className="px-4 pb-[clamp(48px,6vw,88px)] sm:px-6">
      <div className="panel-walnut mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-9">
        <div className="flex max-w-[520px] flex-col gap-[22px]">
          <ScalesMark tone="brass" className="w-[76px]" />
          <h2 className="h2 text-parchment">{title}</h2>
        </div>
        <div className="flex flex-col gap-[18px] md:justify-self-start">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get a free case review
            </Link>
            <a
              href={PHONE_TEL}
              data-analytics={analytics}
              className="inline-flex items-center py-2 font-display text-[18px] font-bold text-parchment no-underline hover:text-brass sm:py-3.5"
            >
              Or call {PHONE_DISPLAY}
            </a>
          </div>
          <p className="text-[13px] leading-[1.5] text-muted-dark">{legal}</p>
        </div>
      </div>
    </section>
  );
}
