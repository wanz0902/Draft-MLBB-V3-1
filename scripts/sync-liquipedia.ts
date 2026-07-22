/**
 * Sync Liquipedia Players & Teams → local JSON snapshots.
 * Run: npm run sync:liquipedia
 * Args: --endpoint=players|teams|all --limit=500 --offset=0
 *
 * API key is used ONLY during this sync, never at page load.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { normalizePlayer, normalizeTeam, fetchLiquipediaV3 } from "../server/services/liquipediaService.js";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "data", "liquipedia");
const PLAYERS_FILE = path.join(OUT_DIR, "players.json");
const TEAMS_FILE = path.join(OUT_DIR, "teams.json");
const META_FILE = path.join(OUT_DIR, "sync-meta.json");

const WIKI = process.env.LIQUIPEDIA_WIKI || "mobilelegends";
const DELAY_MS = 700;

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

// ─── CLI Args ───────────────────────────────────────────────────────────────

function parseArgs(): { endpoint: string; pageSize: number; offset: number } {
  const args = process.argv.slice(2);
  let endpoint = "all";
  let pageSize = 500;
  let offset = 0;
  for (const arg of args) {
    const [k, v] = arg.split("=");
    if (k === "--endpoint" && v) endpoint = v.toLowerCase();
    if (k === "--limit" && v) pageSize = Math.min(Math.max(parseInt(v, 10) || 500, 1), 1000);
    if (k === "--offset" && v) offset = Math.max(parseInt(v, 10) || 0, 0);
  }
  return { endpoint, pageSize, offset };
}

// ─── Error classification ───────────────────────────────────────────────────

function classifyError(err: any): { type: string; message: string } {
  const msg = err?.message || "";
  if (msg.includes("429")) {
    const retryMatch = msg.match(/Retry-After:\s*(\S+)/i);
    const waitHint = retryMatch ? ` Wait ~${retryMatch[1]}s before retrying.` : "";
    return { type: "rate_limit", message: `Liquipedia API returned 429. The key is configured, but rate/quota limit was reached for this wiki/table.${waitHint} Wait for the limit reset or request higher limits from Liquipedia.` };
  }
  if (msg.includes("403") || msg.includes("Forbidden")) {
    return { type: "auth", message: "Liquipedia API returned 403. The key is invalid, revoked, expired, or not allowed for this endpoint. Update LIQUIPEDIA_API_KEY in .env with a valid raw key, without the Apikey prefix." };
  }
  if (msg.includes("LIQUIPEDIA_API_KEY")) {
    return { type: "missing_key", message: msg };
  }
  if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND") || msg.includes("fetch failed")) {
    return { type: "network", message: `Network error: ${msg}. Check your internet connection.` };
  }
  return { type: "unknown", message: `Sync error: ${msg || "Unknown error"}` };
}

// ─── Preflight ──────────────────────────────────────────────────────────────

async function preflightEndpoint(endpointName: string): Promise<void> {
  const queries: Record<string, string> = {
    player: "name,pagename,nationality,region,status,teampagename,teamtemplate,links,extradata",
    team: "name,pagename,region,logourl,logodarkurl,textlesslogourl,status,template,links,extradata",
  };
  const query = queries[endpointName];
  if (!query) return;

  console.log(`[sync] Preflight: testing ${endpointName} endpoint...`);
  try {
    await fetchLiquipediaV3(endpointName, { query, limit: 1 });
    console.log(`[sync] Preflight: ${endpointName} OK`);
  } catch (err: any) {
    const { type, message } = classifyError(err);
    console.error(`[sync] Preflight FAILED (${endpointName}): ${message}`);
    if (type === "rate_limit") console.error("[sync] Hint: wait a few minutes, then retry. Or use --endpoint to test one at a time.");
    process.exit(1);
  }
}

// ─── Fetch with 429 stop ────────────────────────────────────────────────────

async function fetchAllPages(endpointName: string, query: string, pageSize: number, startOffset: number): Promise<any[]> {
  const all: any[] = [];
  let offset = startOffset;
  while (true) {
    console.log(`[sync] Fetching ${endpointName} offset ${offset} limit ${pageSize}...`);
    try {
      const data = await fetchLiquipediaV3(endpointName, { query, limit: pageSize, offset });
      const batch = data.result || [];
      console.log(`[sync] Got ${batch.length} ${endpointName}s`);
      all.push(...batch);
      if (batch.length < pageSize) break;
      offset += pageSize;
      await sleep(DELAY_MS);
    } catch (err: any) {
      const classified = classifyError(err);
      if (classified.type === "rate_limit") {
        console.error(`[sync] STOPPED: ${classified.message}`);
        console.log(`[sync] Partial data: ${all.length} ${endpointName}s fetched before rate limit.`);
        break; // Return partial data instead of crashing
      }
      throw err; // Re-throw non-429 errors
    }
  }
  return all;
}

// ─── Dedupe ─────────────────────────────────────────────────────────────────

function dedupeBy(raw: any[], getKey: (item: any) => string): any[] {
  const seen = new Set<string>();
  return raw.filter((item) => {
    const key = getKey(item).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Enrich ─────────────────────────────────────────────────────────────────

function enrichPlayer(p: any): any {
  const np = normalizePlayer(p);
  return { ...np, wiki: WIKI, syncedAt: new Date().toISOString() };
}

function enrichTeam(t: any): any {
  const nt = normalizeTeam(t);
  return { ...nt, wiki: WIKI, syncedAt: new Date().toISOString() };
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = (process.env.LIQUIPEDIA_API_KEY || "").trim();
  if (!apiKey) {
    console.error("LIQUIPEDIA_API_KEY missing. Add it to .env before running sync.");
    console.error("Expected format: LIQUIPEDIA_API_KEY=RAW_KEY_ONLY (no Apikey prefix)");
    process.exit(1);
  }

  const { endpoint, pageSize, offset } = parseArgs();
  const doPlayers = endpoint === "all" || endpoint === "players";
  const doTeams = endpoint === "all" || endpoint === "teams";

  if (!doPlayers && !doTeams) {
    console.error("Invalid --endpoint value. Use: players, teams, or all");
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`[sync] Starting Liquipedia sync (endpoint=${endpoint}, limit=${pageSize}, offset=${offset})...`);

  // Preflight — only test endpoints being synced
  if (doPlayers) await preflightEndpoint("player");
  if (doTeams) { await sleep(DELAY_MS); await preflightEndpoint("team"); }

  let playersCount = 0;
  let teamsCount = 0;

  // Players
  if (doPlayers) {
    const playerQuery = "name,pagename,nationality,region,status,teampagename,teamtemplate,links,extradata";
    const rawPlayers = await fetchAllPages("player", playerQuery, pageSize, offset);
    const players = dedupeBy(rawPlayers, (p) => p.pagename || p.name || "").map(enrichPlayer);
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2), "utf8");
    playersCount = players.length;
    console.log(`[sync] Wrote ${playersCount} players to ${PLAYERS_FILE}`);
    if (doTeams) await sleep(DELAY_MS);
  }

  // Teams
  if (doTeams) {
    const teamQuery = "name,pagename,region,logourl,logodarkurl,textlesslogourl,status,template,links,extradata";
    const rawTeams = await fetchAllPages("team", teamQuery, pageSize, offset);
    const teams = dedupeBy(rawTeams, (t) => t.pagename || t.template || t.name || "").map(enrichTeam);
    fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2), "utf8");
    teamsCount = teams.length;
    console.log(`[sync] Wrote ${teamsCount} teams to ${TEAMS_FILE}`);
  }

  // Meta (merge with existing if partial sync)
  let existingMeta: any = {};
  try { if (fs.existsSync(META_FILE)) existingMeta = JSON.parse(fs.readFileSync(META_FILE, "utf8")); } catch {}
  const meta = {
    source: "Liquipedia",
    wiki: WIKI,
    lastSyncedAt: new Date().toISOString(),
    playersCount: doPlayers ? playersCount : (existingMeta.playersCount || 0),
    teamsCount: doTeams ? teamsCount : (existingMeta.teamsCount || 0),
    endpoints: { players: "/v3/player", teams: "/v3/team" },
    notes: ["Generated by npm run sync:liquipedia", "API key is used only during sync, not during page load."],
  };
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), "utf8");
  console.log(`[sync] Wrote sync metadata to ${META_FILE}`);

  console.log(`[sync] Done. ${meta.playersCount} players, ${meta.teamsCount} teams.`);
}

main().catch((err) => {
  const { message } = classifyError(err);
  console.error(`[sync] Fatal: ${message}`);
  process.exit(1);
});
