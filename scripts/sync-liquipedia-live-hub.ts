/**
 * Sync Liquipedia match data for Live Match Hub.
 * Run: npm run sync:liquipedia:live
 * Default: sync Asian Games 2026 Qualifiers from Liquipedia API.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const CACHE_FILE = path.join(DATA_DIR, "liquipedia-live-hub-cache.json");
const SETTINGS_FILE = path.join(DATA_DIR, "liquipedia-live-hub-settings.json");
const SOURCES_FILE = path.join(DATA_DIR, "liquipedia-live-hub-sources.json");
const LOCAL_MATCHES = path.join(DATA_DIR, "matches.json");

const ASIAN_GAMES_KEYWORDS = ["Asian Games", "Qualifier", "West Asia", "Southeast Asia", "SEA Qualifier", "Central Asia", "East Asia", "South Asia", "Last Chance"];
const COUNTRY_FLAGS: Record<string, string> = {
  IDN: "🇮🇩", ID: "🇮🇩", PHI: "🇵🇭", SGP: "🇸🇬", MAS: "🇲🇾", MY: "🇲🇾",
  CAM: "🇰🇭", KHM: "🇰🇭", MMR: "🇲🇲", MYA: "🇲🇲", LAO: "🇱🇦", VIE: "🇻🇳", VNM: "🇻🇳",
  KSA: "🇸🇦", OMN: "🇴🇲", JOR: "🇯🇴", ARE: "🇦🇪", UAE: "🇦🇪",
  IRI: "🇮🇷", IRN: "🇮🇷", UZB: "🇺🇿", KGZ: "🇰🇬", PAK: "🇵🇰", HKG: "🇭🇰",
  THA: "🇹🇭", TLS: "🇹🇱", BRN: "🇧🇳",
};

function safeWriteJson(filePath: string, data: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function parseArgs() {
  let limit = 200;
  let dryRun = false;
  let apiOnly = false;
  let allowLocalSeed = false;
  let noLocalSeed = false;
  let force = false;
  let source = "asian-games-2026-qualifiers";
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--limit=")) limit = Math.min(Math.max(parseInt(arg.split("=")[1]) || 200, 1), 1000);
    if (arg.startsWith("--source=")) source = arg.split("=")[1] || source;
    if (arg === "--dry-run") dryRun = true;
    if (arg === "--api-only") apiOnly = true;
    if (arg === "--allow-local-seed") allowLocalSeed = true;
    if (arg === "--no-local-seed") noLocalSeed = true;
    if (arg === "--force") force = true;
  }
  return { limit, dryRun, apiOnly, allowLocalSeed, noLocalSeed, force, source };
}

// ─── Liquipedia API fetch ────────────────────────────────────────────────────

async function apiGet(endpoint: string, params: Record<string, string>): Promise<any[]> {
  const apiKey = (process.env.LIQUIPEDIA_API_KEY || "").trim();
  if (!apiKey) throw new Error("LIQUIPEDIA_API_KEY not configured.");

  const baseUrl = process.env.LIQUIPEDIA_BASE_URL || "https://api.liquipedia.net/api/v3";
  const url = new URL(`${baseUrl}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  console.log(`[sync] GET ${endpoint}?${url.searchParams}`);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Apikey ${apiKey}`, Accept: "application/json", "User-Agent": "MoleDraft/0.1 (putragm29@gmail.com)" },
  });

  console.log(`[sync] Status: ${res.status}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err: any = new Error(`${res.status}: ${body.slice(0, 300)}`);
    err.statusCode = res.status;
    throw err;
  }
  const json = await res.json();
  return json.result || [];
}

// ─── Tournament discovery for Asian Games ────────────────────────────────────

async function discoverAsianGamesEvents(): Promise<string[]> {
  console.log("[sync] Discovering Asian Games events via /v3/tournament...");
  try {
    const tournaments = await apiGet("tournament", {
      wiki: "mobilelegends",
      limit: "100",
      query: "name,pagename",
    });
    console.log(`[sync] Found ${tournaments.length} tournaments`);

    const asianGames = tournaments.filter((t: any) => {
      const name = (t.name || "").toLowerCase();
      const pagename = (t.pagename || "").toLowerCase();
      return ASIAN_GAMES_KEYWORDS.some((kw) => name.includes(kw.toLowerCase()) || pagename.includes(kw.toLowerCase()));
    });

    console.log(`[sync] Asian Games tournaments: ${asianGames.length}`);
    asianGames.forEach((t: any) => console.log(`  - ${t.name} (${t.pagename})`));

    return asianGames.map((t: any) => t.name || t.pagename || "").filter(Boolean);
  } catch (err: any) {
    console.log(`[sync] Tournament discovery failed: ${err.statusCode || err.message}`);
    return [];
  }
}

// ─── Series fetch for Asian Games ───────────────────────────────────────────

async function fetchAsianGamesSeries(limit: number): Promise<any[]> {
  console.log("[sync] Fetching series for Asian Games...");

  try {
    const all = await apiGet("series", {
      wiki: "mobilelegends",
      limit: String(limit),
      query: "name,pagename",
    });
    console.log(`[sync] Broad series fetch: ${all.length} results`);

    if (all.length === 0) return [];

    // Filter for Asian Games locally
    const asianGames = all.filter((s: any) => {
      const name = (s.name || s.tournament || s.pagetournament || "").toLowerCase();
      const pagename = (s.pagename || "").toLowerCase();
      const extradata = JSON.stringify(s.extradata || "").toLowerCase();
      return ASIAN_GAMES_KEYWORDS.some((kw) => {
        const lower = kw.toLowerCase();
        return name.includes(lower) || pagename.includes(lower) || extradata.includes(lower);
      });
    });

    console.log(`[sync] Filtered ${asianGames.length} Asian Games matches from ${all.length} total`);
    return asianGames;
  } catch (err: any) {
    console.log(`[sync] Series fetch failed: ${err.statusCode || err.message}`);
    throw err;
  }
}

// ─── Local matches.json loader ───────────────────────────────────────────────

function loadLocalMatches(): any[] {
  try {
    if (!fs.existsSync(LOCAL_MATCHES)) return [];
    return JSON.parse(fs.readFileSync(LOCAL_MATCHES, "utf8"));
  } catch { return []; }
}

function normalizeLocalMatch(raw: any): any | null {
  if (!raw.team1 || !raw.team2) return null;
  const date = raw.date ? new Date(raw.date + "T00:00:00+07:00") : null;
  const now = new Date();
  const isPast = date ? date.getTime() < now.getTime() : true;
  const winner = (raw.winner || "").trim().toUpperCase();
  const team1 = (raw.team1 || "").trim().toUpperCase();
  const team2 = (raw.team2 || "").trim().toUpperCase();
  const hasWinner = winner.length > 0;
  const status = hasWinner || isPast ? "completed" : "upcoming";
  return {
    id: `local-${raw.date}-${team1}-vs-${team2}-${Math.random().toString(36).slice(2, 5)}`,
    sourceMode: "local-seed-historical",
    status, statusLabel: status === "completed" ? "Completed" : "Upcoming",
    startTime: date ? date.toISOString() : null,
    startTimestamp: date ? date.getTime() : 0,
    startTimeWIB: date ? date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : null,
    teamA: { name: team1, shortName: team1, score: hasWinner ? (winner === team1 ? 1 : 0) : 0, logoUrl: "", logoSource: "fallback" as const },
    teamB: { name: team2, shortName: team2, score: hasWinner ? (winner === team2 ? 1 : 0) : 0, logoUrl: "", logoSource: "fallback" as const },
    matchTitle: `${team1} vs ${team2}`, bestOf: null, bestOfLabel: "",
    tournament: raw.tournament || "Unknown", eventId: raw.tournament || "unknown",
    tier: raw.patch || "", sourcePage: "", patch: raw.patch || "",
    length: raw.length || "", winner: winner || null,
  };
}

function normalizeSeriesData(raw: any): any | null {
  const now = new Date();
  let startTime: Date | null = null;
  if (raw.date) { startTime = new Date(raw.date); if (isNaN(startTime.getTime())) startTime = null; }
  else if (raw.timestamp) { startTime = new Date(raw.timestamp); if (isNaN(startTime.getTime())) startTime = null; }
  const isFinished = raw.finished === 1 || raw.finished === "1" || raw.finished === true;
  const status = isFinished ? "completed" : startTime && now.getTime() < startTime.getTime() ? "upcoming" : "ongoing";

  let teamAName = "TBD", teamBName = "TBD", teamAScore: number | null = null, teamBScore: number | null = null;
  if (raw.match2opponents?.[0] && raw.match2opponents?.[1]) {
    teamAName = raw.match2opponents[0].name || raw.match2opponents[0].teamtemplate?.name || "TBD";
    teamBName = raw.match2opponents[1].name || raw.match2opponents[1].teamtemplate?.name || "TBD";
    teamAScore = raw.match2opponents[0].score ?? null;
    teamBScore = raw.match2opponents[1].score ?? null;
  } else if (raw.participants && Array.isArray(raw.participants) && raw.participants.length >= 2) {
    teamAName = raw.participants[0]?.name || raw.participants[0] || "TBD";
    teamBName = raw.participants[1]?.name || raw.participants[1] || "TBD";
  } else { return null; }

  const aShort = teamAName.length <= 4 ? teamAName.toUpperCase() : teamAName.slice(0, 4).toUpperCase();
  const bShort = teamBName.length <= 4 ? teamBName.toUpperCase() : teamBName.slice(0, 4).toUpperCase();
  const startTimeWIB = startTime ? startTime.toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : null;

  return {
    id: raw.objectname || raw.pageid || raw.pagename || `series-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    sourceMode: "liquipedia-api-live", status,
    statusLabel: status === "completed" ? "Completed" : status === "upcoming" ? "Upcoming" : "Live / Updating",
    startTime: startTime ? startTime.toISOString() : null,
    startTimestamp: startTime ? startTime.getTime() : 0,
    startTimeWIB,
    teamA: { name: teamAName, shortName: aShort, score: teamAScore, logoUrl: "", logoSource: "fallback" as const },
    teamB: { name: teamBName, shortName: bShort, score: teamBScore, logoUrl: "", logoSource: "fallback" as const },
    matchTitle: `${aShort} vs ${bShort}`,
    bestOf: raw.bestOf || raw.best_of || null,
    bestOfLabel: raw.bestOf ? `BO${raw.bestOf}` : raw.best_of ? `BO${raw.best_of}` : "",
    tournament: raw.tournament || raw.tournamentname || raw.pagetournament || "Unknown Tournament",
    eventId: raw.eventid || raw.tournament || "", tier: raw.tier || raw.extradata?.tier || "",
    sourcePage: raw.pagename || "", patch: raw.extradata?.patch || "",
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const { limit, dryRun, apiOnly, allowLocalSeed, noLocalSeed, source } = parseArgs();
  console.log(`[sync] Starting Live Match Hub sync`);
  console.log(`[sync] Source: ${source}`);

  let matches: any[] = [];
  let sourceMode: string = "empty";
  let sourceLabel: string = source;
  let warning = "";
  const apiStatus: any = { series: { statusCode: 0, ok: false, message: null }, fallbackUsed: false, fallbackReason: null };

  // Step 1: Try Liquipedia API for Asian Games
  if (source === "asian-games-2026-qualifiers") {
    try {
      console.log("[sync] === Asian Games 2026 Qualifiers ===");
      const apiData = await fetchAsianGamesSeries(limit);
      console.log(`[sync] Asian Games series: ${apiData.length}`);

      if (apiData.length > 0) {
        const normalized = apiData.map((s: any) => normalizeSeriesData(s)).filter(Boolean);
        console.log(`[sync] Normalized ${normalized.length} from ${apiData.length} raw`);
        matches = normalized;
        sourceMode = "liquipedia-api-live";
        sourceLabel = "Asian Games 2026 Qualifiers";
        apiStatus.series = { statusCode: 200, ok: true, message: `Fetched ${apiData.length} series, ${matches.length} normalized` };
      } else {
        console.log("[sync] No Asian Games series found via API");
        apiStatus.series = { statusCode: 200, ok: true, message: "0 Asian Games matches found" };
      }
    } catch (err: any) {
      const classified = classifyError(err);
      apiStatus.series = { statusCode: classified.statusCode || 0, ok: false, message: classified.message };
      console.log(`[sync] Asian Games API failed: ${classified.message}`);
      warning = classified.message;
    }

    // Also try tournament discovery to show available events
    if (matches.length === 0) {
      const events = await discoverAsianGamesEvents();
      if (events.length > 0) {
        console.log(`[sync] Found ${events.length} Asian Games tournaments but no series data`);
      }
    }
  }

  // Step 2: Local seed fallback (only if API failed and explicitly allowed)
  if (matches.length === 0 && !apiOnly && !noLocalSeed && (allowLocalSeed || source === "mpl-id-s17-local-seed")) {
    console.log("[sync] Loading local MPL S17 seed data as fallback...");
    const localRaw = loadLocalMatches();
    const normalized = localRaw.map(normalizeLocalMatch).filter(Boolean);
    const seen = new Set<string>();
    matches = normalized.filter((m) => {
      const key = m.matchTitle + "|" + m.startTime;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, limit);

    sourceMode = "local-seed-historical";
    sourceLabel = "MPL Indonesia S17 (Historical Seed)";
    apiStatus.fallbackUsed = true;
    apiStatus.fallbackReason = warning || "API returned 0 matches";
    warning = "Showing local historical seed data. Live/current matches from Asian Games not synced yet.";
  }

  // Step 3: Build results
  const upcoming = matches.filter((m) => m.status === "upcoming");
  const ongoing = matches.filter((m) => m.status === "ongoing");
  const completed = matches.filter((m) => m.status === "completed");
  const eventMap = new Map<string, any>();
  for (const m of matches) {
    const eid = m.eventId || m.tournament;
    if (!eventMap.has(eid)) eventMap.set(eid, { id: eid, name: m.tournament, matchCount: 0, upcomingCount: 0, ongoingCount: 0, completedCount: 0 });
    const ev = eventMap.get(eid)!;
    ev.matchCount++;
    if (m.status === "upcoming") ev.upcomingCount++;
    else if (m.status === "ongoing") ev.ongoingCount++;
    else if (m.status === "completed") ev.completedCount++;
  }
  const events = Array.from(eventMap.values()).sort((a, b) => b.matchCount - a.matchCount);

  console.log(`\n[sync] === Results ===`);
  console.log(`  sourceMode: ${sourceMode}`);
  console.log(`  sourceLabel: ${sourceLabel}`);
  console.log(`  Total: ${matches.length} | Upcoming: ${upcoming.length} | Live: ${ongoing.length} | Completed: ${completed.length}`);
  console.log(`  Events: ${events.length}`);
  events.forEach((e) => console.log(`    ${e.name} (${e.matchCount})`));
  if (warning) console.log(`  Warning: ${warning}`);

  if (dryRun) { console.log("\n[sync] DRY RUN — not writing files."); return; }

  // Write cache
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const now = new Date();
  const nextSync = new Date(now.getTime() + 900000);

  const cache = {
    sourceId: source,
    sourceLabel,
    sourceMode,
    source: sourceMode === "liquipedia-api-live" ? "liquipedia-api-v3-series" : "local-seed",
    wiki: "mobilelegends",
    lastSyncedAt: now.toISOString(),
    nextSyncAt: nextSync.toISOString(),
    rawCount: matches.length,
    filteredCount: matches.length,
    normalizedCount: matches.length,
    statusCounts: { all: matches.length, upcoming: upcoming.length, ongoing: ongoing.length, completed: completed.length },
    events,
    matches,
    apiStatus,
    warnings: warning ? [warning] : [],
  };

  safeWriteJson(CACHE_FILE, cache);
  console.log(`[sync] Cache: ${CACHE_FILE}`);

  // Write default settings if missing
  if (!fs.existsSync(SETTINGS_FILE)) {
    safeWriteJson(SETTINGS_FILE, {
      publicVisible: true, showCountdown: true, showUpcoming: true, showOngoing: true, showCompleted: true,
      mode: "all-events", selectedEventIds: events.map((e) => e.id), keywordFilters: [], tierFilters: [],
      maxMatches: 30, syncIntervalSeconds: 900, logoMode: "none",
    });
  }

  console.log(`[sync] Done. ${matches.length} matches, ${events.length} events.`);
}

function classifyError(err: any): { type: string; statusCode: number; message: string } {
  const msg = err?.message || "";
  if (msg.includes("429")) return { type: "rate_limit", statusCode: 429, message: "Rate limit (429). Liquipedia API quota exceeded." };
  if (msg.includes("403") || msg.includes("Forbidden")) return { type: "forbidden", statusCode: 403, message: "API access forbidden (403)." };
  if (msg.includes("404")) return { type: "not_found", statusCode: 404, message: "API endpoint not found (404)." };
  if (msg.includes("not configured")) return { type: "no_key", statusCode: 0, message: "LIQUIPEDIA_API_KEY not configured." };
  return { type: "unknown", statusCode: 0, message: msg || "Unknown error." };
}

main().catch((err) => { console.error(`[sync] Fatal: ${err.message}`); process.exit(1); });
