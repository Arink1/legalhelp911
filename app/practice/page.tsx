import type { Metadata } from "next";
import Link from "next/link";
import FirmPage from "@/components/FirmPage";
import { ChevronRightIcon } from "@/components/Icons";
import { PRACTICE_AREAS, FIRM_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Practice areas | ${FIRM_NAME}`,
  description:
    "Five practice areas: criminal defense, family law, civil litigation, business, and personal injury, in Broward County.",
  alternates: { canonical: "/practice" },
};

export default function PracticeIndex() {
  return (
    <FirmPage
      crumbs={[{ href: "/", label: "Home" }, { label: "Practice areas" }]}
      title="Five things we do. Pick the one that sounds like your week."
    >
      <ul className="divide-y divide-line border-y border-line">
        {PRACTICE_AREAS.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/practice/${p.slug}`}
              className="group flex items-center justify-between gap-4 py-5 transition hover:bg-card"
            >
              <div>
                <p className="flex items-center gap-2 font-display text-lg font-bold group-hover:text-ink-3">
                  {p.title}
                  {p.isNew && (
                    <span className="rounded-full bg-brass-soft px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ink">
                      New
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[13px] text-muted">{p.searchedFor}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold">
                Open
                <ChevronRightIcon className="h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[14px] bg-card px-5 py-4">
        <p className="text-[14px] text-muted">Not sure which one fits?</p>
        <Link href="/qualify" className="pill pill-outline px-5 text-[13px]">
          Answer 4 questions instead
        </Link>
      </div>
    </FirmPage>
  );
}
