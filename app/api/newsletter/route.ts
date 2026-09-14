import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * POST /api/newsletter
 * Stores an email address in `lh911_subscribers` through the Supabase REST
 * API with the service role key, the same way `api/lead.py` stores leads.
 * Duplicate addresses are ignored rather than reported, so the form never
 * reveals whether an address is already on the list.
 */
export async function POST(req: Request) {
  let payload: { email?: unknown; company?: unknown; source?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: tell the bot it worked, store nothing.
  if (typeof payload.company === "string" && payload.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase().slice(0, 200) : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const source =
    typeof payload.source === "string" ? payload.source.slice(0, 100) : "legalhelp911.com";

  const base = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!base || !key) {
    return NextResponse.json(
      { error: "Sign-up is not available right now. Please try again later." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${base}/rest/v1/lh911_subscribers?on_conflict=email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal,resolution=ignore-duplicates",
      },
      body: JSON.stringify({ email, source }),
    });
    if (!res.ok) {
      throw new Error(`Supabase insert failed: ${res.status}`);
    }
  } catch {
    return NextResponse.json(
      { error: "We could not sign you up. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
