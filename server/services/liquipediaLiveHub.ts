/**
 * Liquipedia Live Match Hub — Backend Service
 *
 * Server-side only. Fetches MLBB match data from Liquipedia v3 API.
 * Implements cooldown/cache to avoid 429 rate limits.
 * Normalizes data for frontend consumption.
 * Stores settings and cache in local JSON files.
 */

import fs from "fs";
import path from "path";

// ─── Config ──────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const CACHE_FILE = path.join(DATA_DIR, "liquipedia-live-hub-cache.json");
const SETTINGS_FILE = path.join(DATA_DIR, "liquipedia-live-hub-settings.json");

const DEFAULT_SETTINGS = {
  publicVisible: true,
  showCountdown: true,
  showUpcoming: true,
  showOngoing: true,
  showCompleted: false,
  mode: "selected-events" as string,
  selectedEventIds: [] as string[],
  keywordFilters: [] as string[],
  tierFilters: [] as string[],
  maxMatches: 20,
  syncIntervalSeconds: 900,
  logoMode: "none" as const,
};

type Settings = typeof DEFAULT_SETTINGS;

// ─── File Storage ────────────────────────────────────────────────────────────

function safeReadJson(filePath: string): any {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch { return null; }
}

function safeWriteJson(filePath: string, data: any): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`[LiveHub] Failed to write ${filePath}:`, (err as Error).message);
  }
}

export function getSettings(): Settings {
  const saved = safeReadJson(SETTINGS_FILE);
  return { ...DEFAULT_SETTINGS, ...saved };
}

export function saveSettings(settings: Partial<Settings>): Settings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  safeWriteJson(SETTINGS_FILE, updated);
  return updated;
}

// ─── Cache ──────────────────────────────────────────────────────────────────

interface CacheEntry {
  matches: any[];
  events: any[];
  updatedAt: string;
  nextSyncAvailableAt: string;
  syncStatus: string;
  sourceMode?: string;
}

function getCache(): CacheEntry | null {
  return safeReadJson(CACHE_FILE);
}

function setCache(entry: CacheEntry): void {
  safeWriteJson(CACHE_FILE, entry);
}

export function getCooldownRemaining(): number {
  const cached = getCache();
  if (!cached) return 0;
  const nextSync = new Date(cached.nextSyncAvailableAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((nextSync - now) / 1000));
}

// ─── Liquipedia API Fetch ───────────────────────────────────────────────────

