/**
 * Download approved player photos from a local manifest.
 * Run: npm run sync:player-photos
 * Only downloads URLs listed in data/player-photo-sources.json.
 * Does NOT scrape or search the internet.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DEFAULT_SOURCES = path.join(ROOT, "data", "player-photo-sources.json");
const OUT_DIR = path.join(ROOT, "public", "player-photos");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface PhotoSource {
  nickname: string;
  url: string;
  filename: string;
  credit?: string;
  sourceUrl?: string;
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  const force = process.argv.includes("--force");
  const manifestArg = process.argv.find((a) => a.startsWith("--manifest="));
  const SOURCES_FILE = manifestArg ? path.resolve(ROOT, manifestArg.split("=")[1]) : DEFAULT_SOURCES;

  if (!fs.existsSync(SOURCES_FILE)) {
    console.log(`[sync-photos] No approved player photo sources found at: ${SOURCES_FILE}`);
    console.log("[sync-photos] Create the manifest file with approved URLs to download.");
    return;
  }

  let sources: PhotoSource[];
  try {
    sources = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8"));
  } catch (err: any) {
    console.error(`[sync-photos] Failed to read sources: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(sources) || sources.length === 0) {
    console.log("[sync-photos] No approved player photo sources found.");
    return;
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of sources) {
    if (!entry.nickname || !entry.url || !entry.filename) {
      console.warn(`[sync-photos] Skipping invalid entry: ${JSON.stringify(entry)}`);
      failed++;
      continue;
    }

    const outPath = path.join(OUT_DIR, entry.filename);

    // Skip if exists unless --force
    if (fs.existsSync(outPath) && !force) {
      console.log(`[sync-photos] Skipped (exists): ${entry.filename}`);
      skipped++;
      continue;
    }

    try {
      console.log(`[sync-photos] Downloading: ${entry.nickname} from ${entry.url}`);
      const res = await fetch(entry.url);

      if (!res.ok) {
        console.error(`[sync-photos] Failed ${entry.nickname}: HTTP ${res.status}`);
        failed++;
        continue;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!ALLOWED_TYPES.some((t) => contentType.includes(t))) {
        console.error(`[sync-photos] Failed ${entry.nickname}: invalid content-type ${contentType}`);
        failed++;
        continue;
      }

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength > MAX_SIZE) {
        console.error(`[sync-photos] Failed ${entry.nickname}: file too large (${buffer.byteLength} bytes)`);
        failed++;
        continue;
      }

      fs.writeFileSync(outPath, Buffer.from(buffer));
      console.log(`[sync-photos] Downloaded: ${entry.filename} (${buffer.byteLength} bytes)`);
      downloaded++;
    } catch (err: any) {
      console.error(`[sync-photos] Failed ${entry.nickname}: ${err.message}`);
      failed++;
    }

    await sleep(300);
  }

  console.log(`[sync-photos] Done. Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error(`[sync-photos] Fatal: ${err.message}`);
  process.exit(1);
});
