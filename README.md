# LegalHelp911

Legal lead generation site for legalhelp911.com. Next.js frontend, Python
serverless backend, leads stored in Supabase. Deploys as a single Vercel
project.

## Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS v4. Two pages: home
  (`app/page.tsx`) with call CTA + intake form, and `/thank-you`.
- **Backend**: `api/lead.py`, a Python serverless function Vercel deploys
  automatically alongside Next.js (root `api/` directory, stdlib only, no
  requirements.txt). Validates the lead, blocks honeypot bots, inserts into
  Supabase via the REST API with the service role key.
- **Database**: Supabase Postgres, `lh911_leads` table with RLS enabled
  (`supabase/schema.sql`).

## Design system (redesign, 2026-09-14)

The site follows the `design_handoff_legalhelp911` spec: cream canvas
(`#F3F0EE`), ink CTAs, one accent orange used only for indicator dots, Sofia
Sans at body weight 450, radii 20 / 28 / 40 / 999px. Tokens live in
`app/globals.css` (`@theme`), along with the `.btn`, `.chip`, `.card`,
`.panel`, `.field`, `.eyebrow` and type-scale classes. Legacy token names
(`paper`, `card`, `brass`, `signal`) are aliased to the new palette so pages
outside the redesign (news, about, results, bios, es) stay on-brand.

Redesigned pages: `/` (hero mosaic, stats, steps, practice accordion, FAQ),
`/practice`, `/attorneys`, `/contact` (inline success state). Shared chrome:
`SiteNav` (urgency strip + sticky pill), `Footer`, `NewsletterSignup` modal.

**Newsletter sign-ups** post to `app/api/newsletter/route.ts`, which writes
to `lh911_subscribers`. Run the new block at the bottom of
`supabase/schema.sql` in the Supabase SQL editor once, or the modal will
report an error on submit.

## Current state (as of 2026-08-31)

Live at https://legalhelp911.vercel.app and **the lead form saves to
Supabase**, verified end to end from the live site.

- **Supabase project**: `<project-ref>` (`LegalHelp911`, East US
  N. Virginia). Its own dedicated project, fully separated from OnlyDials
  and ArinHealthAgent as of 2026-08-31. The old `lh911_` tables have been
  dropped from the shared project.
- **Tables**: `lh911_leads`, `lh911_posts`. RLS on with no policies, and
  only the secret/`service_role` key holds grants. Verified: the
  publishable (browser) key gets HTTP 401 `42501 permission denied` on both
  read and insert against `lh911_leads`.
- **Vercel env vars set (Production)**: `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `CRON_SECRET`.
  The generated cron secret is in `.cron-secret.txt` (gitignored).

Still to do:

1. **Phone number**: set to (954) 444-6209 in `lib/site.ts` on 2026-09-13.
2. **Domain**: add legalhelp911.com in Vercel > Domains and point DNS at it.
3. **Anthropic credits**: article generation returns "credit balance is too
   low" until the Anthropic account is topped up. The wiring is correct.
4. **Lead notifications**: nothing emails or texts you when a lead lands.
   Leads sit in the table until you look.

## Database separation (done)

This site used to share a Supabase project with OnlyDials and
ArinHealthAgent. It now has its own project, `<project-ref>`. The
scripts that performed the move are kept for reference:

- `scripts/switch-supabase.js` applies the schema, sets grants, revokes
  anon, round-trips a real insert, and repoints the Vercel env vars. Reads
  `.env.newsupabase`; `NEW_DATABASE_URL` is optional (without it, run
  `supabase/schema.sql` in the dashboard SQL editor first).
- `scripts/drop-old-shared-tables.js` removed the `lh911_` tables from the
  shared project. It only ever touches `lh911_*` and refuses non-empty
  tables. Already run, so it is now a no-op.

## Viewing leads

Supabase dashboard > Table Editor > `lh911_leads`, newest first. Each row
carries the TCPA consent flag and a timestamp, which is your proof of
consent, plus a `status` column (`new` / `contacted` / `sold` / `dead`).

## Setup from scratch (new environment)

1. **Supabase**: create a project (or reuse one), then run
   `supabase/schema.sql` in the SQL editor. It is idempotent and additive,
   so it is safe to re-run and safe against a shared project.
2. **Vercel**: import this repo (framework preset: Next.js) and add the env
   vars from `.env.example`.
3. **Domain** as above.

## Local development

```bash
npm install
npm run dev
```

Note: `next dev` serves the frontend only. The Python function needs the
Vercel runtime, so to test the full form-to-database flow locally run
`vercel dev` (with a `.env` file based on `.env.example`) or submit on a
preview deploy.

## Lead flow

Form (`components/LeadForm.tsx`) posts JSON to `/api/lead` with a TCPA
consent flag and a hidden honeypot field. The Python function rejects bad
input with a friendly message, silently drops honeypot submissions, and
writes accepted leads to `public.lh911_leads` with `status = 'new'`.

All tables are prefixed `lh911_`, a holdover from when this shared a
project with other apps. Harmless to keep, and it makes the origin of any
table obvious.

## Legal News section (SEO + retention)

Mirrors the ArinHealthAgent news system:

- `/news` and `/news/[slug]` render articles from the `lh911_posts` Supabase
  table merged with 3 bundled seed articles in `lib/posts.ts` (so the
  section works before Supabase is configured). The homepage shows the
  latest 3, and `app/sitemap.ts` lists every article for search engines.
- A Vercel cron (`vercel.json`, Mondays 14:00 UTC) hits
  `/api/cron/generate-article`, which uses the Claude API (`claude-opus-5`,
  see `lib/generateArticle.ts`) to draft one new evergreen article. Prompts
  enforce YMYL rules: no invented statistics or deadlines, no legal advice,
  no em dashes, soft call-to-action.
- Drafts land unpublished. Review flow (same `CRON_SECRET` bearer token):

  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" https://legalhelp911.com/api/admin/posts
  ```

  Publish or discard by slug:

  ```bash
  curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" -d '{"slug":"the-slug","action":"publish"}' https://legalhelp911.com/api/admin/posts
  ```

  Set `AUTO_PUBLISH_ARTICLES=true` to skip review entirely.
- Env vars: `ANTHROPIC_API_KEY`, `CRON_SECRET` (plus the Supabase pair).

## Compliance notes

- Footer carries attorney advertising / not-a-law-firm disclaimers. Have a
  lawyer review the exact wording for your states before running paid
  traffic.
- The consent checkbox text is written for TCPA; keep proof of consent
  (already stored per lead with a timestamp).
- Add privacy policy and terms pages before running Google/Meta ads; both
  platforms require them for lead forms.
