import { NextRequest, NextResponse } from "next/server";
import { generateArticleDraft } from "@/lib/generateArticle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Vercel cron sends Authorization: Bearer <CRON_SECRET> automatically when
// the CRON_SECRET env var is set. The same secret allows manual triggers.
function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function handle(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await generateArticleDraft();
    return NextResponse.json({
      ok: true,
      status: result.published ? "published" : "draft",
      ...result,
    });
  } catch (err) {
    console.error("generate-article error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed." },
      { status: 500 }
    );
  }
}

export const GET = handle;
export const POST = handle;
