import type { Metadata } from "next";
import Link from "next/link";
import FirmPage from "@/components/FirmPage";
import PhotoSlot from "@/components/PhotoSlot";
import { ATTORNEYS, PRACTICE_AREAS, FIRM_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Attorneys | ${FIRM_NAME}`,
  description: "The people who will actually handle your case. Every matter starts with a free case review.",
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
          </li>
        ))}
      </ul>
    </FirmPage>
  );
}
