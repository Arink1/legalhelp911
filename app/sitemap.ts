import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { PRACTICE_AREAS, ATTORNEYS } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://legalhelp911.com";
  const posts = await getPosts();

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/news`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/practice`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/attorneys`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/results`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/es`, changeFrequency: "monthly", priority: 0.8 },
    ...ATTORNEYS.map((a) => ({
      url: `${base}/attorneys/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { url: `${base}/qualify`, changeFrequency: "monthly", priority: 0.7 },
    ...PRACTICE_AREAS.map((p) => ({
      url: `${base}/practice/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...posts.map((post) => ({
      url: `${base}/news/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
