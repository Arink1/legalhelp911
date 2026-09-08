import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Category slugs are real URLs so a practice page can link an explainer cluster. */
export const NEWS_CATEGORIES = [
  { slug: "explainers", label: "Explainers" },
  { slug: "case-results", label: "Case results" },
  { slug: "firm-news", label: "Firm news" },
  { slug: "community", label: "Community" },
] as const;

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  category: string;
  readMinutes: number;
  publishedAt: string; // ISO date
  /** One of NEWS_CATEGORIES slugs. */
  categorySlug?: string;
  /** Attorney slug for the reviewed-by byline. */
  reviewedBy?: string;
  /** Answer-first paragraph, the featured-snippet target. */
  answer?: string;
  /** FAQ pairs rendered with FAQPage schema. */
  faq?: { q: string; a: string }[];
};

// Server-side Supabase client (service role). Never import this from a
// client component. Returns null when env vars are not configured, in
// which case the site falls back to the bundled seed articles below.
let cached: SupabaseClient | null | undefined;
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cached = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cached;
}

/**
 * Bundled starter articles so the Legal News section has content
 * immediately, before Supabase is configured and before the generator has
 * run. Once rows exist in the `lh911_posts` table, they merge in on top
 * (deduped by slug, database wins).
 */
export const SEED_POSTS: Post[] = [
  {
    slug: "first-72-hours-after-a-car-accident",
    title: "The first 72 hours after a car accident: what to do and what to avoid",
    excerpt:
      "The steps you take in the first three days shape your claim more than almost anything else. Here is a clear checklist.",
    category: "Car accidents",
    categorySlug: "explainers",
    reviewedBy: "attorney-one",
    answer:
      "In most states you have a limited window, often one to three years from the date of the crash, to file a personal injury lawsuit. The exact deadline depends on your state and on who you are suing, so confirm yours with a lawyer before you rely on any number.",
    faq: [
      {
        q: "Does the deadline change if the other driver was a government employee?",
        a: "Often yes. Claims against public bodies usually carry much shorter notice periods, sometimes only a few months, and they can require a formal notice before any lawsuit. Ask early if a city, county, or state vehicle was involved.",
      },
      {
        q: "What if I was hurt but did not realise it until later?",
        a: "Many states delay the start of the clock until the injury was discovered or reasonably should have been. This is fact specific and is one of the more commonly disputed points, so do not assume it applies without advice.",
      },
      {
        q: "Does talking to the insurance company extend my deadline?",
        a: "No. Negotiations do not pause the filing deadline. People sometimes negotiate right past it and lose the claim entirely.",
      },
    ],
    readMinutes: 5,
    publishedAt: "2026-08-10",
    content: `The days right after a crash are confusing, and that is exactly when the most important decisions happen. You do not need to do everything perfectly. You just need to avoid a few common mistakes.

## Get checked out, even if you feel fine

Adrenaline hides injuries. Soft tissue damage, concussions, and back injuries often show up days later. Seeing a doctor right away protects your health first, and it also creates a record that connects your injuries to the crash. A long gap between the accident and your first visit is one of the first things an insurance company will point to.

## Document everything while it is fresh

If you have not already, write down what happened in your own words. Save photos of the vehicles, the scene, and your injuries. Keep the names and numbers of any witnesses. Small details fade fast, and they are hard to recover later.

## Be careful with the other driver's insurance company

An adjuster may call quickly and sound friendly. Remember that their job is to close your claim for as little as possible. You are generally not required to give a recorded statement to the other driver's insurer, and it is usually wise to talk to a lawyer before you do.

## Do not accept a fast settlement before you know what your case involves

Early offers often come before you know the full extent of your injuries or your time away from work. Once you sign a release, the claim is over, even if your medical bills keep growing.

If you were hurt and are not sure what your next step should be, a free case review costs nothing and commits you to nothing. Call any time and get answers from people who handle these cases every day.`,
  },
  {
    slug: "how-contingency-fees-work",
    title: "How legal fees usually work, in plain English",
    excerpt:
      "Hourly, flat fee, contingency, retainer. Here is what each one actually means before you sign anything.",
    category: "Your case",
    categorySlug: "explainers",
    reviewedBy: "attorney-three",
    answer:
      "Legal work is billed in four common ways: hourly, flat fee, contingency, and retainer. Which one applies depends on the kind of matter, and the arrangement should be written down before you sign anything.",
    readMinutes: 4,
    publishedAt: "2026-07-28",
    content: `Most people never call a lawyer because they assume they cannot afford one. Before you decide that, it helps to know that legal work is not billed just one way.

## The four arrangements you will actually see

- **Hourly.** You pay for time spent, usually billed in fractions of an hour. Common in family, business, and employment matters.
- **Flat fee.** One agreed price for a defined piece of work, like a will or a simple filing. You know the number up front.
- **Contingency.** The fee is a percentage of money recovered, so it only applies where money is being recovered. Availability and percentages vary by firm, matter, and state.
- **Retainer.** Money paid up front that the firm bills against. It is a deposit, not a separate fee, and unused amounts are generally returned.

## What to ask before you sign anything

Every fee agreement is a contract, and terms vary. Good questions:

- Which arrangement applies to my matter, and why that one?
- What is not covered by the fee, such as court costs and filing fees?
- What happens to costs if the matter does not succeed?
- Will I approve major decisions before they are made?

A trustworthy attorney will welcome these questions and answer them plainly, in writing.

## The consultation itself is separate

Whatever the fee arrangement ends up being, finding out where you stand should not cost you anything. Ask about fees on that first call. If the answer is vague, keep asking until it is not.

If you are not sure whether your situation is worth pursuing, that is exactly what a free consultation is for. Call and get a straight answer before you decide anything.`,
  },
  {
    slug: "insurance-adjuster-calls-what-to-say",
    title: "Why the insurance adjuster calls so fast, and what to say when they do",
    excerpt:
      "That quick, friendly phone call is not a courtesy. Here is what adjusters are trained to do and how to protect your claim.",
    category: "Insurance claims",
    categorySlug: "explainers",
    reviewedBy: "attorney-one",
    answer:
      "You are generally not required to give a recorded statement to the other driver's insurance company. Being polite, confirming the basic facts, and saying you will follow up after speaking with a lawyer is enough.",
    readMinutes: 4,
    publishedAt: "2026-07-15",
    content: `After an accident, the other side's insurance company often calls within a day or two. The adjuster is polite, sympathetic, and seems eager to help. It is worth understanding what that call is really for.

## The adjuster works for the insurance company

Adjusters are trained negotiators. Their performance is measured by how efficiently they resolve claims, which usually means for as little money as possible. Nothing about that makes them bad people. It just means their interests are not your interests.

## Common tactics to watch for

- Asking for a recorded statement early, while you are still shaken and before you know the extent of your injuries
- Asking open questions like "how are you feeling?" hoping you say "fine" on the record
- Offering a quick settlement before your medical picture is clear
- Requesting broad access to your medical history, not just records related to the crash

## What you can safely do

Be polite, confirm basic facts like the date and location of the accident, and take down the adjuster's name and contact information. You generally do not have to give a recorded statement to the other driver's insurer, agree to a settlement, or sign anything on the spot. It is reasonable to say you will follow up after you have spoken with an attorney.

A short call with a lawyer before you talk numbers can change the entire course of a claim. Consultations are free and carry no obligation, so you can get real answers before the insurance company gets yours.`,
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    category: row.category ?? "Legal news",
    readMinutes: row.read_minutes ?? 4,
    publishedAt: row.published_at ?? row.created_at,
    categorySlug: row.category_slug ?? "explainers",
  };
}

/**
 * All published posts, newest first: published Supabase rows merged over the
 * bundled seed articles (deduped by slug, database wins), so the section is
 * never empty and publishing new drafts adds to the site automatically.
 */
export async function getPosts(): Promise<Post[]> {
  const bySlug = new Map<string, Post>();
  for (const p of SEED_POSTS) bySlug.set(p.slug, p);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("lh911_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (!error && data) {
        for (const row of data) {
          const p = mapRow(row);
          bySlug.set(p.slug, p);
        }
      }
    } catch {
      // keep seed posts only
    }
  }

  return [...bySlug.values()].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** A single published post by slug, or null. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("lh911_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!error && data) return mapRow(data);
    } catch {
      // fall through to seeds
    }
  }
  return SEED_POSTS.find((p) => p.slug === slug) ?? null;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // Format in UTC so server and client render the same string (avoids
  // React hydration mismatches from timezone differences).
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
