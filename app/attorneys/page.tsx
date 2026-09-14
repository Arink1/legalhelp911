import type { Metadata } from "next";
import Link from "next/link";
import FirmPage from "@/components/FirmPage";
import PhotoSlot from "@/components/PhotoSlot";
import { PhoneIcon } from "@/components/Icons";
import { ATTORNEYS, PRACTICE_AREAS, FIRM_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Attorneys | ${FIRM_NAME}`,
  description: "The people who will actually handle your case, with direct lines.",
  alternates: { canonical: "/attorneys" },
};

export default function AttorneysIndex() {
  return (
    <FirmPage
      crumbs={[{ href: "/", label: "Home" }, { label: "Attorneys" }]}
      title="The people who will actually handle your case."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ATTORNEYS.map((a) => (
          <li key={a.slug} className="frame bg-card p-4">
            <Link href={`/attorneys/${a.slug}`} className="group block">
              {a.photo && (
                <PhotoSlot
                  label="Attorney portrait"
                  src={a.photo}
                  className="aspect-[4/5] w-full"
                />
              )}
              <p className="mt-3 font-display text-lg font-bold group-hover:text-ink-3">
                {a.name}
              </p>
              <p className="text-[12.5px] text-muted">
                {a.role} &middot;{" "}
                {a.practices
                  .map((s) => PRACTICE_AREAS.find((p) => p.slug === s)?.chip ?? s)
                  .join(", ")}
              </p>
            </Link>
            <a
              href={a.directTel}
              data-analytics="call_tap_attorney_card"
              className="mt-3 inline-flex items-center gap-2 font-mono text-[13px] font-semibold hover:text-signal"
            >
              <PhoneIcon className="h-3.5 w-3.5" />
              Direct line
            </a>
          </li>
        ))}
      </ul>
    </FirmPage>
  );
}
