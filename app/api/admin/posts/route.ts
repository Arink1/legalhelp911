import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Minimal draft-review API (no UI). Authenticated with the same CRON_SECRET.
//
//   List drafts:   GET  /api/admin/posts
//   Publish one:   POST /api/admin/posts  {"slug": "...", "action": "publish"}
//   Discard one:   POST /api/admin/posts  {"slug": "...", "action": "discard"}

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }
  const { data, error } = await supabase
    .from("lh911_posts")
    .select("slug, title, excerpt, category, created_at, published")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 });
  }
  return NextResponse.json({ posts: data });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  let body: { slug?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const slug = String(body.slug ?? "").trim();
  const action = String(body.action ?? "").trim();
  if (!slug || !["publish", "discard"].includes(action)) {
    return NextResponse.json(
      { error: 'Provide "slug" and an "action" of "publish" or "discard".' },
      { status: 400 }
    );
  }

  const result =
    action === "publish"
      ? await supabase
          .from("lh911_posts")
          .update({ published: true, published_at: new Date().toISOString() })
          .eq("slug", slug)
      : await supabase.from("lh911_posts").delete().eq("slug", slug).eq("published", false);

  if (result.error) {
    return NextResponse.json({ error: `Failed to ${action} the post.` }, { status: 500 });
  }
  return NextResponse.json({ ok: true, slug, action });
}
