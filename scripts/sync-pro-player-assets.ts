/**
 * Sync approved pro player/team assets.
 * Run: npm run sync:pro-player-assets
 *
 * Reads data/pro-player-asset-sources.json for approved download URLs.
 * Does NOT scrape or search the internet.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const MANIFEST_FILE = path.join(ROOT, "data", "pro-player-asset-sources.json");

function parseArgs() {
  let force = false;
  let dryRun = false;
  let typeFilter = "all";
  let keyFilter = "";
  for (const arg of process.argv.slice(2)) {
    if (arg === "--force") force = true;
    if (arg === "--dry-run") dryRun = true;
    if (arg.startsWith("--type=")) typeFilter = arg.split("=")[1] || "all";
    if (arg.startsWith("--key=")) keyFilter = arg.split("=")[1] || "";
  }
  return { force, dryRun, typeFilter, keyFilter };
}

async function main() {
  const { force, dryRun, typeFilter, keyFilter } = parseArgs();
  console.log(`[sync-photos] Starting pro player asset sync`);

  if (!fs.existsSync(MANIFEST_FILE)) {
    console.log("[sync-photos] No manifest file found at data/pro-player-asset-sources.json");
    console.log("[sync-photos] Create it with approved URLs to download assets.");
    return;
  }

  let entries: any[];
  try {
    entries = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch (err: any) {
    console.error(`[sync-photos] Failed to read manifest: ${err.message}`);
    return;
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    console.log("[sync-photos] No approved pro player asset sources found.");
    return;
  }

  let filtered = entries;
  if (typeFilter !== "all") filtered = filtered.filter((e) => e.type === typeFilter);
  if (keyFilter) filtered = filtered.filter((e) => (e.key || "").toLowerCase().includes(keyFilter.toLowerCase()));

  console.log(`[sync-photos] Found ${filtered.length} entries to process (filtered from ${entries.length})`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of filtered) {
    if (!entry.url || !entry.filename || !entry.targetFolder) {
      console.warn(`[sync-photos] Skipping incomplete entry: ${JSON.stringify(entry).slice(0, 100)}`);
      failed++;
      continue;
    }

    const targetDir = path.join(ROOT, entry.targetFolder);
    const outPath = path.join(targetDir, entry.filename);

    if (fs.existsSync(outPath) && !force) {
      console.log(`[sync-photos] Skipped (exists): ${entry.filename}`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`[sync-photos] Dry run: would download ${entry.key} → ${entry.targetFolder}/${entry.filename}`);
      continue;
    }

    try {
      console.log(`[sync-photos] Downloading: ${entry.key} → ${entry.filename}`);
      const res = await fetch(entry.url);
      if (!res.ok) { console.error(`[sync-photos] Failed ${entry.key}: HTTP ${res.status}`); failed++; continue; }

      const contentType = res.headers.get("content-type") || "";
      if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].some((t) => contentType.includes(t))) {
        console.error(`[sync-photos] Failed ${entry.key}: invalid content-type ${contentType}`); failed++; continue;
      }

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength > 5 * 1024 * 1024) {
        console.error(`[sync-photos] Failed ${entry.key}: file too large (${buffer.byteLength} bytes)`); failed++; continue;
      }

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(outPath, Buffer.from(buffer));
      console.log(`[sync-photos] Downloaded: ${entry.filename} (${buffer.byteLength} bytes)`);
      downloaded++;
    } catch (err: any) {
      console.error(`[sync-photos] Failed ${entry.key}: ${err.message}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`[sync-photos] Done. Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch((err) => { console.error(`[sync-photos] Fatal: ${err.message}`); process.exit(1); });
