/**
 * Liquipedia Data Layer — Phase 1 (Players & Teams)
 *
 * Server-side only. Never expose API key to frontend.
 * Uses Liquipedia v3 API with in-memory TTL cache.
 */

// ─── Config (lazy reads — must NOT be module-level constants) ─────────────

function getBaseUrl() { return process.env.LIQUIPEDIA_BASE_URL || "https://api.liquipedia.net/api"; }
function getWiki() { return process.env.LIQUIPEDIA_WIKI || "mobilelegends"; }
function getApiKey() { return (process.env.LIQUIPEDIA_API_KEY || "").trim(); }

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

// ─── Cache ──────────────────────────────────────────────────────────────────

const cache = new Map<string, { data: any; timestamp: number }>();

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── Liquipedia v3 Client ───────────────────────────────────────────────────

interface LiquipediaV3Response {
  result: any[];
  request?: {
    query?: string;
    conditions?: string;
    limit?: number;
    offset?: number;
  };
  errors?: string[];
  warnings?: string[];
}

async function fetchLiquipediaV3(
  endpoint: string,
  params: {
    query: string;
    conditions?: string;
    limit?: number;
    offset?: number;
  }
): Promise<LiquipediaV3Response> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("LIQUIPEDIA_API_KEY is not configured on the server.");
  }

  const url = new URL(`${getBaseUrl()}/v3/${endpoint}`);
  url.searchParams.set("wiki", getWiki());
  url.searchParams.set("query", params.query);
  if (params.conditions) url.searchParams.set("conditions", params.conditions);
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.offset) url.searchParams.set("offset", String(params.offset));

  const cacheKey = url.toString();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Apikey ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Strip API key from error text to prevent leaking secrets in logs
    const sanitized = text.replace(/Apikey\s+\S+/gi, "Apikey [REDACTED]").replace(/\b[a-zA-Z0-9_-]{40,}\b/g, "[REDACTED]");
    if (res.status === 403) {
      throw new Error(`Liquipedia API returned 403 Forbidden. The API key is likely invalid, revoked, or expired. Please update LIQUIPEDIA_API_KEY in .env.`);
    }
    if (res.status === 429) {
      const retryAfter = res.headers?.get?.("retry-after") || res.headers?.get?.("RateLimit-Reset");
      const waitHint = retryAfter ? ` Retry-After: ${retryAfter}.` : "";
      throw new Error(`Liquipedia API returned 429 Rate Limit.${waitHint} The key is configured, but rate/quota limit was reached for this wiki/table. Wait for the limit reset or request higher limits from Liquipedia.`);
    }
    throw new Error(`Liquipedia API returned ${res.status}: ${sanitized.slice(0, 200)}`);
  }

  const data = (await res.json()) as LiquipediaV3Response;

  if (data.errors && data.errors.length > 0) {
    throw new Error(`Liquipedia API errors: ${data.errors.join("; ")}`);
  }

  setCache(cacheKey, data);
  return data;
}

// ─── Normalizers (exported for reuse by sync script) ───────────────────────

const ROLE_ALIASES: Record<string, string> = {
  // Player roles → canonical
  gold: "gold", "gold lane": "gold", goldlaner: "gold", "gold laner": "gold", bottom: "gold", bot: "gold", marksman: "gold", mm: "gold",
  exp: "exp", "exp lane": "exp", explaner: "exp", "exp laner": "exp", offlane: "exp", offlaner: "exp", "off lane": "exp", sidelaner: "exp", side: "exp",
  mid: "mid", "mid lane": "mid", midlaner: "mid", "mid laner": "mid", mage: "mid",
  roamer: "roamer", roam: "roamer", support: "roamer", tank: "roamer",
  jungler: "jungler", jungle: "jungler", jgl: "jungler", jung: "jungler", core: "jungler", hyper: "jungler", hypercarry: "jungler", "jungler/core": "jungler",
  // Staff roles → canonical
  coach: "coach", headcoach: "coach", "head coach": "coach", assistantcoach: "coach", "assistant coach": "coach", "strategic coach": "coach",
  analyst: "analyst", "team analyst": "analyst", "performance analyst": "analyst",
  manager: "manager", "team manager": "manager", "general manager": "manager",
  // Talent/broadcast roles → canonical
  caster: "caster", shoutcaster: "caster",
  commentator: "commentator",
  host: "host", "desk host": "host",
  "analyst desk": "caster", "broadcast analyst": "caster",
  interviewer: "commentator",
  observer: "observer",
  talent: "caster", "broadcast talent": "caster",
  streamer: "content creator",
  "content creator": "content creator", contentcreator: "content creator", creator: "content creator",
};

