#!/usr/bin/env node
/**
 * Points LegalHelp911 at its own dedicated Supabase project.
 *
 * Usage:
 *   1. Create a new Supabase project in the dashboard.
 *   2. Fill in .env.newsupabase (see .env.newsupabase.example).
 *   3. node scripts/switch-supabase.js
 *
 * What it does, in order, stopping at the first failure:
 *   - refuses to run if the target is the old shared project
 *   - applies supabase/schema.sql (additive, lh911_ tables only)
 *   - grants table privileges to service_role
 *   - round-trips a real insert/read/delete through the REST API, which is
 *     the exact path api/lead.py uses, so a pass means the form will work
 *   - updates the Vercel production env vars
 *
 * It does NOT deploy and does NOT touch the old project. Both are printed
 * as explicit follow-up steps so nothing is dropped before you have
 * verified the new project in production.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { Client } = require("pg");

const ROOT = path.resolve(__dirname, "..");
const CONFIG = path.join(ROOT, ".env.newsupabase");
const SCHEMA = path.join(ROOT, "supabase", "schema.sql");
const OLD_PROJECT_REF = "fnbilqtvzdlucwjvwfnh"; // shared with OnlyDials

const step = (n, msg) => console.log(`\n[${n}] ${msg}`);
const ok = (msg) => console.log(`    ok  ${msg}`);

// Once async work is underway there are open sockets, and process.exit()
// then trips a libuv assertion on Windows. Unwind by throwing instead and
// let Node exit on its own.
class Bail extends Error {}
let asyncStarted = false;
const fail = (msg) => {
  console.error(`\nFAILED: ${msg}`);
  process.exitCode = 1;
  if (asyncStarted) throw new Bail(msg);
  process.exit(1);
};

/* ── config ─────────────────────────────────────────────────────────── */

if (!fs.existsSync(CONFIG)) {
  fail(
    `${path.basename(CONFIG)} not found.\n` +
      `Copy .env.newsupabase.example to .env.newsupabase and fill it in.`
  );
}

const cfg = {};
for (const line of fs.readFileSync(CONFIG, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
  if (m) cfg[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}

for (const key of ["NEW_SUPABASE_URL", "NEW_SUPABASE_SERVICE_ROLE_KEY"]) {
  if (!cfg[key]) fail(`${key} is missing from ${path.basename(CONFIG)}`);
}

// NEW_DATABASE_URL is optional. With it, this script creates the tables
// itself. Without it, you run supabase/schema.sql in the dashboard SQL
// editor and this script verifies the result and flips the env vars, so the
// database password never has to leave the dashboard.
const HAS_DB = Boolean(cfg.NEW_DATABASE_URL);

/* ── guard: never target the old shared project ─────────────────────── */

step(1, "Checking the target is a different project");
for (const [key, val] of Object.entries(cfg)) {
  if (val.includes(OLD_PROJECT_REF)) {
    fail(
      `${key} still points at the shared project (${OLD_PROJECT_REF}).\n` +
        `The whole point of this script is to move off it.`
    );
  }
}
const refMatch = cfg.NEW_SUPABASE_URL.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
if (!refMatch) fail("NEW_SUPABASE_URL should look like https://<ref>.supabase.co");
const newRef = refMatch[1];
if (HAS_DB && !cfg.NEW_DATABASE_URL.includes(newRef)) {
  fail(
    `NEW_DATABASE_URL does not mention ${newRef}. The connection string and ` +
      `the API URL must belong to the same project.`
  );
}
ok(`target project is ${newRef}`);
ok(HAS_DB ? "connection string supplied, will create tables" : "no connection string, expecting schema.sql to be applied already");

/* ── schema ─────────────────────────────────────────────────────────── */

const sql = fs.readFileSync(SCHEMA, "utf8");
const code = sql.replace(/--.*$/gm, "");
if (/\b(drop|truncate|delete\s+from)\b/i.test(code)) {
  fail("schema.sql contains a destructive statement, refusing to run it.");
}
const objects = [
  ...code.matchAll(/\b(?:table|index)\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z0-9_]+)/gi),
]
  .map((m) => m[1].toLowerCase())
  .filter((n) => !["if", "not", "exists"].includes(n));
const stray = [...new Set(objects)].filter((n) => !n.startsWith("lh911_"));
if (stray.length) fail(`schema.sql touches non-lh911_ objects: ${stray.join(", ")}`);

