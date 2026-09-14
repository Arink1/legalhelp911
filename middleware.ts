import { NextRequest, NextResponse } from "next/server";

// Temporary site-wide gate while the firm reviews the build. Set SITE_PASSWORD
// in Vercel (Production) to enable; remove the variable to open the site.
// Any username is accepted, only the password is checked.
const REALM = "LegalHelp911 preview";

export function middleware(req: NextRequest) {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) return NextResponse.next();

  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (password === expected) return NextResponse.next();
    } catch {
      // fall through to the challenge
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  // Gate pages only. API routes keep their own auth (CRON_SECRET bearer, the
  // lead endpoint's spam checks) and static assets are harmless on their own.
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|media/).*)"],
};
