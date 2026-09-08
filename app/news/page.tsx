import type { Metadata } from "next";
import { TopBar, Footer } from "@/components/SiteChrome";
import NewsIndexView from "@/components/NewsIndexView";
import { getPosts } from "@/lib/posts";
import { FIRM_NAME } from "@/lib/site";

export const revalidate = 600;

export const metadata: Metadata = {
  title: `News & insights | ${FIRM_NAME}`,
  description:
    "Plain answers to the questions we get asked every week, plus case results, firm news, and open roles.",
  alternates: { canonical: "/news" },
};

export default async function NewsIndex({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const all = await getPosts();
  const query = (q ?? "").trim().toLowerCase();
  const posts = query
    ? all.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query)
      )
    : all;

  return (
    <>
      <TopBar />
      <main>
        <NewsIndexView
          posts={posts}
          allCount={all.length}
          query={q ?? ""}
          page={Math.max(1, Number(page) || 1)}
        />
      </main>
      <Footer />
    </>
  );
}