export function normalizeRole(rawRole: string | null | undefined): string | null {
  if (!rawRole) return null;
  const cleaned = rawRole.trim().toLowerCase().replace(/[_-]/g, " ").replace(/\s+/g, " ");
  return ROLE_ALIASES[cleaned] || cleaned || null;
}

const PRO_PLAYER_ROLES = new Set(["gold", "exp", "mid", "roamer", "jungler"]);
const TEAM_STAFF_ROLES = new Set(["coach", "analyst", "manager"]);
const BROADCAST_TALENT_ROLES = new Set(["caster", "commentator", "host", "content creator", "observer"]);

const ROLE_CATEGORIES: Record<string, string> = {
  gold: "pro_player", exp: "pro_player", mid: "pro_player", roamer: "pro_player", jungler: "pro_player",
  coach: "team_staff", analyst: "team_staff", manager: "team_staff",
  caster: "broadcast_talent", commentator: "broadcast_talent", host: "broadcast_talent", "content creator": "broadcast_talent", observer: "broadcast_talent",
};

export function classifyPerson(roleNormalized: string | null): { category: string; isProPlayer: boolean; isTeamStaff: boolean; isBroadcastTalent: boolean; isNeedsReview: boolean; reason: string } {
  if (!roleNormalized) return { category: "needs_review", isProPlayer: false, isTeamStaff: false, isBroadcastTalent: false, isNeedsReview: true, reason: "Empty or missing role" };
  const r = roleNormalized.toLowerCase();
  if (PRO_PLAYER_ROLES.has(r)) return { category: "pro_player", isProPlayer: true, isTeamStaff: false, isBroadcastTalent: false, isNeedsReview: false, reason: "Pro player role" };
  if (TEAM_STAFF_ROLES.has(r)) return { category: "team_staff", isProPlayer: false, isTeamStaff: true, isBroadcastTalent: false, isNeedsReview: false, reason: "Team staff role" };
  if (BROADCAST_TALENT_ROLES.has(r)) return { category: "broadcast_talent", isProPlayer: false, isTeamStaff: false, isBroadcastTalent: true, isNeedsReview: false, reason: "Broadcast talent role" };
  return { category: "needs_review", isProPlayer: false, isTeamStaff: false, isBroadcastTalent: false, isNeedsReview: true, reason: `Unknown role: ${roleNormalized}` };
}

export function normalizeLinks(links: any): { type: string; url: string }[] {
  if (!links) return [];
  if (Array.isArray(links)) {
    return links
      .filter((l) => l && typeof l === "object" && l.url)
      .map((l) => ({ type: l.type || l.name || "link", url: l.url }));
  }
  if (typeof links === "object") {
    return Object.entries(links)
      .filter(([, v]) => typeof v === "string" && v.startsWith("http"))
      .map(([k, v]) => ({ type: k, url: v as string }));
  }
  return [];
}