async function fetchLiquipediaMatch(endpoint: string, params: Record<string, string>): Promise<any> {
  const apiKey = process.env.LIQUIPEDIA_API_KEY || "";
  if (!apiKey) {
    throw new Error("LIQUIPEDIA_API_KEY is not configured on the server.");
  }

  const baseUrl = process.env.LIQUIPEDIA_BASE_URL || "https://api.liquipedia.net/api/v3";
  const url = new URL(`${baseUrl}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Apikey ${apiKey}`,
      Accept: "application/json",
      "User-Agent": "MoleDraft/0.1 (putragm29@gmail.com)",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err: any = new Error(`Liquipedia API returned ${res.status}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  return res.json();
}

// ─── Normalization ───────────────────────────────────────────────────────────

function normalizeTeam(matchTeam: any): { name: string; shortName: string; score: number; logoUrl: string } {
  if (!matchTeam) return { name: "TBD", shortName: "TBD", score: 0, logoUrl: "" };
  const opponent = matchTeam;
  const template = opponent.teamtemplate || {};
  const name = opponent.name || template.name || "TBD";
  const shortName = template.shortname || name.slice(0, 4).toUpperCase();
  const score = opponent.score ?? 0;
  const logoUrl = template.imageurl || template.imagedarkurl || "";
  return { name, shortName, score, logoUrl };
}

function normalizeMatch(raw: any): any {
  const now = new Date();
  const startTime = raw.date ? new Date(raw.date) : null;
  const startTimestamp = startTime ? startTime.getTime() : 0;
  const isFinished = raw.finished === 1;

  let status: string;
  let statusLabel: string;
  if (isFinished) {
    status = "completed";
    statusLabel = "Completed";
  } else if (startTime && now.getTime() < startTimestamp) {
    status = "upcoming";
    statusLabel = "Upcoming";
  } else {
    status = "ongoing";
    statusLabel = "Live / Updating";
  }

  const teamA = normalizeTeam(raw.match2opponents?.[0]);
  const teamB = normalizeTeam(raw.match2opponents?.[1]);

  const startTimeWIB = startTime
    ? startTime.toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

  return {
    id: raw.objectname || raw.pageid || raw.id || `match-${Math.random().toString(36).slice(2)}`,
    status,
    statusLabel,
    startTime: startTime ? startTime.toISOString() : null,
    startTimestamp,
    startTimeWIB,
    teamA,
    teamB,
    matchTitle: `${teamA.shortName} vs ${teamB.shortName}`,
    bestOf: raw.bestOf ?? null,
    bestOfLabel: raw.bestOf ? `BO${raw.bestOf}` : "",
    tournament: raw.tournament || raw.pagetournament || "Unknown Tournament",
    eventId: raw.eventid || raw.pageid || "",
    tier: raw.tier || "",
    sourcePage: raw.pagename || "",
    iconUrl: "",
  };
}

function normalizeEvent(matches: any[]): any[] {
  const eventMap = new Map<string, { id: string; name: string; matchCount: number; upcomingCount: number; ongoingCount: number; completedCount: number }>();

  for (const m of matches) {
    const eventId = m.eventId || m.tournament || "unknown";
    if (!eventMap.has(eventId)) {
      eventMap.set(eventId, { id: eventId, name: m.tournament || eventId, matchCount: 0, upcomingCount: 0, ongoingCount: 0, completedCount: 0 });
    }
    const event = eventMap.get(eventId)!;
    event.matchCount++;
    if (m.status === "upcoming") event.upcomingCount++;
    else if (m.status === "ongoing") event.ongoingCount++;
    else if (m.status === "completed") event.completedCount++;
  }

  return Array.from(eventMap.values()).sort((a, b) => b.matchCount - a.matchCount);
}

// ─── Sync Logic ──────────────────────────────────────────────────────────────

export async function syncMatchData(): Promise<{ ok: boolean; matches: any[]; events: any[]; warning?: string }> {
  const settings = getSettings();
  const cooldown = getCooldownRemaining();

  if (cooldown > 0 && cooldown > 60) {
    const cached = getCache();
    if (cached) {
      return {
        ok: true,
        matches: cached.matches,
        events: cached.events,
        warning: `Showing cached data. Next sync in ${Math.ceil(cooldown / 60)} min.`,
      };
    }
  }

  try {
    const allMatches: any[] = [];
    const wiki = process.env.LIQUIPEDIA_WIKI || "mobilelegends";

    // Fetch upcoming matches
    console.log("[LiveHub] Fetching upcoming matches...");
    const upcomingRes = await fetchLiquipediaMatch("match", {
      wiki,
      limit: "50",
      order: "date asc",
      conditions: "[[date::>NOW]]",
    });
    const upcoming = (upcomingRes.result || []).map(normalizeMatch);
    allMatches.push(...upcoming);
    console.log(`[LiveHub] Got ${upcoming.length} upcoming`);

    await new Promise((r) => setTimeout(r, 500));

    // Fetch possible live
    console.log("[LiveHub] Fetching possible live matches...");
    const liveRes = await fetchLiquipediaMatch("match", {
      wiki,
      limit: "20",
      order: "date desc",
      conditions: "[[date::<NOW]][[finished::0]]",
    });
    const live = (liveRes.result || []).map(normalizeMatch);
    allMatches.push(...live);
    console.log(`[LiveHub] Got ${live.length} possible live`);

    // Optionally fetch recent completed
    if (settings.showCompleted) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("[LiveHub] Fetching recent completed matches...");
      const completedRes = await fetchLiquipediaMatch("match", {
        wiki,
        limit: "20",
        order: "date desc",
        conditions: "[[date::<NOW]][[finished::1]]",
      });
      const completed = (completedRes.result || []).map(normalizeMatch);
      allMatches.push(...completed);
      console.log(`[LiveHub] Got ${completed.length} completed`);
    }

    // Deduplicate by id
    const seen = new Set<string>();
    const deduped = allMatches.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    const events = normalizeEvent(deduped);
    const nextSync = new Date(Date.now() + (settings.syncIntervalSeconds || 900) * 1000);
    const now = new Date();

    setCache({
      matches: deduped,
      events,
      updatedAt: now.toISOString(),
      nextSyncAvailableAt: nextSync.toISOString(),
      syncStatus: "success",
    });

    return { ok: true, matches: deduped, events };
  } catch (err: any) {
    console.error("[LiveHub] Sync error:", err.message);

    if (err.status === 429) {
      const cached = getCache();
      if (cached) {
        return {
          ok: true,
          matches: cached.matches,
          events: cached.events,
          warning: "Liquipedia rate limit reached (429). Showing cached data.",
        };
      }
      return { ok: false, matches: [], events: [], warning: "Liquipedia rate limit reached (429). No cached data available." };
    }

    if (err.status === 401 || err.status === 403) {
      return { ok: false, matches: [], events: [], warning: `Authentication error (${err.status}). Check LIQUIPEDIA_API_KEY.` };
    }

    // For any other error, try to return cached data
    const cached = getCache();
    if (cached) {
      return {
        ok: true,
        matches: cached.matches,
        events: cached.events,
        warning: `Backend error (${err.status || "unknown"}). Showing cached data.`,
      };
    }

    return { ok: false, matches: [], events: [], warning: err.message || "Unknown error" };
  }
}

// ─── Public Response Builder ─────────────────────────────────────────────────

export function buildPublicResponse(filter?: { status?: string; event?: string; limit?: number }): any {
  const cached = getCache();
  const settings = getSettings();

  if (!settings.publicVisible) {
    return {
      ok: true,
      source: "Liquipedia",
      publicVisible: false,
      showCountdown: settings.showCountdown,
      updatedAt: null,
      matches: [],
      events: [],
      stats: { upcoming: 0, ongoing: 0, completed: 0, selectedEvents: 0 },
      message: "Match hub is currently disabled by admin.",
    };
  }

  if (!cached) {
    return {
      ok: true,
      source: "Liquipedia",
      publicVisible: true,
      showCountdown: settings.showCountdown,
      updatedAt: null,
      matches: [],
      events: [],
      stats: { upcoming: 0, ongoing: 0, completed: 0, selectedEvents: 0 },
      message: "No match data synced yet. Admin needs to trigger a sync.",
    };
  }

  let matches = [...cached.matches];

  // Apply status filter
  const statusFilters: string[] = [];
  if (settings.showUpcoming) statusFilters.push("upcoming");
  if (settings.showOngoing) statusFilters.push("ongoing");
  if (settings.showCompleted) statusFilters.push("completed");
  if (statusFilters.length > 0 && statusFilters.length < 3) {
    matches = matches.filter((m) => statusFilters.includes(m.status));
  }

  // Apply event filter (selected-events mode)
  if (settings.mode === "selected-events" && settings.selectedEventIds.length > 0) {
    const selectedSet = new Set(settings.selectedEventIds);
    matches = matches.filter((m) => selectedSet.has(m.eventId) || selectedSet.has(m.tournament));
  }

  // Apply keyword filter
  if (settings.keywordFilters.length > 0) {
    matches = matches.filter((m) => {
      const title = (m.tournament || "").toLowerCase();
      return settings.keywordFilters.some((kw) => title.includes(kw.toLowerCase()));
    });
  }

  // Apply tier filter
  if (settings.tierFilters.length > 0) {
    matches = matches.filter((m) => settings.tierFilters.includes(m.tier));
  }

  // Apply status query param
  if (filter?.status && filter.status !== "all") {
    matches = matches.filter((m) => m.status === filter.status);
  }

  // Apply event query param
  if (filter?.event) {
    matches = matches.filter((m) => m.eventId === filter.event || m.tournament === filter.event);
  }

  // Apply limit
  const limit = Math.min(filter?.limit || settings.maxMatches || 20, 50);
  matches = matches.slice(0, limit);

  const cooldown = getCooldownRemaining();

  return {
    ok: true,
    source: "Liquipedia",
    sourceMode: cached.sourceMode || "unknown",
    mode: settings.mode,
    publicVisible: true,
    showCountdown: settings.showCountdown,
    updatedAt: cached.updatedAt,
    fromCache: cooldown > 0,
    cooldownRemainingSeconds: cooldown,
    nextSyncAvailableAt: cached.nextSyncAvailableAt,
    stats: {
      upcoming: cached.matches.filter((m) => m.status === "upcoming").length,
      ongoing: cached.matches.filter((m) => m.status === "ongoing").length,
      completed: cached.matches.filter((m) => m.status === "completed").length,
      selectedEvents: cached.events.length,
    },
    events: cached.events.map((e) => ({
      ...e,
      selected: settings.selectedEventIds.includes(e.id) || settings.mode === "all-events",
    })),
    matches,
  };
}

// ─── Admin Response Builder ──────────────────────────────────────────────────

export function buildAdminResponse(): any {
  const cached = getCache();
  const settings = getSettings();
  const cooldown = getCooldownRemaining();

  return {
    ok: true,
    settings,
    syncStatus: cached?.syncStatus || "never-synced",
    lastSyncedAt: cached?.updatedAt || null,
    nextSyncAvailableAt: cached?.nextSyncAvailableAt || null,
    cooldownRemainingSeconds: cooldown,
    canSyncNow: cooldown === 0,
    events: cached?.events || [],
    matchesCount: cached?.matches?.length || 0,
    totalEvents: cached?.events?.length || 0,
  };
}
