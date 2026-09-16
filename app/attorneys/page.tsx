import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/SiteChrome";
import StickyActionBar from "@/components/StickyActionBar";
import BeamTick from "@/components/BeamTick";
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
        className="block aspect-square w-full rounded-[2px] object-cover"
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
        className="grid aspect-square w-full place-items-center rounded-[2px] border border-linen bg-parchment p-6 text-center"
      >
        <span className="font-display text-[40px] font-bold leading-none text-oak">
          {initials(a.name)}
        </span>
      </div>
      <p className="mt-2.5 text-center text-[13px] leading-[1.5] text-muted">
        Headshot to be supplied
      </p>
    </>
  );
}

function ListBlock({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="label mb-3">{label}</p>
      <ul className="flex flex-col gap-2 text-[14px] leading-[1.5] text-muted">
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
        <section className="px-5 pt-8 sm:px-6 md:pt-[clamp(48px,6vw,72px)]">
          <div className="mx-auto max-w-[840px]">
            <p className="eyebrow mb-5">Attorneys</p>
            <h1 className="h1-page mb-4 text-walnut md:mb-5">
              The people who take the call
            </h1>
            <p className="lead max-w-[620px]">
              A principal attorney admitted in Florida and New York, with two
              trial lawyers Of Counsel for high-exposure criminal and civil
              matters.
            </p>
          </div>
        </section>

        <section className="px-5 pt-8 sm:px-6 md:pt-[clamp(40px,5vw,56px)]">
          <ul className="mx-auto flex max-w-[1080px] flex-col gap-7">
            {ATTORNEYS.map((a) => {
              const extra = a.bioLong?.filter((p) => p !== a.bio).slice(0, 2) ?? [];
              return (
                <li key={a.slug} className="card md:p-[clamp(28px,3vw,40px)]">
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] items-start gap-x-10 gap-y-8">
                    <div className="min-w-0 max-w-[260px]">
                      <Portrait a={a} />
                      {a.badges.length > 0 && (
                        <ul className="mt-4 flex flex-col gap-2">
                          {a.badges.map((b) => (
                            <li
                              key={b}
                              className="flex items-center gap-2 text-[14px] font-semibold text-mid"
                            >
                              <span className="flex text-oak">
                                <BeamTick className="h-[7px] w-4" />
                              </span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="mb-1.5 font-display text-[26px] font-bold leading-[1.2] text-walnut">
                        <Link
                          href={`/attorneys/${a.slug}`}
                          className="text-walnut no-underline hover:text-oak"
                        >
                          {a.name}
                        </Link>
                      </h2>
                      <p className="label mb-[18px]">{a.role}</p>
                      <p className="mb-3.5 text-[16px] leading-[1.65] text-body">{a.bio}</p>
                      {extra.map((p) => (
                        <p
                          key={p.slice(0, 40)}
                          className="mb-3.5 text-[16px] leading-[1.65] text-muted"
                        >
                          {p}
                        </p>
                      ))}
                      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-6 border-t border-linen pt-6">
                        <ListBlock label="Admissions" items={a.admissions} />
                        <ListBlock label="Focus" items={a.focus} />
                        <ListBlock label="Education" items={a.education} />
                      </div>
                      <p className="mt-6">
                        <Link
                          href={`/attorneys/${a.slug}`}
                          className="inline-flex items-center gap-2.5 text-[14px] font-bold leading-none text-walnut no-underline hover:text-oak"
                        >
                          <span className="flex text-oak">
                            <BeamTick className="h-[7px] w-4" />
                          </span>
                          Full profile
                        </Link>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="px-5 py-[clamp(48px,6vw,88px)] sm:px-6">
          <div className="card card-brass-top mx-auto max-w-[1080px] md:p-[clamp(28px,3vw,40px)]">
            <h3 className="h3 mb-3 text-walnut">Which attorney takes my matter?</h3>
            <p className="mb-6 text-[15px] leading-[1.65] text-muted">
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
      <StickyActionBar />
    </>
  );
}
