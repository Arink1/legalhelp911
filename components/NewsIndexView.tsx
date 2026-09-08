import Link from "next/link";
import PhotoSlot from "@/components/PhotoSlot";
import { PhoneIcon, ChevronRightIcon } from "@/components/Icons";
import { formatDate, NEWS_CATEGORIES, type Post } from "@/lib/posts";
import { PHONE_DISPLAY, PHONE_TEL, PRACTICE_AREAS } from "@/lib/site";

const PAGE_SIZE = 9;

function labelFor(slug?: string) {
  return NEWS_CATEGORIES.find((c) => c.slug === slug)?.label ?? "Explainer";
}

/**
 * News index (screen 3b). Sticky category strip whose categories are real
 * URLs, a search box, an editorially featured row of three, a practice-area
 * cross-link block that feeds the money pages, then a dated list with
 * "Load more" pagination rather than infinite scroll so crawlers can follow
 * it.
 */
export default function NewsIndexView({
  posts,
  allCount,
  activeCategory,
  query = "",
  page = 1,
  title = "News & insights",
  intro = "Plain answers to the questions we get asked every week.",
}: {
  posts: Post[];
  allCount: number;
  activeCategory?: string;
  query?: string;
  page?: number;
  title?: string;
  intro?: string;
}) {
  const shown = posts.slice(0, PAGE_SIZE * page);
  const featured = shown.slice(0, 3);
  const rest = shown.slice(3);
  const hasMore = posts.length > shown.length;
  const basePath = activeCategory ? `/news/category/${activeCategory}` : "/news";

  return (
    <>
      {/* Utility page: H1 and one line of purpose, no hero image */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] text-muted">{intro}</p>
        </div>
      </section>

      {/* Category strip, sticky on scroll */}
      <div className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <nav aria-label="Article categories" className="strip flex-1">
            <Link
              href="/news"
              aria-current={!activeCategory ? "page" : undefined}
              className={`rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold transition ${
                !activeCategory ? "bg-ink text-white" : "hover:bg-ink hover:text-white"
              }`}
            >
              All
            </Link>
            {NEWS_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/news/category/${c.slug}`}
                aria-current={activeCategory === c.slug ? "page" : undefined}
                className={`rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold transition ${
                  activeCategory === c.slug
                    ? "bg-ink text-white"
                    : "hover:bg-ink hover:text-white"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </nav>
          <form action="/news" className="shrink-0">
            <label htmlFor="q" className="sr-only">
              Search articles
            </label>
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder="Search articles"
              className="field-pill min-h-[38px] w-[190px] py-1.5 text-[12.5px]"
            />
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {shown.length === 0 ? (
          <p className="text-[15px] text-muted">
            Nothing here yet.{" "}
            <Link href="/news" className="underline underline-offset-2">
              Show everything
            </Link>
            .
          </p>
        ) : (
          <>
            <ul className="grid gap-5 sm:grid-cols-3">
              {featured.map((p) => (
                <li key={p.slug}>
                  <Link href={`/news/${p.slug}`} className="group block">
                    <PhotoSlot
                      label="Article image"
                      src="/media/courtroom-desk.webp"
                      className="aspect-[16/10] w-full"
                    />
                    <span className="mt-3 inline-block rounded-full bg-brass-soft px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em]">
                      {labelFor(p.categorySlug)}
                    </span>
                    <h2 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-ink-3">
                      {p.title}
                    </h2>
                    <p className="mt-1.5 text-[12px] text-muted">
                      {formatDate(p.publishedAt)} &middot; {p.readMinutes} min read
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cross-link block feeds the money pages */}
            <div className="mt-9 rounded-[14px] bg-card p-5">
              <p className="kicker mb-3">Jump to a practice area</p>
              <ul className="flex flex-wrap gap-2">
                {PRACTICE_AREAS.slice(0, 6).map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/practice/${p.slug}`}
                      className="flex items-center gap-1 rounded-full border-[1.5px] border-ink px-3 py-1.5 text-[11.5px] font-semibold transition hover:bg-ink hover:text-white"
                    >
                      {p.title}
                      <ChevronRightIcon className="h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {rest.length > 0 && (
              <ul className="mt-9 divide-y divide-line border-y border-line">
                {rest.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/news/${p.slug}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <PhotoSlot
                        label="Thumbnail"
                        src="/media/courtroom-scales.webp"
                        className="hidden h-16 w-24 shrink-0 sm:block"
                      />
                      <span className="flex-1">
                        <span className="block font-display text-base font-bold group-hover:text-ink-3">
                          {p.title}
                        </span>
                        <span className="mt-1 block text-[12px] text-muted">
                          {labelFor(p.categorySlug)} &middot;{" "}
                          {formatDate(p.publishedAt)}
                        </span>
                      </span>
                      <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {hasMore && (
              <div className="mt-8 text-center">
                <Link
                  href={`${basePath}?page=${page + 1}`}
                  className="pill pill-outline inline-flex px-6"
                >
                  Load more
                </Link>
              </div>
            )}
          </>
        )}
        <p className="mt-6 text-[11.5px] text-muted">
          {shown.length} of {allCount} articles
        </p>
      </div>

      {/* Closing CTA band */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
          <h2 className="mx-auto max-w-xl font-display text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
            Reading about it is not the same as asking about it.
          </h2>
          <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Link href="/contact" className="pill pill-primary w-full sm:w-auto sm:px-7">
              Free case review
            </Link>
            <a
              href={PHONE_TEL}
              data-analytics="call_tap_news"
              className="pill w-full border-[1.75px] border-white/40 text-white hover:border-white sm:w-auto sm:px-7"
            >
              <PhoneIcon className="h-4 w-4" />
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
