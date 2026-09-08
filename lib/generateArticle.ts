import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin, getPosts } from "./posts";

// AI article drafting for the Legal News section. Runs from the weekly cron
// route (and can be triggered manually). Drafts land unpublished for review
// unless AUTO_PUBLISH_ARTICLES=true.

const MODEL = process.env.ARTICLE_MODEL || "claude-opus-5";

const CATEGORIES = [
  "Car accidents",
  "Truck accidents",
  "Work injuries",
  "Slip and fall",
  "Medical malpractice",
  "Insurance claims",
  "Your case",
  "Your rights",
] as const;

const TOPICS = [
  "What a statute of limitations is and why waiting can end a case",
  "How pain and suffering is generally thought about in injury claims",
  "What to bring to your first meeting with a personal injury lawyer",
  "How fault is determined after a car accident",
  "What to do if you are hurt at work and unsure about workers compensation",
  "Why you should see a doctor even after a minor collision",
  "How social media posts can hurt an injury claim",
  "What happens if the driver who hit you has no insurance",
  "Slip and fall claims: what property owners are generally responsible for",
  "How long an injury case typically takes and what affects it",
  "What a demand letter is and where it fits in a claim",
  "Questions to ask before hiring an injury attorney",
];

const ARTICLE_SYSTEM = `You are a writer for the Trumbach Firm (LegalHelp911.com), a multi-practice regional law firm with 38 years in practice. The firm handles injury and accidents, criminal defense, family and divorce, immigration, employment, wills and estates, and business matters. You write clear, calm, trustworthy educational articles for everyday people facing a legal problem for the first time.

You will be given the list of articles already on the site and a list of candidate topics. Choose ONE topic that is NOT already covered by an existing article, even under different wording. If every candidate topic is covered, invent a fresh evergreen topic that fits the categories. Then write an original, genuinely helpful, evergreen article on it.

CRITICAL accuracy and compliance rules (legal content is a "Your Money or Your Life" topic):
- This is general legal information, NEVER legal advice for a specific person. Do not tell the reader what the law says in their specific state.
- Do NOT invent statistics, dollar amounts, settlement figures, percentages, deadlines, case names, or laws. Where a deadline or rule varies by state, say that it varies and that a lawyer can confirm what applies.
- Do NOT guarantee outcomes or imply every case wins.
- The ONLY trust signals you may cite are 38 years in practice and free consultations. NEVER mention settlement amounts, award badges, review counts, or "no fee unless you win".
- Use hedged, accurate language: "generally", "often", "in many states", "may".
- It is fine to explain how the process generally works and what questions to ask.

Style rules:
- Plain English, no legalese. Short paragraphs. Calm and reassuring, never alarmist or salesy.
- Do NOT use em dashes. Use commas, periods, or "and" instead.
- Use Markdown for the body: a short intro paragraph, two to four "## " section headings, and at most one short bullet list. Do NOT include an H1 title in the body (the site renders the title separately).
- About 600 to 900 words.
- End with a short, soft invitation to call the firm for a free consultation, with no pressure.

This is a DRAFT that will be reviewed by a person before publishing.`;

const ARTICLE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    topic: { type: "string", description: "The chosen topic as a short phrase" },
    title: { type: "string", description: "Specific, non-clickbait headline. No em dashes." },
    slug: { type: "string", description: "kebab-case slug derived from the title" },
    excerpt: { type: "string", description: "One or two sentence summary. No em dashes." },
    category: { type: "string", enum: CATEGORIES as unknown as string[] },
    read_minutes: { type: "integer", description: "Estimated reading time, 3 to 7" },
    content: { type: "string", description: "Markdown body, no H1 title, no em dashes" },
  },
  required: ["topic", "title", "slug", "excerpt", "category", "read_minutes", "content"],
} as const;

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "article"
  );
}

function normalizeTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function textBlockOf(resp: Anthropic.Message): string {
  if (resp.stop_reason === "refusal") {
    throw new Error("The model declined to generate this article. Try again.");
  }
  const block = resp.content.find((b): b is Anthropic.TextBlock => b.type === "text");
  if (!block) throw new Error("The model returned no content.");
  return block.text;
}

export async function generateArticleDraft(): Promise<{
  slug: string;
  title: string;
  published: boolean;
}> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set.");
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase environment variables are not set.");

  // Everything already on the site, drafts included, so pending drafts
  // cannot be duplicated either. getPosts() covers seeds + published rows;
  // add unpublished drafts on top.
  const publishedTitles = (await getPosts()).map((p) => p.title);
  const { data: draftRows } = await supabase
    .from("lh911_posts")
    .select("title")
    .eq("published", false)
    .limit(100);
  const existingTitles = [...publishedTitles, ...(draftRows ?? []).map((r) => String(r.title))];
  const existingSet = new Set(existingTitles.map(normalizeTitle));

  const baseContent = [
    "Articles already on the site (drafts and published). Do NOT write about a topic any of these already covers, even under different wording:",
    existingTitles.length ? existingTitles.map((t) => `- ${t}`).join("\n") : "- (none yet)",
    "",
    "Candidate topics:",
    TOPICS.map((t) => `- ${t}`).join("\n"),
    "",
    "Pick one uncovered topic (or invent a fresh one if all are covered) and write today's article.",
  ].join("\n");

  const client = new Anthropic();
  let duplicateOf: string | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const content = duplicateOf
      ? `${baseContent}\n\nNote: "${duplicateOf}" is already covered on the site. Choose a clearly different topic.`
      : baseContent;

    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 12000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: ARTICLE_SCHEMA },
      },
      system: ARTICLE_SYSTEM,
      messages: [{ role: "user", content }],
    });

    const article = JSON.parse(textBlockOf(resp)) as {
      topic: string;
      title: string;
      slug: string;
      excerpt: string;
      category: string;
      read_minutes: number;
      content: string;
    };

    if (existingSet.has(normalizeTitle(article.title))) {
      duplicateOf = article.title;
      continue;
    }

    let slug = slugify(article.slug || article.title);
    const { data: clash } = await supabase
      .from("lh911_posts")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    const published = process.env.AUTO_PUBLISH_ARTICLES === "true";
    const { error } = await supabase.from("lh911_posts").insert({
      slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      read_minutes: Math.min(9, Math.max(2, Number(article.read_minutes) || 4)),
      published,
    });
    if (error) {
      console.error("Article draft insert error:", error);
      throw new Error("Failed to save the draft.");
    }

    return { slug, title: article.title, published };
  }

  throw new Error(
    "Every topic the generator tried is already covered. Discard stale drafts or add candidate topics, then try again."
  );
}
