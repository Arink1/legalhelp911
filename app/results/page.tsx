import type { Metadata } from "next";
import Link from "next/link";
import FirmPage from "@/components/FirmPage";
import PhotoSlot from "@/components/PhotoSlot";
import { CheckIcon, ChevronRightIcon } from "@/components/Icons";
import {
  FIRM_NAME,
  ATTORNEYS,
  PRACTICE_AREAS,
  NOTABLE_MATTERS,
  allAdmissions,
  getAttorney,
  getPractice,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `Results & experience | ${FIRM_NAME}`,
  description:
    "Notable matters, the courts we are admitted in, and who handles what. Outcomes are described in words, not figures.",
  alternates: { canonical: "/results" },
};

export default function ResultsPage() {
  const admissions = allAdmissions();

  return (
    <FirmPage
      crumbs={[{ href: "/", label: "Home" }, { label: "Results" }]}
      title="Experience you can check."
      intro="We would rather show you verifiable work than a wall of numbers. Below are matters our attorneys have handled, the courts we are admitted in, and who takes what."
    >
      {/* Notable matters, supplied by the firm */}
      <section>
        <p className="kicker">Notable matters</p>
        <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em]">
          Cases our attorneys have been part of.
        </h2>
        <ul className="mt-6 grid gap-4 lg:grid-cols-3">
          {NOTABLE_MATTERS.map((m) => {
            const a = getAttorney(m.attorneySlug);
            const pr = getPractice(m.practiceSlug);
            return (
              <li key={m.headline} className="frame flex h-full flex-col bg-card p-5">
                {pr && (
                  <span className="self-start rounded-full bg-brass-soft px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em]">
                    {pr.title}
                  </span>
                )}
                <h3 className="mt-3 font-display text-[17px] font-bold leading-snug">
                  {m.headline}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">
                  {m.detail}
                </p>
                {a && (
                  <Link
                    href={`/attorneys/${a.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold hover:text-ink-3"
                  >
                    {a.name}
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
          These entries describe involvement in the matter, not a claimed
          outcome. Involvement in a widely reported case is not a prediction
          about any other case.
        </p>
      </section>

      {/* Courts, which are objectively checkable */}
      <section className="mt-14">
        <p className="kicker">Where we appear</p>
        <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em]">
          Courts our attorneys are admitted in.
        </h2>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {admissions.map((ad) => (
            <li
              key={ad}
              className="frame flex items-start gap-2.5 bg-card px-4 py-3 text-[14px]"
            >
              <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-brass" />
              {ad}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12.5px] text-muted">
          Bar admissions are a matter of public record and can be verified with
          the relevant bar or clerk.
        </p>
      </section>

      {/* Who handles what */}
      <section className="mt-14">
        <p className="kicker">Depth by practice</p>
        <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em]">
          Who takes what.
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {PRACTICE_AREAS.map((pr) => {
            const team = ATTORNEYS.filter((a) => a.practices.includes(pr.slug));
            return (
              <li key={pr.slug} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                <Link
                  href={`/practice/${pr.slug}`}
                  className="min-w-[170px] font-display text-base font-bold hover:text-ink-3"
                >
                  {pr.title}
                </Link>
                <span className="flex flex-wrap gap-2">
                  {team.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/attorneys/${a.slug}`}
                      className="rounded-full border-[1.5px] border-ink px-3 py-1 text-[11.5px] font-semibold transition hover:bg-ink hover:text-white"
                    >
                      {a.name.replace(", Esq.", "")}
                    </Link>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Reviews: deliberately empty until the firm supplies real ones */}
      <section className="mt-14">
        <p className="kicker">Client reviews</p>
        <h2 className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.025em]">
          Reviews go here, once they are real.
        </h2>
        <div className="frame mt-6 bg-card p-6">
          <p className="text-[15px] leading-relaxed text-muted">
            We have not published client reviews yet. When we do, each one will
            come from a single review platform of record so anyone can check it
            against the source, rather than being retyped onto this page.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <PhotoSlot label="Review card" className="h-24 w-full" />
            <PhotoSlot label="Review card" className="h-24 w-full" />
            <PhotoSlot label="Review card" className="h-24 w-full" />
          </div>
        </div>
      </section>

      {/* Standing disclaimer, visible not buried */}
      <p className="frame mt-10 bg-card p-4 text-[13px] leading-relaxed text-muted">
        <strong className="text-ink">
          Prior results do not guarantee a similar outcome.
        </strong>{" "}
        Every case turns on its own facts. Nothing on this page is a promise or
        prediction about what will happen in your matter.
      </p>
    </FirmPage>
  );
}