export function normalizePlayer(raw: any): NormalizedPlayer {
  const extradata = raw.extradata || {};
  const rawPrimaryRole = extradata.role || null;
  const rawSecondaryRole = extradata.role2 || null;
  const primaryRole = normalizeRole(rawPrimaryRole);
  const secondaryRole = normalizeRole(rawSecondaryRole);

  const rawRoles: string[] = [];
  const cleanRoles: string[] = [];
  if (rawPrimaryRole) { rawRoles.push(rawPrimaryRole); const cr = normalizeRole(rawPrimaryRole); if (cr && !cleanRoles.includes(cr)) cleanRoles.push(cr); }
  if (rawSecondaryRole && rawSecondaryRole !== rawPrimaryRole) { rawRoles.push(rawSecondaryRole); const cr = normalizeRole(rawSecondaryRole); if (cr && !cleanRoles.includes(cr)) cleanRoles.push(cr); }
  if (extradata.roles && typeof extradata.roles === "string") {
    for (const r of extradata.roles.split(",")) {
      const trimmed = r.trim();
      if (trimmed && !rawRoles.includes(trimmed)) { rawRoles.push(trimmed); const cr = normalizeRole(trimmed); if (cr && !cleanRoles.includes(cr)) cleanRoles.push(cr); }
    }
  }

  const categoryKey = primaryRole || "";
  const classification = classifyPerson(categoryKey);
  const roleCategory = classification.category;

  const signatureHeroes: string[] = [];
  for (let i = 1; i <= 5; i++) {
    const key = `signatureHero${i}`;
    const val = extradata[key] || extradata[`signaturehero${i}`];
    if (val && typeof val === "string" && val.trim()) {
      signatureHeroes.push(val.trim());
    }
  }

  const pagename = raw.pagename || raw.id || "";
  const nicknameReadable = pagenameToReadable(pagename) || raw.name || "Unknown";
  const teamRaw = raw.teampagename || null;
  const teamReadable = teamRaw ? pagenameToReadable(teamRaw) : null;

  return {
    id: pagename || raw.name || String(Math.random()),
    nickname: nicknameReadable,
    nicknameRaw: pagename || null,
    realName: raw.name || null,
    nationality: raw.nationality || null,
    region: raw.region || null,
    status: raw.status || null,
    teamReference: teamReadable,
    teamReferenceRaw: teamRaw,
    teamReferenceReadable: teamReadable,
    teamTemplate: raw.teamtemplate || null,
    primaryRole,
    primaryRoleRaw: rawPrimaryRole,
    secondaryRole,
    secondaryRoleRaw: rawSecondaryRole,
    roles: cleanRoles,
    rolesRaw: rawRoles,
    roleCategory,
    isProPlayer: classification.isProPlayer,
    isTeamStaff: classification.isTeamStaff,
    isBroadcastTalent: classification.isBroadcastTalent,
    isNeedsReview: classification.isNeedsReview,
    classificationReason: classification.reason,
    signatureHeroes,
    links: normalizeLinks(raw.links),
    sourceName: "Liquipedia",
    sourceUrl: pagename ? `https://liquipedia.net/mobilelegends/${encodeURIComponent(pagename)}` : null,
  };
}

export function normalizeTeam(raw: any): NormalizedTeam {
  const pagename = raw.pagename || raw.template || raw.name || "";
  const nameReadable = raw.name || pagenameToReadable(pagename) || "Unknown";

  let logoUrl = raw.logourl || raw.logodarkurl || raw.textlesslogourl || null;
  if (logoUrl && !logoUrl.startsWith("http")) {
    logoUrl = `https://liquipedia.net${logoUrl}`;
  }

  let darkLogoUrl = raw.logodarkurl || null;
  if (darkLogoUrl && !darkLogoUrl.startsWith("http")) {
    darkLogoUrl = `https://liquipedia.net${darkLogoUrl}`;
  }

  let textlessLogoUrl = raw.textlesslogourl || null;
  if (textlessLogoUrl && !textlessLogoUrl.startsWith("http")) {
    textlessLogoUrl = `https://liquipedia.net${textlessLogoUrl}`;
  }

  return {
    id: pagename || raw.name || String(Math.random()),
    name: nameReadable,
    nameReadable,
    pagename,
    pagenameRaw: pagename,
    region: raw.region || null,
    status: raw.status || null,
    template: raw.template || null,
    logoUrl,
    darkLogoUrl,
    textlessLogoUrl,
    links: normalizeLinks(raw.links),
    sourceName: "Liquipedia",
    sourceUrl: pagename ? `https://liquipedia.net/mobilelegends/${encodeURIComponent(pagename)}` : null,
  };
}

