import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FirmPage from "@/components/FirmPage";
import PhotoSlot from "@/components/PhotoSlot";
import { PhoneIcon, MailIcon, ChevronRightIcon } from "@/components/Icons";
import { getPosts } from "@/lib/posts";
import { ATTORNEYS, getAttorney, PRACTICE_AREAS, FIRM_NAME } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ATTORNEYS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = getAttorney(slug);
  if (!a) return { title: "Not found" };
  return {
    title: `${a.name}, ${a.role} | ${FIRM_NAME}`,
    description: a.bio,
    alternates: { canonical: `/attorneys/${a.slug}` },
  };
}

export default async function AttorneyBio({ params }: Params) {
  const { slug } = await params;
  const a = getAttorney(slug);
  if (!a) notFound();

  // Their writing, pulled from News by author.
  const posts = (await getPosts()).slice(0, 2);
  const practiceNames = a.practices
    .map((s) => PRACTICE_AREAS.find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <FirmPage
      crumbs={[
        { href: "/", label: "Home" },
        { href: "/attorneys", label: "Attorneys" },
        { label: a.name },
      ]}
      title={a.name}
      intro={`${a.role} · ${practiceNames.map((p) => p!.title).join(", ")}`}
      ctaTitle={`Talk to ${a.name} directly.`}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <PhotoSlot
            label="Attorney portrait"
            src={a.photo}
            className="aspect-[4/5] w-full"
          />
          {a.badges.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {a.badges.map((b) => (
                <li
                  key={b}
                  className="rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold"
                >
                  {b}
                </li>
              ))}
            </ul>
          )}
          {/* The CTA here is to call this attorney, not the generic form */}
          <div className="mt-5 space-y-2.5">
            <a
              href={a.directTel}
              data-analytics="call_tap_attorney_bio"
              className="pill pill-primary w-full"
            >
              <PhoneIcon className="h-4 w-4" />
              Call direct
            </a>
            <a href={`mailto:${a.email}`} className="pill pill-outline w-full">
              <MailIcon className="h-4 w-4" />
              Email
            </a>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4 text-[16px] leading-relaxed text-muted">
            {(a.bioLong ?? [a.bio]).map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold">Practice</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {practiceNames.map((p) => (
                <li key={p!.slug}>
                  <Link
                    href={`/practice/${p!.slug}`}
                    className="flex items-center gap-1 rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold transition hover:bg-ink hover:text-white"
                  >
                    {p!.title}
                    <ChevronRightIcon className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold">Admissions</h2>
            <ul className="mt-3 space-y-1.5 text-[15px] text-muted">
              {a.admissions.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                  {x}
                </li>
              ))}
            </ul>
          </div>

          {a.education && a.education.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold">Education</h2>
              <ul className="mt-3 space-y-1.5 text-[15px] text-muted">
                {a.education.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {a.focus && a.focus.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold">Focus areas</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {a.focus.map((x) => (
                  <li
                    key={x}
                    className="rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold"
                  >
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {a.languages && a.languages.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold">Languages</h2>
              <p className="mt-2 text-[15px] text-muted">
                {a.languages.join(", ")}
              </p>
            </div>
          )}

          {/* Florida Bar advertising rules require context for any past
              results claim, so it travels with the bio that makes it. */}
          {(a.bioLong ?? []).some((t) =>
            /recovered|millions|thousands of contested/i.test(t)
          ) && (
            <p className="frame bg-card p-4 text-[12.5px] leading-relaxed text-muted">
              <strong className="text-ink">
                Prior results do not guarantee a similar outcome.
              </strong>{" "}
              Past case results depend on the specific facts of each matter and
              are not a prediction about yours.
            </p>
          )}

          {a.community.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold">Community</h2>
              <ul className="mt-3 space-y-1.5 text-[15px] text-muted">
                {a.community.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {posts.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold">Their writing</h2>
              <ul className="mt-3 space-y-2">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/news/${p.slug}`}
                      className="flex items-start gap-2 text-[15px] font-medium hover:text-ink-3"
                    >
                      <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 text-brass" />
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </FirmPage>
  );
}
