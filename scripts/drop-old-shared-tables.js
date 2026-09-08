#!/usr/bin/env node
/**
 * Removes the lh911_ tables from the SHARED Supabase project once
 * LegalHelp911 has its own project and has been verified in production.
 *
 * Run this only after scripts/switch-supabase.js has passed AND a real form
 * submission has landed in the new project.
 *
 * Usage:
 *   node scripts/drop-old-shared-tables.js          # dry run, shows what it would do
 *   node scripts/drop-old-shared-tables.js --commit # actually drops
 *
 * Safety: it will only ever drop tables named lh911_*, it refuses if those
 * tables still contain rows, and it prints every other table it leaves
 * untouched so you can see the CRM data is not in scope.
 */

const fs = require("fs");
const { Client } = require("pg");

const SHARED_ENV = "C:\\Users\\arin_\\Work\\Insurance\\Bag Chaser\\Dialer\\.env";
const OLD_PROJECT_REF = "fnbilqtvzdlucwjvwfnh";
const COMMIT = process.argv.includes("--commit");

function readDatabaseUrl() {
  for (const line of fs.readFileSync(SHARED_ENV, "utf8").split(/\r?\n/)) {
    const m = line.match(/^DIRECT_URL=(.*)$/) || line.match(/^DATABASE_URL=(.*)$/);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("No DATABASE_URL found in the shared env file");
}

(async () => {
  const url = readDatabaseUrl();
  if (!url.includes(OLD_PROJECT_REF)) {
    console.error(`FAILED: connection string is not the shared project (${OLD_PROJECT_REF}).`);
    process.exit(1);
  }

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const { rows: tables } = await client.query(
    `select table_name from information_schema.tables
      where table_schema='public' order by table_name`
  );
  const mine = tables.filter((t) => t.table_name.startsWith("lh911_")).map((t) => t.table_name);
  const others = tables.filter((t) => !t.table_name.startsWith("lh911_")).length;

  if (mine.length === 0) {
    console.log("Nothing to do: no lh911_ tables in the shared project.");
    await client.end();
    return;
  }

  console.log(`Shared project ${OLD_PROJECT_REF}`);
  console.log(`  will DROP  : ${mine.join(", ")}`);
  console.log(`  will KEEP  : ${others} other tables (CRM, dialer, texting, insurance site)`);

  // Refuse to destroy anything that still holds data.
  for (const t of mine) {
    const { rows } = await client.query(`select count(*)::int as n from public.${t}`);
    if (rows[0].n > 0) {
      console.error(
        `\nFAILED: public.${t} still holds ${rows[0].n} row(s).\n` +
          `Migrate that data to the new project first. Refusing to drop non-empty tables.`
      );
      await client.end();
      process.exit(1);
    }
    console.log(`  ${t}: 0 rows, safe to drop`);
  }

  if (!COMMIT) {
    console.log("\nDry run. Re-run with --commit to actually drop these tables.");
    await client.end();
    return;
  }

  for (const t of mine) {
    await client.query(`drop table public.${t}`);
    console.log(`dropped public.${t}`);
  }

  const { rows: after } = await client.query(
    `select count(*)::int as n from information_schema.tables where table_schema='public'`
  );
  console.log(`\nDone. Shared project now has ${after[0].n} tables, none of them LegalHelp911's.`);
  await client.end();
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
