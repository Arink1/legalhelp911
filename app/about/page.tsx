import type { Metadata } from "next";
import FirmPage from "@/components/FirmPage";
import PhotoSlot from "@/components/PhotoSlot";
import { FIRM_NAME, YEARS_IN_PRACTICE, PRACTICE_AREAS, OFFICE } from "@/lib/site";

export const metadata: Metadata = {
  title: `About | ${FIRM_NAME}`,
  description: `${YEARS_IN_PRACTICE} years in Broward County, five practice areas, and a free first consultation.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <FirmPage
      crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      title={`${YEARS_IN_PRACTICE} years in {OFFICE.county}. That is the whole pitch.`}
      aside={
        <dl className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            [String(YEARS_IN_PRACTICE), "years in practice"],
            [String(PRACTICE_AREAS.length), "practice areas"],
            ["Free", "first consultation"],
          ].map(([big, small]) => (
            <div key={small} className="frame bg-paper px-4 py-4 text-center">
              <dt className="font-display text-2xl font-extrabold leading-none">
                {big}
              </dt>
              <dd className="mt-1 text-[12px] text-muted">{small}</dd>
            </div>
          ))}
        </dl>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-[16px] leading-relaxed text-muted">
          <p>
            We have practised in this county for {YEARS_IN_PRACTICE} years. In
            that time the courthouse staff, the local judges, and most of the
            opposing counsel have become people we know by name. That is not a
            marketing line, it is just what happens when a firm stays in one
            place long enough.
          </p>
          <p>
            We take five kinds of matter rather than everything, which is a deliberate choice.
            The reason is simple: people rarely arrive with a tidy legal
            category. They arrive with a bad week. Someone was hurt, someone was
            charged, someone was served, someone cannot pay. Handling the range
            means we can usually help, and when we cannot, we say so on the
            first call rather than the third.
          </p>
          <p>
            The first conversation is free and carries no obligation. If we take
            your case, the fee arrangement is explained in writing before you
            sign anything.
          </p>

          {/* The handoff permits only two claims until the firm supplies proof */}
          <div className="frame bg-card p-4 text-[13.5px] text-ink">
            <p className="font-semibold">What we do not claim</p>
            <p className="mt-1.5 text-muted">
              You will not find settlement totals, award badges, or a &quot;no
              fee unless we win&quot; promise anywhere on this site. Those are
              only worth printing if they can be verified, and until the firm
              supplies proof we would rather say nothing than say something
              unearned.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <PhotoSlot
            label="Our building"
            src="/media/office-exterior-tall.webp"
            className="aspect-[4/3] w-full"
          />
          <div>
            <h2 className="font-display text-xl font-bold">
              Community &amp; courthouse presence
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {OFFICE.address}. {OFFICE.perks.join(" and ")}.
            </p>
          </div>
        </div>
      </div>
    </FirmPage>
  );
}
