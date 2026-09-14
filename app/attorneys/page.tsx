import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import { ATTORNEYS, SITE_NAME, type Attorney } from "@/lib/site";

export const metadata: Metadata = {
  title: `Attorneys | ${SITE_NAME}`,
  description:
    "A principal attorney admitted in Florida and New York, with two trial lawyers Of Counsel for high-exposure criminal and civil matters.",
  alternates: { canonical: "/attorneys" },
};

function initials(name: string) {
  return name
    .replace(/,.*$/, "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !/^[A-Z]\.$/.test(w))
    .map((w) => w[0])
    .filter((c, i, arr) => i === 0 || i === arr.length - 1)
    .join("")
    .toUpperCase();
}

function Portrait({ a }: { a: Attorney }) {
  const src = a.photoSquare ?? a.photo;
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={a.name.replace(", Esq.", "")}
        width={400}
        height={400}
        className="block aspect-square w-full rounded-full object-cover"
      />
    );
  }
  // Compliance: no photo was supplied for this attorney, so render a
  // monogram with a visible caption. Never substitute a generated or stock
  // portrait under a named lawyer.
  return (
    <>
      <div
        role="img"
        aria-label={`${a.name.replace(", Esq.", "")}, headshot to be supplied`}
        className="grid aspect-square w-full place-items-center rounded-full bg-monogram p-6 text-center"
      >
        <span className="text-[40px] font-medium leading-none tracking-[-0.02em] text-ink">
          {initials(a.name)}
        </span>
      </div>
      <p className="mt-2.5 text-center text-[12px] leading-[1.4] text-muted">
        Headshot to be supplied
      </p>
    </>
  );
}

function ListBlock({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="label mb-2.5">{label}</p>
      <ul className="flex flex-col gap-1.5 text-[14px] leading-[1.4] text-muted">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AttorneysIndex() {
  return (
    <>
      <TopBar />
      <main>
        <section className="px-5 pt-12 sm:px-6 md:pt-[72px]">
          <div className="mx-auto max-w-[840px]">
            <p className="eyebrow">Attorneys</p>
            <h1 className="h1-page my-6">The people who take the call</h1>
            <p className="lead max-w-[620px]">
              A principal attorney admitted in Florida and New York, with two
              trial lawyers Of Counsel for high-exposure criminal and civil
              matters.
            </p>
          </div>
        </section>

        <section className="px-5 pt-10 sm:px-6 md:pt-16">
          <ul className="mx-auto flex max-w-[1080px] flex-col gap-6 md:gap-8">
            {ATTORNEYS.map((a) => {
              const extra = a.bioLong?.filter((p) => p !== a.bio).slice(0, 2) ?? [];
              return (
                <li key={a.slug} className="card md:p-10">
                  <div className="grid items-start gap-x-10 gap-y-8 md:grid-cols-[260px_minmax(0,1fr)]">
                    <div className="min-w-0 max-w-[260px]">
                      <Portrait a={a} />
                      {a.badges.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {a.badges.map((b) => (
                            <li key={b} className="chip chip-outline chip-sm">
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="mb-1 text-[26px] font-medium leading-[1.15] tracking-[-0.02em]">
                        <Link
                          href={`/attorneys/${a.slug}`}
                          className="text-ink hover:text-ink"
                        >
                          {a.name}
                        </Link>
                      </h2>
                      <p className="mb-5 text-[15px] font-medium text-muted">{a.role}</p>
                      <p className="mb-3.5 text-[16px] leading-normal">{a.bio}</p>
                      {extra.map((p) => (
                        <p key={p.slice(0, 40)} className="mb-3.5 text-[16px] leading-normal text-muted">
                          {p}
                        </p>
                      ))}
                      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-6">
                        <ListBlock label="Admissions" items={a.admissions} />
                        <ListBlock label="Focus" items={a.focus} />
                        <ListBlock label="Education" items={a.education} />
                      </div>
                      <p className="mt-6">
                        <Link
                          href={`/attorneys/${a.slug}`}
                          className="inline-flex items-center gap-2 text-[15px] font-medium"
                        >
                          Full profile
                          <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="px-5 py-16 sm:px-6 md:py-[clamp(64px,8vw,112px)]">
          <div className="card-lifted mx-auto max-w-[1080px] md:p-10">
            <h3 className="h3 mb-3">Which attorney takes my matter?</h3>
            <p className="mb-7 text-[15px] leading-normal text-muted">
              That depends on the matter. Criminal and high-exposure civil cases
              are often handled with Of Counsel trial attorneys; everyday
              matters are handled by the principal. You will be told who is
              handling your file before any work begins.
            </p>
            <Link href="/contact" className="btn btn-primary w-full sm:w-auto">
              Get a free case review
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
