/**
 * Sync Liquipedia detail data (placements, transfers, squadplayers, tournaments).
 * Run: npm run sync:liquipedia:details
 *
 * API key is used ONLY during this sync, never at page load.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fetchLiquipediaV3 } from "../server/services/liquipediaService.js";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "data", "liquipedia");
const META_FILE = path.join(OUT_DIR, "sync-meta.json");
const DELAY_MS = 700;
const PAGE_SIZE = 500;

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

function classifyError(err: any): { type: string; message: string } {
  const msg = err?.message || "";
  if (msg.includes("429")) {
    const retryMatch = msg.match(/Retry-After:\s*(\S+)/i);
    const waitHint = retryMatch ? ` Wait ~${retryMatch[1]}s before retrying.` : "";
    return { type: "rate_limit", message: `Liquipedia API returned 429.${waitHint}` };
  }
  if (msg.includes("403") || msg.includes("Forbidden")) {
    return { type: "auth", message: "Liquipedia API returned 403. Endpoint may not be available for this key/wiki." };
  }
  if (msg.includes("LIQUIPEDIA_API_KEY")) {
    return { type: "missing_key", message: msg };
  }
  if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND") || msg.includes("fetch failed")) {
    return { type: "network", message: `Network error: ${msg}` };
  }
  return { type: "unknown", message: `Sync error: ${msg}` };
}

async function fetchAllPages(endpoint: string, query: string, conditions?: string): Promise<{ data: any[]; partial: boolean; error?: string }> {
  const all: any[] = [];
  let offset = 0;
  while (true) {
    console.log(`[sync-detail] Fetching ${endpoint} offset ${offset} limit ${PAGE_SIZE}...`);
    try {
      const res = await fetchLiquipediaV3(endpoint, { query, conditions, limit: PAGE_SIZE, offset });
      const batch = res.result || [];
      console.log(`[sync-detail] Got ${batch.length} ${endpoint}s`);
      all.push(...batch);
      if (batch.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
      await sleep(DELAY_MS);
    } catch (err: any) {
      const classified = classifyError(err);
      if (classified.type === "rate_limit") {
        console.error(`[sync-detail] STOPPED (rate limit): ${classified.message}`);
        return { data: all, partial: true, error: classified.message };
      }
      if (classified.type === "auth") {
        console.error(`[sync-detail] STOPPED (403): ${classified.message}`);
        return { data: all, partial: false, error: classified.message };
      }
      throw err;
    }
  }
  return { data: all, partial: false };
}

function readExistingMeta(): any {
  try {
    if (fs.existsSync(META_FILE)) return JSON.parse(fs.readFileSync(META_FILE, "utf8"));
  } catch {}
  return {};
}

async function main() {
  const apiKey = (process.env.LIQUIPEDIA_API_KEY || "").trim();
  if (!apiKey) {
    console.error("LIQUIPEDIA_API_KEY missing. Add it to .env before running sync.");
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const existingMeta = readExistingMeta();
  const detailData: any = existingMeta.detailData || {};

  // ─── Placements ─────────────────────────────────────────────────────────
  const PLACEMENTS_FILE = path.join(OUT_DIR, "placements.json");
  const placementQuery = "pagename,opponent,pagetournament,placement,placementname,date,prize,prizeunitindex,prizeusd,region";
  console.log("[sync-detail] Syncing placements...");
  const placementsResult = await fetchAllPages("placement", placementQuery);
  if (placementsResult.data.length > 0 || !placementsResult.error) {
    fs.writeFileSync(PLACEMENTS_FILE, JSON.stringify(placementsResult.data, null, 2), "utf8");
    detailData.placements = { synced: true, count: placementsResult.data.length, partial: placementsResult.partial };
    console.log(`[sync-detail] Wrote ${placementsResult.data.length} placements`);
  } else {
    detailData.placements = { synced: false, count: 0, partial: false, error: placementsResult.error };
    console.log(`[sync-detail] Placements not available: ${placementsResult.error}`);
  }
  await sleep(DELAY_MS);

  // ─── Transfers ──────────────────────────────────────────────────────────
  const TRANSFERS_FILE = path.join(OUT_DIR, "transfers.json");
  const transferQuery = "pagename,team,teampagename,fromteam,fromteampagename,date,roledate,type,status";
  console.log("[sync-detail] Syncing transfers...");
  const transfersResult = await fetchAllPages("transfer", transferQuery);
  if (transfersResult.data.length > 0 || !transfersResult.error) {
    fs.writeFileSync(TRANSFERS_FILE, JSON.stringify(transfersResult.data, null, 2), "utf8");
    detailData.transfers = { synced: true, count: transfersResult.data.length, partial: transfersResult.partial };
    console.log(`[sync-detail] Wrote ${transfersResult.data.length} transfers`);
  } else {
    detailData.transfers = { synced: false, count: 0, partial: false, error: transfersResult.error };
    console.log(`[sync-detail] Transfers not available: ${transfersResult.error}`);
  }
  await sleep(DELAY_MS);

  // ─── Squad Players ──────────────────────────────────────────────────────
  const SQUAD_FILE = path.join(OUT_DIR, "squadplayers.json");
  const squadQuery = "pagename,team,teampagename,role,datejoin,dateleave,nationality,flag";
  console.log("[sync-detail] Syncing squadplayers...");
  const squadResult = await fetchAllPages("squadplayer", squadQuery);
  if (squadResult.data.length > 0 || !squadResult.error) {
    fs.writeFileSync(SQUAD_FILE, JSON.stringify(squadResult.data, null, 2), "utf8");
    detailData.squadplayers = { synced: true, count: squadResult.data.length, partial: squadResult.partial };
    console.log(`[sync-detail] Wrote ${squadResult.data.length} squadplayers`);
  } else {
    detailData.squadplayers = { synced: false, count: 0, partial: false, error: squadResult.error };
    console.log(`[sync-detail] Squadplayers not available: ${squadResult.error}`);
  }
  await sleep(DELAY_MS);

  // ─── Tournaments ────────────────────────────────────────────────────────
  const TOURNEY_FILE = path.join(OUT_DIR, "tournaments.json");
  const tourneyQuery = "pagename,name,seriesname,region,location,type,organizers,datestartdate,dateenddate,prizepool,prizepoolusd,tier";
  console.log("[sync-detail] Syncing tournaments...");
  const tourneyResult = await fetchAllPages("tournament", tourneyQuery);
  if (tourneyResult.data.length > 0 || !tourneyResult.error) {
    fs.writeFileSync(TOURNEY_FILE, JSON.stringify(tourneyResult.data, null, 2), "utf8");
    detailData.tournaments = { synced: true, count: tourneyResult.data.length, partial: tourneyResult.partial };
    console.log(`[sync-detail] Wrote ${tourneyResult.data.length} tournaments`);
  } else {
    detailData.tournaments = { synced: false, count: 0, partial: false, error: tourneyResult.error };
    console.log(`[sync-detail] Tournaments not available: ${tourneyResult.error}`);
  }

  // ─── Update meta ────────────────────────────────────────────────────────
  const meta = {
    ...existingMeta,
    detailData,
    lastDetailSyncAt: new Date().toISOString(),
  };
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), "utf8");
  console.log(`[sync-detail] Updated sync-meta.json`);

  // Summary
  const sections = ["placements", "transfers", "squadplayers", "tournaments"];
  for (const s of sections) {
    const d = detailData[s];
    if (d) console.log(`[sync-detail] ${s}: ${d.synced ? "synced" : "failed"}, count=${d.count}, partial=${d.partial}`);
  }
  console.log("[sync-detail] Done.");
}

main().catch((err) => {
  const { message } = classifyError(err);
  console.error(`[sync-detail] Fatal: ${message}`);
  process.exit(1);
});
