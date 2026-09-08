import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { TopBar, Footer } from "@/components/SiteChrome";
import RailForm from "@/components/RailForm";
import { ChevronRightIcon } from "@/components/Icons";
import {
  getPostBySlug,
  getPosts,
  formatDate,
  NEWS_CATEGORIES,
} from "@/lib/posts";
import {
  FIRM_NAME,
  YEARS_IN_PRACTICE,
  PRACTICE_AREAS,
  getAttorney,
} from "@/lib/site";

export const revalidate = 600;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: `${post.title} | ${FIRM_NAME}`,
    description: post.answer ?? post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const reviewer = post.reviewedBy ? getAttorney(post.reviewedBy) : undefined;
  const categoryLabel =
    NEWS_CATEGORIES.find((c) => c.slug === post.categorySlug)?.label ??
    "Explainer";
  const related = (await getPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);
  const practice =
    PRACTICE_AREAS.find((p) =>
      post.category.toLowerCase().includes(p.title.split(" ")[0].toLowerCase())
    ) ?? PRACTICE_AREAS[0];

  const headings = Array.from(post.content.matchAll(/^##\s+(.+)$/gm)).map((m) =>
    m[1].trim()
  );

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.answer ?? post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": reviewer ? "Person" : "Organization",
      name: reviewer ? reviewer.name : FIRM_NAME,
    },
    publisher: { "@type": "Organization", name: FIRM_NAME },
    mainEntityOfPage: `https://legalhelp911.com/news/${post.slug}`,
  };

  // The FAQ block is the SEO payload, so it ships with FAQPage schema.
  const faqLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <TopBar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}

        <nav aria-label="Breadcrumb" className="bg-paper">
          <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-4 pt-5 text-[11.5px] text-muted sm:px-6">
            <li>
              <Link href="/news" className="hover:text-ink">
                News
              </Link>
            </li>
            <ChevronRightIcon className="h-3 w-3 opacity-60" />
            <li>
              <Link
                href={`/news/category/${post.categorySlug ?? "explainers"}`}
                className="hover:text-ink"
              >
                {categoryLabel}
              </Link>
            </li>
            <ChevronRightIcon className="h-3 w-3 opacity-60" />
            <li className="text-ink">{post.category}</li>
          </ol>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <article>
            <span className="inline-block rounded-full bg-brass-soft px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em]">
              {categoryLabel}
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-[38px]">
              {post.title}
            </h1>

            <p className="mt-4 text-[12.5px] text-muted">
              {reviewer ? (
                <>
                  Reviewed by{" "}
                  <Link
                    href={`/attorneys/${reviewer.slug}`}
                    className="font-semibold text-ink underline underline-offset-2"
                  >
                    {reviewer.name}
                  </Link>
                  , {YEARS_IN_PRACTICE} years
                </>
              ) : (
                <>Reviewed by {FIRM_NAME}</>
              )}{" "}
              &middot; updated {formatDate(post.publishedAt)} &middot;{" "}
              {post.readMinutes} min read
            </p>

            {/* Answer-first paragraph, above everything else */}
            {post.answer && (
              <p className="mt-6 border-l-4 border-brass bg-card py-4 pl-5 pr-4 font-display text-lg font-semibold leading-snug">
                {post.answer}
              </p>
            )}

            <div className="article-body mt-7">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <aside className="frame mt-8 bg-card p-5">
              <p className="kicker">The one thing to remember</p>
              <p className="mt-2 text-[15px] font-semibold leading-snug">
                Deadlines and rules vary by state, and the exceptions are where
                cases turn. One free call is cheaper than guessing.
              </p>
            </aside>

            {post.faq && post.faq.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em]">
                  Common questions
                </h2>
                <dl className="mt-5 divide-y divide-line border-y border-line">
                  {post.faq.map((f) => (
                    <div key={f.q} className="py-4">
                      <dt className="font-display text-base font-bold">{f.q}</dt>
                      <dd className="mt-1.5 text-[15px] leading-relaxed text-muted">
                        {f.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <p className="mt-8 text-[11.5px] leading-relaxed text-muted">
              ATTORNEY ADVERTISING. This article is general information, not
              legal advice, and reading it does not create an attorney-client
              relationship. Laws and deadlines vary by state.
            </p>

            {related.length > 0 && (
              <section className="mt-10">
                <p className="kicker mb-3">Related explainers</p>
                <ul className="divide-y divide-line border-y border-line">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/news/${r.slug}`}
                        className="flex items-center justify-between gap-3 py-3.5 text-[15px] font-medium hover:text-ink-3"
                      >
                        {r.title}
                        <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          {/* Right rail: sticky short form, on-this-page, related practice */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <RailForm practiceSlug={practice.slug} />

            {headings.length > 0 && (
              <nav className="frame bg-card p-4" aria-label="On this page">
                <p className="kicker mb-2.5">On this page</p>
                <ul className="space-y-1.5 text-[13px]">
                  {headings.map((h) => (
                    <li key={h}>
                      <a
                        href={`#${h.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        className="text-muted hover:text-ink"
                      >
                        {h}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <Link
              href={`/practice/${practice.slug}`}
              className="frame group block bg-card p-4 transition hover:border-brass"
            >
              <p className="kicker">Related practice</p>
              <p className="mt-1.5 flex items-center gap-1 font-display text-base font-bold group-hover:text-ink-3">
                {practice.title}
                <ChevronRightIcon className="h-4 w-4" />
              </p>
              <p className="mt-1 text-[12.5px] text-muted">
                {practice.searchedFor}
              </p>
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