// ─── Public Types ───────────────────────────────────────────────────────────

export interface NormalizedPlayer {
  id: string;
  nickname: string;
  nicknameRaw: string | null;
  realName: string | null;
  nationality: string | null;
  region: string | null;
  status: string | null;
  teamReference: string | null;
  teamReferenceRaw: string | null;
  teamReferenceReadable: string | null;
  teamTemplate: string | null;
  primaryRole: string | null;
  primaryRoleRaw: string | null;
  secondaryRole: string | null;
  secondaryRoleRaw: string | null;
  roles: string[];
  rolesRaw: string[];
  roleCategory: string;
  isProPlayer: boolean;
  isTeamStaff: boolean;
  isBroadcastTalent: boolean;
  isNeedsReview: boolean;
  classificationReason: string;
  signatureHeroes: string[];
  links: { type: string; url: string }[];
  sourceName: string;
  sourceUrl: string | null;
}

export interface NormalizedTeam {
  id: string;
  name: string;
  nameReadable: string;
  pagename: string;
  pagenameRaw: string;
  region: string | null;
  status: string | null;
  template: string | null;
  logoUrl: string | null;
  darkLogoUrl: string | null;
  textlessLogoUrl: string | null;
  links: { type: string; url: string }[];
  sourceName: string;
  sourceUrl: string | null;
}

// ─── Service Functions ──────────────────────────────────────────────────────

export async function fetchPlayers(options: {
  nationality?: string;
  status?: string;
  role?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<{ players: NormalizedPlayer[]; total: number }> {
  const limit = Math.min(Math.max(options.limit || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(options.offset || 0, 0);

  const conditions: string[] = [];
  if (options.nationality) conditions.push(`[[nationality::${options.nationality}]]`);
  if (options.status) conditions.push(`[[status::${options.status}]]`);
  if (options.role) conditions.push(`[[extradata_role::${options.role}]]`);

  const query = "name,pagename,nationality,region,status,teampagename,teamtemplate,links,extradata";

  const data = await fetchLiquipediaV3("player", {
    query,
    conditions: conditions.length > 0 ? conditions.join("") : undefined,
    limit,
    offset,
  });

  let players = (data.result || []).map(normalizePlayer);

  // Client-side category filter (post-fetch)
  if (options.category && options.category !== "all") {
    players = players.filter((p) => p.roleCategory === options.category);
  }

  return { players, total: players.length };
}

export async function fetchTeams(options: {
  status?: string;
  region?: string;
  limit?: number;
  offset?: number;
}): Promise<{ teams: NormalizedTeam[]; total: number }> {
  const limit = Math.min(Math.max(options.limit || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const offset = Math.max(options.offset || 0, 0);

  const conditions: string[] = [];
  if (options.status) conditions.push(`[[status::${options.status}]]`);
  if (options.region) conditions.push(`[[region::${options.region}]]`);

  const query = "name,pagename,region,logourl,logodarkurl,textlesslogourl,status,template,links,extradata";

  const data = await fetchLiquipediaV3("team", {
    query,
    conditions: conditions.length > 0 ? conditions.join("") : undefined,
    limit,
    offset,
  });

  const teams = (data.result || []).map(normalizeTeam);

  return { teams, total: teams.length };
}

export function clearLiquipediaCache(): number {
  const size = cache.size;
  cache.clear();
  return size;
}

export function getLiquipediaCacheStats(): { entries: number; keys: string[] } {
  return { entries: cache.size, keys: Array.from(cache.keys()) };
}

export function pagenameToReadable(pagename: string): string {
  if (!pagename) return "";
  // Remove disambiguation suffix: Daniel_(Indonesian_player) -> Daniel
  // But keep normal parentheses like Team_(org)
  let s = pagename.replace(/_\([^)]*(?:player|coach|caster|analyst|commentator)[^)]*\)/gi, "");
  // Replace remaining underscores with spaces
  s = s.replace(/_/g, " ");
  return s.trim();
}

export { fetchLiquipediaV3 };
