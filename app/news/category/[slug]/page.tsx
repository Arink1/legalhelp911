import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar, Footer } from "@/components/SiteChrome";
import NewsIndexView from "@/components/NewsIndexView";
import { getPosts, NEWS_CATEGORIES } from "@/lib/posts";
import { FIRM_NAME } from "@/lib/site";

export const revalidate = 600;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NEWS_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = NEWS_CATEGORIES.find((x) => x.slug === slug);
  if (!c) return { title: "Not found" };
  return {
    title: `${c.label} | ${FIRM_NAME}`,
    description: `${c.label} from ${FIRM_NAME}.`,
    alternates: { canonical: `/news/category/${c.slug}` },
  };
}

export default async function NewsCategory({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = NEWS_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const all = await getPosts();
  const posts = all.filter((p) => (p.categorySlug ?? "explainers") === slug);

  return (
    <>
      <TopBar />
      <main>
        <NewsIndexView
          posts={posts}
          allCount={all.length}
          activeCategory={slug}
          page={Math.max(1, Number(page) || 1)}
          title={category.label}
          intro={`Every ${category.label.toLowerCase()} post in one place.`}
        />
      </main>
      <Footer />
    </>
  );
}