(async () => {
  asyncStarted = true;
  if (!HAS_DB) {
    step(2, "Skipping schema apply (no connection string)");
    ok("assuming supabase/schema.sql was run in the dashboard SQL editor");
    step(3, "Skipping grant check (needs a database connection)");
    ok("schema.sql grants service_role and revokes anon itself");
    await verifyRestAndSetEnv();
    return;
  }

  step(2, "Applying schema to the new project");
  const client = new Client({
    connectionString: cfg.NEW_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(sql);
  ok(`created: ${[...new Set(objects)].filter((o) => !o.endsWith("_idx")).join(", ")}`);

  step(3, "Granting table privileges to service_role");
  // schema.sql already contains these, but a project whose default
  // privileges differ can silently skip them. Re-assert and verify.
  for (const t of ["lh911_leads", "lh911_posts"]) {
    await client.query(`grant select, insert, update, delete on public.${t} to service_role`);
  }
  await client.query("notify pgrst, 'reload schema'");

  const { rows: grants } = await client.query(
    `select table_name, grantee from information_schema.role_table_grants
      where table_schema='public' and table_name like 'lh911_%' and grantee='service_role'
      group by table_name, grantee`
  );
  if (grants.length < 2) fail("service_role grants did not apply.");
  ok("service_role can read and write both tables");

  // If the project was created with "Automatically expose new tables" on,
  // Supabase grants anon/authenticated on every new table. Leads must never
  // be reachable with the public browser key, so revoke rather than fail.
  const { rows: leaked } = await client.query(
    `select distinct grantee from information_schema.role_table_grants
      where table_schema='public' and table_name like 'lh911_%'
        and grantee in ('anon','authenticated')`
  );
  if (leaked.length) {
    for (const t of ["lh911_leads", "lh911_posts"]) {
      await client.query(`revoke all on public.${t} from anon, authenticated`);
    }
    await client.query("notify pgrst, 'reload schema'");
    ok(`revoked auto-granted access from ${leaked.map((r) => r.grantee).join(", ")}`);
  }

  const { rows: stillLeaked } = await client.query(
    `select distinct grantee from information_schema.role_table_grants
      where table_schema='public' and table_name like 'lh911_%'
        and grantee in ('anon','authenticated')`
  );
  if (stillLeaked.length) {
    fail(`anon/authenticated still hold grants: ${stillLeaked.map((r) => r.grantee).join(", ")}`);
  }
  ok("anon and authenticated hold no grants (leads stay private)");
  await client.end();

  await verifyRestAndSetEnv();
})().catch((e) => {
  if (e instanceof Bail) return; // already reported
  console.error(`\nFAILED: ${e.message}`);
  process.exitCode = 1;
});

/* ── shared tail: prove the REST path, then flip the env vars ───────── */

async function verifyRestAndSetEnv() {
  step(4, "Round-tripping a lead through the REST API");
  const base = cfg.NEW_SUPABASE_URL.replace(/\/$/, "");
  const headers = {
    "Content-Type": "application/json",
    apikey: cfg.NEW_SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${cfg.NEW_SUPABASE_SERVICE_ROLE_KEY}`,
  };

  const insert = await fetch(`${base}/rest/v1/lh911_leads`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({
      name: "switch-script probe",
      phone: "9075550000",
      case_type: "Car accident",
      description: "written and deleted by scripts/switch-supabase.js",
      consent: true,
      source: "switch-probe",
    }),
  });
  if (insert.status !== 201) {
    const body = await insert.text();
    if (insert.status === 404) {
      fail(
        `lh911_leads does not exist in ${newRef} yet.\n` +
          `Run supabase/schema.sql in the dashboard SQL editor first, or add\n` +
          `NEW_DATABASE_URL to .env.newsupabase so this script can create it.`
      );
    }
    fail(`REST insert returned ${insert.status}: ${body}`);
  }
  const [row] = await insert.json();
  ok(`insert succeeded (id ${row.id})`);

  const del = await fetch(`${base}/rest/v1/lh911_leads?id=eq.${row.id}`, {
    method: "DELETE",
    headers,
  });
  if (!del.ok) fail(`could not clean up probe row ${row.id}: ${del.status}`);
  ok("probe row deleted, table is empty again");

  step(5, "Updating Vercel production env vars");
  const tmp = path.join(ROOT, ".env.tmpval");
  const setVar = (name, value) => {
    try {
      execFileSync("vercel", ["env", "rm", name, "production", "--yes"], {
        cwd: ROOT,
        stdio: "ignore",
        shell: true,
      });
    } catch {
      /* not set yet, fine */
    }
    fs.writeFileSync(tmp, value); // no trailing newline: Vercel rejects it
    execFileSync("vercel", ["env", "add", name, "production"], {
      cwd: ROOT,
      stdio: ["pipe", "ignore", "ignore"],
      input: fs.readFileSync(tmp),
      shell: true,
    });
    ok(`${name} updated`);
  };

  setVar("SUPABASE_URL", cfg.NEW_SUPABASE_URL);
  setVar("SUPABASE_SERVICE_ROLE_KEY", cfg.NEW_SUPABASE_SERVICE_ROLE_KEY);
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);

  console.log(`
Done. The new project ${newRef} is ready and Vercel points at it.

Next, in order:
  1. Deploy so the functions pick up the new vars:
       vercel deploy --prod --yes
  2. Submit the real form at https://legalhelp911.vercel.app and confirm the
     row appears in the new project's Table Editor.
  3. Only after that passes, remove the old tables from the shared project:
       node scripts/drop-old-shared-tables.js
`);
}
