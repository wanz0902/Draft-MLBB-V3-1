import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../lib/api";
import { getPlayerPhoto } from "../data/playerPhotoOverrides";
import { getTeamLogoAsset } from "../data/esportsAssetOverrides";
import {
  Users,
  Trophy,
  Search,
  Globe,
  Shield,
  Swords,
  ExternalLink,
  AlertCircle,
  Loader2,
  User as UserIcon,
  Mic,
  Briefcase,
  MapPin,
  Database,
  Eye,
  HelpCircle,
  X,
  ChevronRight,
  Link as LinkIcon,
  Award,
  Star,
  Zap,
  Target,
  BarChart3,
  Crown,
  Medal,
  Calendar,
  Hash,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface NormalizedPlayer {
  id: string;
  nickname: string;
  nicknameRaw?: string | null;
  realName: string | null;
  nationality: string | null;
  region: string | null;
  status: string | null;
  teamReference: string | null;
  teamReferenceReadable?: string | null;
  teamReferenceRaw?: string | null;
  teamTemplate: string | null;
  primaryRole: string | null;
  primaryRoleRaw?: string | null;
  secondaryRole: string | null;
  secondaryRoleRaw?: string | null;
  roles: string[];
  rolesRaw?: string[];
  roleCategory: string;
  isProPlayer?: boolean;
  isTeamStaff?: boolean;
  isBroadcastTalent?: boolean;
  isNeedsReview?: boolean;
  classificationReason?: string;
  signatureHeroes: string[];
  links: { type: string; url: string }[];
  sourceName: string;
  sourceUrl: string | null;
}

interface NormalizedTeam {
  id: string;
  name: string;
  nameReadable?: string;
  pagename: string;
  pagenameRaw?: string;
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

interface FilterOptions {
  players: { nationalities: string[]; regions: string[]; statuses: string[]; roles: string[]; categories: string[] };
  teams: { regions: string[]; statuses: string[] };
}

interface CategoryCounts {
  pro_player: number;
  team_staff: number;
  broadcast_talent: number;
  needs_review: number;
}

type TabId = "pro_player" | "team_staff" | "broadcast_talent" | "needs_review" | "teams";

// ─── Constants ──────────────────────────────────────────────────────────────

const ROLE_BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  gold: { bg: "bg-yellow-500/15", text: "text-yellow-300", border: "border-yellow-500/30" },
  exp: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30" },
  mid: { bg: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-500/30" },
  roamer: { bg: "bg-cyan-500/15", text: "text-cyan-300", border: "border-cyan-500/30" },
  jungler: { bg: "bg-green-500/15", text: "text-green-300", border: "border-green-500/30" },
  coach: { bg: "bg-purple-500/15", text: "text-purple-300", border: "border-purple-500/30" },
  analyst: { bg: "bg-indigo-500/15", text: "text-indigo-300", border: "border-indigo-500/30" },
  manager: { bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30" },
  caster: { bg: "bg-pink-500/15", text: "text-pink-300", border: "border-pink-500/30" },
  commentator: { bg: "bg-orange-500/15", text: "text-orange-300", border: "border-orange-500/30" },
  host: { bg: "bg-teal-500/15", text: "text-teal-300", border: "border-teal-500/30" },
  "content creator": { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  observer: { bg: "bg-slate-500/15", text: "text-slate-300", border: "border-slate-500/30" },
};

const CATEGORY_META: Record<TabId, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  pro_player: { label: "Pro Players", icon: <Swords className="h-3.5 w-3.5" />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  team_staff: { label: "Team Staff", icon: <Briefcase className="h-3.5 w-3.5" />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  broadcast_talent: { label: "Broadcast Talent", icon: <Mic className="h-3.5 w-3.5" />, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
  needs_review: { label: "Needs Review", icon: <HelpCircle className="h-3.5 w-3.5" />, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  teams: { label: "Teams", icon: <Trophy className="h-3.5 w-3.5" />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
};

const ROLE_LABELS: Record<string, string> = {
  gold: "Gold", exp: "EXP", mid: "Mid", roamer: "Roamer", jungler: "Jungler",
  coach: "Coach", analyst: "Analyst", manager: "Manager",
  caster: "Caster", commentator: "Commentator", host: "Host", "content creator": "Content Creator", observer: "Observer",
};
const PLAYER_ROLES = ["gold", "exp", "mid", "roamer", "jungler"];
const STAFF_ROLES = ["coach", "analyst", "manager"];
const TALENT_ROLES = ["caster", "commentator", "host", "content creator", "observer"];

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-300 outline-none focus:border-blue-600 transition min-w-0">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── Team logo join helper ──────────────────────────────────────────────────

function findTeamForPlayer(player: NormalizedPlayer, teams: NormalizedTeam[]): NormalizedTeam | null {
  if (!teams.length) return null;
  const template = (player.teamTemplate || "").toLowerCase();
  const refRaw = (player.teamReferenceRaw || player.teamReference || "").toLowerCase().replace(/\s+/g, "_");
  const refReadable = (player.teamReferenceReadable || player.teamReference || "").toLowerCase();
  for (const t of teams) {
    const tTemplate = (t.template || "").toLowerCase();
    const tPagename = (t.pagename || "").toLowerCase();
    const tName = (t.nameReadable || t.name || "").toLowerCase();
    if (template && tTemplate && template === tTemplate) return t;
    if (refRaw && tPagename && refRaw === tPagename) return t;
    if (refReadable && tName && refReadable === tName) return t;
  }
  return null;
}

function getTeamLogo(team: NormalizedTeam | null): string | null {
  if (!team) return null;
  const url = team.logoUrl || team.darkLogoUrl || team.textlessLogoUrl || null;
  if (!url) return null;
  // Block external liquipedia hotlink URLs — they get blocked by hotlink protection
  if (url.includes("liquipedia.net")) return null;
  return url;
}

function getTeamInitials(name: string | null | undefined): string {
  if (!name) return "??";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function TeamLogoImg({ src, name, size = "h-10 w-10", className = "" }: { src: string | null; name: string | null; size?: string; className?: string }) {
  const [failed, setFailed] = React.useState(false);
  const initials = getTeamInitials(name);
  if (!src || failed) {
    return (
      <div className={`${size} rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center justify-center shrink-0 ${className}`}>
        <span className="text-xs font-bold text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{initials}</span>
      </div>
    );
  }
  return (
    <img src={src} alt={name || ""} className={`${size} object-contain rounded-lg ${className}`}
      onError={() => setFailed(true)} />
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function LiquipediaDatabase() {
  const [activeTab, setActiveTab] = useState<TabId>("pro_player");
  const [players, setPlayers] = useState<NormalizedPlayer[]>([]);
  const [teams, setTeams] = useState<NormalizedTeam[]>([]);
  const [allTeams, setAllTeams] = useState<NormalizedTeam[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [playersError, setPlayersError] = useState<string | null>(null);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [playersLoaded, setPlayersLoaded] = useState(false);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [snapshotMissing, setSnapshotMissing] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [playersCount, setPlayersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({ pro_player: 0, team_staff: 0, broadcast_talent: 0, needs_review: 0 });

  // Detail view state
  const [selectedPlayer, setSelectedPlayer] = useState<NormalizedPlayer | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<NormalizedTeam | null>(null);

  // Player filters
  const [pNationality, setPNationality] = useState("");
  const [pRegion, setPRegion] = useState("");
  const [pRole, setPRole] = useState("");
  const [pStatus, setPStatus] = useState("");
  const [pSearch, setPSearch] = useState("");
  const [pLimit, setPLimit] = useState(50);
  const [pOffset, setPOffset] = useState(0);
  const [pTotal, setPTotal] = useState(0);

  // Team filters
  const [tRegion, setTRegion] = useState("");
  const [tStatus, setTStatus] = useState("");
  const [tSearch, setTSearch] = useState("");
  const [tLimit, setTLimit] = useState(50);
  const [tOffset, setTOffset] = useState(0);
  const [tTotal, setTTotal] = useState(0);

  const activeCategory = activeTab === "teams" ? null : activeTab;

  // ─── Load status + filters + all teams (for logo join) ────────────────

  const loadStatus = useCallback(async () => {
    try {
      const [statusRes, filtersRes, teamsRes] = await Promise.all([
        fetch(apiUrl("/api/liquipedia/status")),
        fetch(apiUrl("/api/liquipedia/filters")),
        fetch(apiUrl("/api/liquipedia/teams?limit=500&offset=0")),
      ]);
      const statusData = await statusRes.json();
      const filtersData = await filtersRes.json();
      const teamsData = await teamsRes.json();
      if (statusData.ok) {
        setSnapshotMissing(!statusData.hasPlayersSnapshot && !statusData.hasTeamsSnapshot);
        setLastSyncedAt(statusData.lastSyncedAt || null);
        setPlayersCount(statusData.playersCount || 0);
        setTeamsCount(statusData.teamsCount || 0);
        if (statusData.categoryCounts) setCategoryCounts(statusData.categoryCounts);
      }
      if (filtersData.ok) setFilterOptions(filtersData);
      if (teamsData.ok && teamsData.teams) setAllTeams(teamsData.teams);
    } catch {}
  }, []);

  // ─── Load players ──────────────────────────────────────────────────────

  const loadPlayers = useCallback(async (append = false) => {
    if (!activeCategory) return;
    setPlayersLoading(true);
    setPlayersError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(pLimit));
      params.set("offset", String(append ? pOffset : 0));
      params.set("category", activeCategory);
      if (pNationality) params.set("nationality", pNationality);
      if (pRegion) params.set("region", pRegion);
      if (pStatus) params.set("status", pStatus);
      if (pRole) params.set("role", pRole);
      if (pSearch.trim()) params.set("search", pSearch.trim());

      const res = await fetch(apiUrl(`/api/liquipedia/players?${params.toString()}`));
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);

      const result = data.players || [];
      setPlayers(append ? [...players, ...result] : result);
      setPTotal(data.total || 0);
      setPOffset((append ? pOffset : 0) + result.length);
      setPlayersLoaded(true);
      if (data.lastSyncedAt) setLastSyncedAt(data.lastSyncedAt);
    } catch (err: any) {
      setPlayersError(err.message || "Failed to load players");
    } finally {
      setPlayersLoading(false);
    }
  }, [activeCategory, pNationality, pRegion, pStatus, pRole, pSearch, pLimit, pOffset, players]);

  // ─── Load teams ────────────────────────────────────────────────────────

  const loadTeams = useCallback(async (append = false) => {
    setTeamsLoading(true);
    setTeamsError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", String(tLimit));
      params.set("offset", String(append ? tOffset : 0));
      if (tRegion) params.set("region", tRegion);
      if (tStatus) params.set("status", tStatus);
      if (tSearch.trim()) params.set("search", tSearch.trim());

      const res = await fetch(apiUrl(`/api/liquipedia/teams?${params.toString()}`));
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);

      const result = data.teams || [];
      setTeams(append ? [...teams, ...result] : result);
      setTTotal(data.total || 0);
      setTOffset((append ? tOffset : 0) + result.length);
      setTeamsLoaded(true);
      if (data.lastSyncedAt) setLastSyncedAt(data.lastSyncedAt);
    } catch (err: any) {
      setTeamsError(err.message || "Failed to load teams");
    } finally {
      setTeamsLoading(false);
    }
  }, [tRegion, tStatus, tSearch, tLimit, tOffset, teams]);

  // ─── Effects ───────────────────────────────────────────────────────────

  useEffect(() => { loadStatus(); }, [loadStatus]);

  useEffect(() => {
    setPlayersLoaded(false); setPOffset(0);
    setTeamsLoaded(false); setTOffset(0);
  }, [activeTab]);

  useEffect(() => {
    if (snapshotMissing) return;
    if (activeCategory && !playersLoaded && !playersLoading) loadPlayers();
    if (activeTab === "teams" && !teamsLoaded && !teamsLoading) loadTeams();
  }, [activeTab, activeCategory, playersLoaded, teamsLoaded, playersLoading, teamsLoading, loadPlayers, loadTeams, snapshotMissing]);

  useEffect(() => { if (activeCategory) { setPlayersLoaded(false); setPOffset(0); setPRole(""); } }, [pNationality, pRegion, pStatus, pLimit]);
  useEffect(() => { setTeamsLoaded(false); setTOffset(0); }, [tRegion, tStatus, tLimit]);

  // Close detail on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setSelectedPlayer(null); setSelectedTeam(null); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ─── Filter options ────────────────────────────────────────────────────

  const fo = filterOptions;
  const nationalityOpts = useMemo(() => {
    if (!fo) return [{ value: "", label: "All Countries" }];
    return [{ value: "", label: "All Countries" }, ...fo.players.nationalities.map((n) => ({ value: n, label: n }))];
  }, [fo]);
  const pRegionOpts = useMemo(() => fo ? [{ value: "", label: "All Regions" }, ...fo.players.regions.map((r) => ({ value: r, label: r }))] : [{ value: "", label: "All Regions" }], [fo]);
  const pRoleOpts = useMemo(() => {
    let roles: string[];
    if (activeCategory === "pro_player") roles = PLAYER_ROLES;
    else if (activeCategory === "team_staff") roles = STAFF_ROLES;
    else if (activeCategory === "broadcast_talent") roles = TALENT_ROLES;
    else roles = [...PLAYER_ROLES, ...STAFF_ROLES, ...TALENT_ROLES];
    return [{ value: "", label: "All Roles" }, ...roles.map((r) => ({ value: r, label: ROLE_LABELS[r] || r }))];
  }, [activeCategory]);
  const pStatusOpts = useMemo(() => {
    const statuses = fo?.players.statuses || [];
    return [{ value: "", label: "All Statuses" }, ...statuses.map((s) => ({ value: s, label: s }))];
  }, [fo]);
  const tRegionOpts = useMemo(() => fo ? [{ value: "", label: "All Regions" }, ...fo.teams.regions.map((r) => ({ value: r, label: r }))] : [{ value: "", label: "All Regions" }], [fo]);
  const tStatusOpts = useMemo(() => {
    const statuses = fo?.teams.statuses || ["active", "disbanded"];
    return [{ value: "", label: "All Statuses" }, ...statuses.map((s) => ({ value: s, label: s }))];
  }, [fo]);

  const totalPeople = categoryCounts.pro_player + categoryCounts.team_staff + categoryCounts.broadcast_talent + categoryCounts.needs_review;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-400" />
          MLBB Pro Database
        </h2>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-800/30 font-mono">Local Snapshot</span>
          {totalPeople > 0 && <span className="text-[10px] text-gray-400">{totalPeople} People · {teamsCount} Teams</span>}
          {lastSyncedAt && (
            <span className="text-[10px] text-gray-500">
              · Last synced: {new Date(lastSyncedAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        {totalPeople > 0 && (
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-[9px] text-emerald-400/70">{categoryCounts.pro_player} Pro Players</span>
            <span className="text-[9px] text-purple-400/70">{categoryCounts.team_staff} Staff</span>
            <span className="text-[9px] text-pink-400/70">{categoryCounts.broadcast_talent} Talent</span>
          </div>
        )}
        <p className="text-[10px] text-gray-500 mt-1">
          Player and team profile data from{" "}
          <a href="https://liquipedia.net/mobilelegends" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Liquipedia</a>
          {" "}· Not endorsed by Liquipedia.
        </p>
      </div>

      {snapshotMissing && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-950/30 border border-amber-900/40 text-amber-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Local Snapshot unavailable · Players: 0 · Teams: 0</p>
            <p className="text-xs text-amber-400 mt-1">
              Jalankan <code className="bg-amber-900/30 px-1 rounded">npm run sync:liquipedia</code> setelah API key valid.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-800 overflow-x-auto">
        {(["pro_player", "team_staff", "broadcast_talent", "teams"] as TabId[]).map((tabId) => {
          const meta = CATEGORY_META[tabId];
          const count = tabId === "teams" ? teamsCount : (categoryCounts as any)[tabId] || 0;
          return (
            <button key={tabId} onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tabId ? `border-blue-500 ${meta.color}` : "border-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {meta.icon}{meta.label}
              {count > 0 && <span className="text-[9px] font-mono opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* ═══ PEOPLE TABS ═══ */}
      {activeCategory && !snapshotMissing && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input type="text" placeholder="Search name, team..." value={pSearch}
                onChange={(e) => setPSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setPlayersLoaded(false); setPOffset(0); } }}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-600 transition" />
            </div>
            <Select value={pNationality} onChange={setPNationality} options={nationalityOpts} />
            <Select value={pRegion} onChange={setPRegion} options={pRegionOpts} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={pRole} onChange={setPRole} options={pRoleOpts} />
            <Select value={pStatus} onChange={setPStatus} options={pStatusOpts} />
            <Select value={String(pLimit)} onChange={(v) => setPLimit(Number(v))} options={[{ value: "20", label: "Per page: 20" }, { value: "50", label: "Per page: 50" }, { value: "100", label: "Per page: 100" }, { value: "200", label: "Per page: 200" }]} />
          </div>

          {playersLoading && <div className="flex items-center justify-center gap-2 py-12 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Loading...</span></div>}

          {playersError && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/30 border border-red-900/40 text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Failed to load</p>
                <p className="text-xs text-red-400 mt-1">{playersError}</p>
                <button onClick={() => { setPlayersLoaded(false); loadPlayers(); }} className="text-xs text-red-300 underline mt-2 hover:text-red-200">Retry</button>
              </div>
            </div>
          )}

          {playersLoaded && !playersLoading && !playersError && players.length === 0 && (
            <div className="text-center py-12 text-gray-500"><Users className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No {CATEGORY_META[activeTab].label.toLowerCase()} found.</p><p className="text-xs text-gray-600 mt-1">Try adjusting your filters.</p></div>
          )}

          {players.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-gray-400">Showing {players.length} of {pTotal} {CATEGORY_META[activeTab].label.toLowerCase()}</span>
                {pTotal < totalPeople && <span className="text-gray-600">· Snapshot total: {totalPeople} people</span>}
              </div>
              <motion.div variants={cardContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {players.map((p) => (
                  <motion.div key={p.id} variants={cardItem}>
                    <PlayerPreviewCard person={p} matchedTeam={findTeamForPlayer(p, allTeams)} onClick={() => setSelectedPlayer(p)} />
                  </motion.div>
                ))}
              </motion.div>
              {players.length < pTotal ? (
                <button onClick={() => loadPlayers(true)} disabled={playersLoading}
                  className="mt-2 px-4 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition disabled:opacity-50">
                  {playersLoading ? "Loading..." : `Load more (${players.length}/${pTotal})`}
                </button>
              ) : playersLoaded && pTotal > 0 ? (
                <p className="text-[11px] text-gray-600 text-center">All loaded</p>
              ) : null}
            </>
          )}
          <Attribution type={CATEGORY_META[activeTab].label} />
        </div>
      )}

      {/* ═══ TEAMS TAB ═══ */}
      {activeTab === "teams" && !snapshotMissing && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input type="text" placeholder="Search teams..." value={tSearch}
                onChange={(e) => setTSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setTeamsLoaded(false); setTOffset(0); } }}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-600 transition" />
            </div>
            <Select value={tRegion} onChange={setTRegion} options={tRegionOpts} />
            <Select value={tStatus} onChange={setTStatus} options={tStatusOpts} />
            <Select value={String(tLimit)} onChange={(v) => setTLimit(Number(v))} options={[{ value: "20", label: "Per page: 20" }, { value: "50", label: "Per page: 50" }, { value: "100", label: "Per page: 100" }]} />
          </div>

          {teamsLoading && <div className="flex items-center justify-center gap-2 py-12 text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Loading teams...</span></div>}

          {teamsError && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/30 border border-red-900/40 text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Failed to load teams</p>
                <p className="text-xs text-red-400 mt-1">{teamsError}</p>
                <button onClick={() => { setTeamsLoaded(false); loadTeams(); }} className="text-xs text-red-300 underline mt-2 hover:text-red-200">Retry</button>
              </div>
            </div>
          )}

          {teamsLoaded && !teamsLoading && !teamsError && teams.length === 0 && (
            <div className="text-center py-12 text-gray-500"><Trophy className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No teams found.</p></div>
          )}

          {teams.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-gray-400">Showing {teams.length} of {tTotal} teams</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {teams.map((t, i) => (
                  <TeamPreviewCard key={t.id} team={t} onClick={() => setSelectedTeam(t)} index={i} />
                ))}
              </div>
              {teams.length < tTotal ? (
                <button onClick={() => loadTeams(true)} disabled={teamsLoading}
                  className="mt-2 px-4 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition disabled:opacity-50">
                  {teamsLoading ? "Loading..." : `Load more teams (${teams.length}/${tTotal})`}
                </button>
              ) : teamsLoaded && tTotal > 0 ? (
                <p className="text-[11px] text-gray-600 text-center">All loaded</p>
              ) : null}
            </>
          )}
          <Attribution type="Teams" />
        </div>
      )}

      {/* ═══ DETAIL DRAWERS ═══ */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerDetailDrawer
            key={selectedPlayer.id}
            person={selectedPlayer}
            matchedTeam={findTeamForPlayer(selectedPlayer, allTeams)}
            allTeams={allTeams}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </AnimatePresence>
      {selectedTeam && (
        <TeamDetailDrawer
          team={selectedTeam}
          allPlayers={players}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}

function Attribution({ type }: { type: string }) {
  return (
    <p className="text-[10px] text-gray-600 text-center mt-2">
      {type} data from{" "}
      <a href="https://liquipedia.net/mobilelegends" target="_blank" rel="noopener noreferrer" className="text-blue-500/70 hover:underline">Liquipedia</a>
      . Not endorsed by Liquipedia.
    </p>
  );
}

// ─── Player Preview Card ────────────────────────────────────────────────────

const ACCENT_HEX: Record<string, string> = {
  gold: "#eab308", exp: "#ef4444", mid: "#3b82f6", roamer: "#06b6d4", jungler: "#22c55e",
  coach: "#a855f7", analyst: "#6366f1", manager: "#8b5cf6",
  caster: "#ec4899", commentator: "#f97316", host: "#14b8a6", "content creator": "#f59e0b", observer: "#64748b",
};

const TEAM_ACCENT: Record<string, { primary: string; glow: string }> = {
  onic: { primary: "#facc15", glow: "rgba(250,204,21,0.15)" },
  "fnatic onic": { primary: "#facc15", glow: "rgba(250,204,21,0.15)" },
  rrq: { primary: "#f97316", glow: "rgba(249,115,22,0.15)" },
  "rrq hoshi": { primary: "#f97316", glow: "rgba(249,115,22,0.15)" },
  evos: { primary: "#a855f7", glow: "rgba(168,85,247,0.15)" },
  bigetron: { primary: "#ef4444", glow: "rgba(239,68,68,0.15)" },
  "team liquid": { primary: "#3b82f6", glow: "rgba(59,130,246,0.15)" },
  "alter ego": { primary: "#22c55e", glow: "rgba(34,197,94,0.15)" },
  "geek fam": { primary: "#ec4899", glow: "rgba(236,72,153,0.15)" },
  "dewa united": { primary: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
};

function getTeamAccent(teamName: string | null | undefined): { primary: string; glow: string } {
  if (!teamName) return { primary: "#3b82f6", glow: "rgba(59,130,246,0.1)" };
  const lower = teamName.toLowerCase();
  for (const [key, val] of Object.entries(TEAM_ACCENT)) {
    if (lower.includes(key)) return val;
  }
  return { primary: "#3b82f6", glow: "rgba(59,130,246,0.1)" };
}

const cardContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

function PlayerPreviewCard({ person, matchedTeam, onClick }: { person: NormalizedPlayer; matchedTeam: NormalizedTeam | null; onClick: () => void }) {
  const rc = person.primaryRole ? ROLE_BADGE_COLORS[person.primaryRole.toLowerCase()] : null;
  const catMeta = CATEGORY_META[person.roleCategory as TabId] || CATEGORY_META.needs_review;
  const initials = (person.nickname || "??").slice(0, 2).toUpperCase();
  const team = person.teamReferenceReadable || person.teamReference;
  const teamLogo = getTeamLogo(matchedTeam);
  const photoConfig = getPlayerPhoto(person.nickname);
  const accent = ACCENT_HEX[person.primaryRole || ""] || "#64748b";
  const heroCount = person.signatureHeroes?.length || 0;

  return (
    <motion.button type="button" onClick={onClick}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-full text-left rounded-2xl overflow-hidden cursor-pointer group flex flex-col transition-all duration-300 hover:shadow-[0_12px_48px_-12px_var(--glow)]"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accent}12 0%, transparent 50%), linear-gradient(180deg, ${accent}08 0%, rgba(10,15,30,0.98) 100%)`,
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px) saturate(1.8)",
          "--glow-color": `${accent}30`,
        } as React.CSSProperties}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px -8px ${accent}30, 0 12px 32px rgba(0,0,0,0.4)`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
      >
        {/* ═══ PHOTO AREA ═══ */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#080c18]">
          <div className="absolute inset-0 z-[1] pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 25%, ${accent}15 0%, transparent 55%)` }} />

          {photoConfig ? (
            <motion.img
              layoutId={`player-photo-${person.id}`}
              src={photoConfig.src}
              alt={person.nickname}
              className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              style={{
                objectFit: "cover",
                objectPosition: photoConfig.objectPosition || "center 20%",
                transform: `scale(${photoConfig.scale || 1}) translate(${photoConfig.offsetX || 0}px, ${photoConfig.offsetY || 0}px)`,
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[2]">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-25 rounded-full" style={{ background: accent, transform: "scale(2.5)" }} />
                <div className="text-7xl sm:text-8xl font-black tracking-tighter opacity-[0.12] select-none relative"
                  style={{ color: accent, fontFamily: "var(--font-display)" }}>
                  {initials}
                </div>
              </div>
              <div className="h-px w-24 mt-4 opacity-[0.08]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            </div>
          )}

          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-20 z-[3] pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(8,12,24,0.75) 0%, transparent 100%)" }} />

          {/* Deep bottom nameplate gradient */}
          <div className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none"
            style={{ height: "60%", background: "linear-gradient(0deg, rgba(8,12,24,0.99) 0%, rgba(8,12,24,0.92) 35%, rgba(8,12,24,0.5) 65%, transparent 100%)" }} />

          {/* Badges */}
          <div className="absolute top-3 right-3 z-[4]">
            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md ${catMeta.bg} ${catMeta.color} ${catMeta.border} border`}>
              {catMeta.label}
            </span>
          </div>
          {person.status && (
            <div className="absolute top-3 left-3 z-[4]">
              <motion.span layoutId={`player-status-${person.id}`}
                className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md ${
                  person.status.toLowerCase() === "active" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                }`}>{person.status}</motion.span>
            </div>
          )}

          {/* Nameplate */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-[5]">
            <div className="flex items-center gap-2 mb-0.5">
              {person.primaryRole && (
                <motion.span layoutId={`player-role-${person.id}`}
                  className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded backdrop-blur-sm"
                  style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}>
                  {ROLE_LABELS[person.primaryRole] || person.primaryRole}
                </motion.span>
              )}
            </div>
            <motion.h3 layoutId={`player-name-${person.id}`}
              className="text-xl sm:text-2xl font-black text-white truncate leading-tight group-hover:text-blue-200 transition-colors duration-300"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.6)" }}>
              {person.nickname}
            </motion.h3>
            {person.realName && person.realName !== person.nickname && (
              <p className="text-[11px] text-gray-300/80 truncate mt-0.5" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
                {person.realName}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {person.nationality && (
                <span className="text-[9px] text-gray-300/80 flex items-center gap-1" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  <Globe className="h-2.5 w-2.5 shrink-0" />{person.nationality}
                </span>
              )}
              {team && (
                <span className="text-[9px] text-gray-300/80 flex items-center gap-1 ml-auto truncate" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {teamLogo ? (
                    <img src={teamLogo} alt="" className="h-3 w-3 object-contain rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : <Shield className="h-2.5 w-2.5 shrink-0" />}
                  <span className="truncate">{team}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ═══ FOOTER: STATS + HEROES + CTA ═══ */}
        <div className="px-3.5 pb-3 pt-2.5 flex flex-col gap-2">
          {/* Mini stats row — Phase 1 card-metric classes */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "Heroes", value: heroCount || "—", icon: <Star className="h-2.5 w-2.5 text-amber-400" /> },
              { label: "Role", value: ROLE_LABELS[person.primaryRole || ""] || "—", icon: <Zap className="h-2.5 w-2.5" style={{ color: accent }} /> },
              { label: "Category", value: catMeta.label.split(" ")[0] || "—", icon: <Award className="h-2.5 w-2.5 text-purple-400" /> },
            ].map((s) => (
              <div key={s.label} className="card-metric px-2 py-1.5 text-center">
                <div className="metric-label flex items-center justify-center gap-0.5">{s.icon}{s.label}</div>
                <div className="metric-value text-xs text-white truncate">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Signature heroes */}
          {person.signatureHeroes && person.signatureHeroes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {person.signatureHeroes.slice(0, 3).map((h) => (
                <span key={h} className="px-1.5 py-0.5 rounded text-[7px] bg-blue-900/20 text-blue-300/70 border border-blue-800/20">{h}</span>
              ))}
              {person.signatureHeroes.length > 3 && (
                <span className="px-1 py-0.5 rounded text-[7px] text-gray-600">+{person.signatureHeroes.length - 3}</span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-1 text-[8px] text-gray-600 group-hover:text-blue-400/70 transition-colors pt-0.5">
            <Eye className="h-3 w-3" />
            <span>View Profile</span>
            <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </motion.button>
    );
}

// ─── Player Intelligence Dossier ────────────────────────────────────────────

const dossierContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const dossierItem = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

function deriveStats(achievements: any[]) {
  const firsts = achievements.filter((a: any) => (a.place || "").toLowerCase().includes("1st") || (a.place || "").toLowerCase() === "1").length;
  const seconds = achievements.filter((a: any) => (a.place || "").toLowerCase().includes("2nd") || (a.place || "").toLowerCase() === "2").length;
  const sTier = achievements.filter((a: any) => (a.tier || "").toLowerCase().includes("s-tier")).length;
  const aTier = achievements.filter((a: any) => (a.tier || "").toLowerCase().includes("a-tier")).length;
  const tierBreakdown: Record<string, number> = {};
  achievements.forEach((a: any) => { const t = a.tier || "Unknown"; tierBreakdown[t] = (tierBreakdown[t] || 0) + 1; });
  const placementBreakdown: Record<string, number> = {};
  achievements.forEach((a: any) => { const p = a.place || "Unknown"; placementBreakdown[p] = (placementBreakdown[p] || 0) + 1; });
  const yearlyActivity: Record<string, number> = {};
  achievements.forEach((a: any) => { const y = (a.date || "").slice(0, 4); if (y) yearlyActivity[y] = (yearlyActivity[y] || 0) + 1; });
  return { firsts, seconds, sTier, aTier, tierBreakdown, placementBreakdown, yearlyActivity };
}

function buildSummary(person: NormalizedPlayer, stats: ReturnType<typeof deriveStats>, awardsCount: number, heroCount: number): string {
  const role = ROLE_LABELS[person.primaryRole || ""] || person.primaryRole || "Player";
  const parts: string[] = [];
  parts.push(`${person.nickname} is an ${(person.nationality || "").toLowerCase() || ""} ${role}`);
  const total = stats.firsts + stats.seconds;
  if (total > 0) parts.push(`with ${total} top-2 placement${total !== 1 ? "s" : ""}`);
  if (awardsCount > 0) parts.push(`${awardsCount} individual award${awardsCount !== 1 ? "s" : ""}`);
  if (heroCount > 0) parts.push(`and ${heroCount} signature hero${heroCount !== 1 ? "es" : ""}`);
  parts.push("in competitive MLBB history.");
  return parts.join(" ");
}

function PlayerDetailDrawer({ person, matchedTeam, allTeams, onClose }: { person: NormalizedPlayer; matchedTeam: NormalizedTeam | null; allTeams: NormalizedTeam[]; onClose: () => void }) {
  const rc = person.primaryRole ? ROLE_BADGE_COLORS[person.primaryRole.toLowerCase()] : null;
  const catMeta = CATEGORY_META[person.roleCategory as TabId] || CATEGORY_META.needs_review;
  const initials = (person.nickname || "??").slice(0, 2).toUpperCase();
  const team = person.teamReferenceReadable || person.teamReference;
  const teamLogo = getTeamLogo(matchedTeam);
  const photoConfig = getPlayerPhoto(person.nickname);
  const accent = ACCENT_HEX[person.primaryRole || ""] || "#64748b";

  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "awards" | "statistics" | "history">("overview");
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setDetailLoading(true);
    fetch(apiUrl(`/api/liquipedia/player-detail?nickname=${encodeURIComponent(person.nickname)}`))
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.ok) setDetail(d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [person.nickname]);

  const placements = detail?.placements || [];
  const transfers = detail?.transfers || [];
  const squadHistory = detail?.squadHistory || [];
  const missingSections: string[] = detail?.missingSections || [];
  const heroCount = person.signatureHeroes?.length || 0;
  const scraped = detail?.scrapedDetail || null;
  const scrapedInfo = scraped?.info || null;
  const scrapedSocial = scraped?.socialLinks || [];
  const scrapedTrivia = scraped?.trivia || [];
  const scrapedStats = scraped?.statistics || [];
  const scrapedAchievements = scraped?.achievements || [];
  const scrapedAwards = scraped?.awards || [];

  const teamHistory = useMemo(() => {
    const entries: { team: string; date: string; role?: string; type: string }[] = [];
    for (const t of transfers) entries.push({ team: t.team || t.teampagename || "?", date: t.date || "", type: "transfer" });
    for (const s of squadHistory) entries.push({ team: s.team || s.teampagename || "?", date: s.datejoin || "", role: s.role || undefined, type: "roster" });
    return entries.sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 20);
  }, [transfers, squadHistory]);

  const getMedalIcon = (placement: string): React.ReactNode => {
    const p = (placement || "").toLowerCase();
    if (p.includes("1st") || p === "1") return <Medal className="w-5 h-5 text-yellow-400" />;
    if (p.includes("2nd") || p === "2") return <Medal className="w-5 h-5 text-slate-300" />;
    if (p.includes("3rd") || p === "3") return <Medal className="w-5 h-5 text-amber-600" />;
    return <Trophy className="w-5 h-5 text-amber-400" />;
  };

  const allAchievements = scrapedAchievements.length > 0 ? scrapedAchievements : placements;
  const derived = useMemo(() => deriveStats(allAchievements), [allAchievements]);
  const summary = useMemo(() => buildSummary(person, derived, scrapedAwards.length, heroCount), [person, derived, scrapedAwards.length, heroCount]);
  const heroSources = scrapedInfo?.signatureHeroes || person.signatureHeroes || [];
  const socialSources = [...scrapedSocial, ...(person.links || []).filter((l) => !scrapedSocial.some((s: any) => s.url === l.url))];
  const teamAccent = getTeamAccent(team);
  const teamColor = teamAccent.primary;

  // Stats tab data
  const tierEntries = Object.entries(derived.tierBreakdown).sort((a, b) => b[1] - a[1]);
  const maxTier = tierEntries.length > 0 ? tierEntries[0][1] : 1;
  const placementEntries = Object.entries(derived.placementBreakdown).sort((a, b) => b[1] - a[1]);
  const maxPlacement = placementEntries.length > 0 ? placementEntries[0][1] : 1;
  const yearEntries = Object.entries(derived.yearlyActivity).sort((a, b) => a[0].localeCompare(b[0]));
  const maxYear = yearEntries.length > 0 ? Math.max(...yearEntries.map((e) => e[1])) : 1;
  const yearsActive = yearEntries.length;

  const TABS = [
    { id: "overview" as const, label: "Overview", icon: <Eye className="h-3.5 w-3.5" /> },
    { id: "achievements" as const, label: "Achievements", icon: <Trophy className="h-3.5 w-3.5" />, count: allAchievements.length || undefined },
    { id: "awards" as const, label: "Awards", icon: <Award className="h-3.5 w-3.5" />, count: scrapedAwards.length || undefined },
    { id: "statistics" as const, label: "Statistics", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { id: "history" as const, label: "Team History", icon: <Users className="h-3.5 w-3.5" />, count: teamHistory.length || undefined },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{
        background: `linear-gradient(160deg, ${teamAccent.glow} 0%, transparent 40%), linear-gradient(180deg, #0c1220 0%, #080c14 100%)`,
        backdropFilter: "blur(32px)",
      }}
    >
      {/* Team watermark */}
      {(getTeamLogoAsset(team)?.src || teamLogo) && (
        <div className="fixed top-0 right-0 opacity-[0.02] pointer-events-none z-0" style={{ width: 400, height: 400 }}>
          <TeamLogoImg src={getTeamLogoAsset(team)?.src || teamLogo} name={team} size="w-full h-full" />
        </div>
      )}

      {/* TOP BAR — accounts for navbar height */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] shrink-0 relative z-10" style={{ marginTop: "var(--navbar-height, 48px)" }}>
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition cursor-pointer rounded-lg px-2 py-1 hover:bg-white/[0.04]">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back
        </button>
        <span className="text-[10px] uppercase tracking-widest text-gray-600" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>Scouting Dossier</span>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition cursor-pointer hover:bg-white/[0.06]">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">

        {/* ═══ LEFT: PLAYER POSTER RAIL ═══ */}
        <div className="lg:w-[320px] xl:w-[360px] shrink-0 relative overflow-hidden lg:h-full flex flex-col">
          {/* Photo Area — dominant hero visual */}
          <div className="relative flex-1 min-h-[320px] lg:min-h-0">
            {/* Background atmosphere */}
            <div className="absolute inset-0 z-[1] pointer-events-none" style={{
              background: `
                radial-gradient(ellipse at 50% 30%, ${accent}18 0%, transparent 60%),
                radial-gradient(circle at 80% 90%, ${teamColor}0a 0%, transparent 40%),
                linear-gradient(180deg, rgba(8,12,24,0.3) 0%, transparent 25%, rgba(8,12,24,0.5) 60%, rgba(8,12,24,0.98) 100%)
              `,
            }} />
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />

            {photoConfig ? (
              <motion.img layoutId={`player-photo-${person.id}`} src={photoConfig.src} alt={person.nickname}
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: "cover", objectPosition: photoConfig.objectPosition || "center 20%", transform: `scale(${photoConfig.scale || 1})` }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl opacity-25 rounded-full" style={{ background: teamColor, transform: "scale(3)" }} />
                  <div className="text-8xl font-black tracking-tighter opacity-[0.1] select-none" style={{ color: teamColor, fontFamily: "var(--font-display)" }}>{initials}</div>
                </div>
              </div>
            )}

            {/* Bottom gradient — deep nameplate zone */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-[2]" style={{
              height: "55%",
              background: "linear-gradient(to top, #0c1220 0%, rgba(12,18,32,0.88) 25%, rgba(12,18,32,0.5) 55%, transparent 100%)",
            }} />

            {/* ═══ IDENTITY PLATE ═══ */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
              {/* Role + Status badges */}
              <div className="flex items-center gap-1.5 mb-2">
                {person.primaryRole && (
                  <motion.span layoutId={`player-role-${person.id}`}
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                    style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}35`, boxShadow: `0 0 12px ${accent}15` }}>
                    {ROLE_LABELS[person.primaryRole] || person.primaryRole}
                  </motion.span>
                )}
                {person.status && (
                  <motion.span layoutId={`player-status-${person.id}`}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      person.status.toLowerCase() === "active" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                    }`}>{person.status}</motion.span>
                )}
              </div>

              {/* Nickname — dominant identity */}
              <motion.h2 layoutId={`player-name-${person.id}`}
                className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight"
                style={{ fontFamily: "var(--font-display)", textShadow: `0 4px 24px rgba(0,0,0,0.9), 0 0 30px ${accent}20` }}>
                {person.nickname}
              </motion.h2>

              {person.realName && person.realName !== person.nickname && (
                <p className="text-[13px] text-gray-300/90 mt-1 font-medium">{person.realName}</p>
              )}

              {/* Country + Team — clean row */}
              <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                {person.nationality && (
                  <span className="text-[11px] text-gray-300 flex items-center gap-1.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    <Globe className="h-3.5 w-3.5 text-gray-400" />{person.nationality}
                  </span>
                )}
                {team && (
                  <span className="text-[11px] flex items-center gap-1.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    {teamLogo ? (
                      <img src={teamLogo} alt="" className="h-4 w-4 object-contain rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : <Shield className="h-3.5 w-3.5 text-gray-400" />}
                    <span className="font-semibold" style={{ color: teamColor }}>{team}</span>
                  </span>
                )}
              </div>

              {/* Passport stat chips */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: "Heroes", value: heroCount || "—" },
                  { label: "Role", value: ROLE_LABELS[person.primaryRole || ""] || "—" },
                  { label: "Earnings", value: scrapedInfo?.totalWinnings || "—" },
                ].map((s) => (
                  <div key={s.label} className="text-center rounded-lg py-2 px-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="text-[8px] text-gray-500 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</div>
                    <div className="text-sm font-bold text-white mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: EDITORIAL CONTENT CANVAS ═══ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Dossier Header — bold esports profile */}
          <div className="px-5 pt-6 pb-4 border-b shrink-0 relative overflow-hidden" style={{ borderColor: `${accent}18`, background: `linear-gradient(180deg, ${accent}08 0%, transparent 100%)` }}>
            {/* Accent glow line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${accent}60, transparent 60%)` }} />

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}>Scouting Dossier</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}30, transparent 50%)` }} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em", textShadow: `0 2px 8px ${accent}15` }}>
                  {person.nickname}
                </h2>
                {person.realName && person.realName !== person.nickname && (
                  <p className="text-sm text-gray-400 mt-0.5">{person.realName}</p>
                )}
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed max-w-lg">{summary}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <TeamLogoImg src={getTeamLogoAsset(team)?.src || teamLogo} name={team} size="h-12 w-12" className="opacity-60 rounded-xl" />
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ color: teamColor, background: `${teamColor}12`, border: `1px solid ${teamColor}25` }}>
                  {team}
                </span>
              </div>
            </div>

            {/* Career metrics — bold stat cards */}
            <motion.div variants={dossierContainer} initial="hidden" animate="visible" className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Featured: Championship */}
              <motion.div variants={dossierItem} className="col-span-2 card-metric-accent rounded-xl p-4 relative overflow-hidden" style={{ "--accent-color": "#22c55e" } as React.CSSProperties}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, rgba(34,197,94,0.06) 0%, transparent 60%)` }} />
                <div className="relative flex items-center gap-4">
                  <div className="flex items-center gap-3"><Crown className="h-5 w-5 text-emerald-400" /><div><div className="metric-value text-2xl text-white">{derived.firsts}</div><div className="metric-label">Champion</div></div></div>
                  <div className="w-px h-10 bg-white/[0.06]" />
                  <div className="flex items-center gap-3"><Medal className="h-5 w-5 text-blue-400" /><div><div className="metric-value text-2xl text-white">{derived.seconds}</div><div className="metric-label">Runner-up</div></div></div>
                  <div className="w-px h-10 bg-white/[0.06]" />
                  <div className="flex items-center gap-3"><Trophy className="h-5 w-5 text-amber-400" /><div><div className="metric-value text-2xl text-white">{allAchievements.length}</div><div className="metric-label">Total</div></div></div>
                </div>
              </motion.div>
              {/* Supporting stats */}
              {[
                { label: "Heroes", value: heroCount || "—", icon: <Star className="h-4 w-4 text-amber-400" /> },
                { label: "Awards", value: scrapedAwards.length || "—", icon: <Award className="h-4 w-4 text-amber-400" /> },
                { label: "Years", value: yearsActive || "—", icon: <Calendar className="h-4 w-4 text-blue-400" /> },
              ].map((card) => (
                <motion.div key={card.label} variants={dossierItem} className="card-metric rounded-xl p-3.5 text-center relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)` }} />
                  <div className="relative flex items-center justify-center gap-1.5 mb-1">{card.icon}<span className="metric-label">{card.label}</span></div>
                  <div className="metric-value text-xl text-white">{card.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Tab Navigation — strong pill style */}
          <div className="flex items-center gap-1 px-5 py-2.5 border-b border-white/[0.06] overflow-x-auto shrink-0" style={{ background: "rgba(255,255,255,0.015)" }}>
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
                style={activeTab === tab.id ? { background: `${accent}15`, border: `1px solid ${accent}30`, color: "white" } : {}}>
                {tab.icon}{tab.label}
                {tab.count !== undefined && <span className="text-[9px] font-mono opacity-50">({tab.count})</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <AnimatePresence mode="wait">
              {/* ═══ OVERVIEW ═══ */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left column: Identity + Trivia */}
                  <div className="space-y-4">
                    {/* Player Profile Card */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <SectionHeader icon={<UserIcon className="h-3.5 w-3.5 text-blue-400" />} label="Player Profile" />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {scrapedInfo?.born && <InfoField label="Born" value={scrapedInfo.born} />}
                        <InfoField label="Role" value={ROLE_LABELS[person.primaryRole || ""] || scrapedInfo?.role || "—"} />
                        <InfoField label="Status" value={person.status || "—"} />
                        {scrapedInfo?.alternateIds?.length > 0 && <InfoField label="Also known" value={scrapedInfo.alternateIds.join(", ")} />}
                        <InfoField label="Country" value={person.nationality || "—"} />
                        <InfoField label="Region" value={person.region || "—"} />
                      </div>
                    </motion.div>

                    {/* Team Reference */}
                    {team && (() => {
                      const assetLogo = getTeamLogoAsset(team);
                      const logoSrc = assetLogo?.src || teamLogo;
                      return (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-4 rounded-xl flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${teamAccent.glow} 0%, rgba(255,255,255,0.02) 100%)`, border: `1px solid ${teamAccent.primary}15` }}>
                          {logoSrc ? <TeamLogoImg src={logoSrc} name={team} size="h-12 w-12" className="bg-white/[0.03] p-1" /> : <div className="h-12 w-12 rounded-xl bg-gray-800/50 flex items-center justify-center"><Shield className="h-6 w-6 text-gray-600" /></div>}
                          <div>
                            <div className="text-base font-bold" style={{ fontFamily: "var(--font-display)", color: teamColor }}>{team}</div>
                            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>Team Reference</div>
                          </div>
                        </motion.div>
                      );
                    })()}

                    {/* Trivia */}
                    {scrapedTrivia.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <SectionHeader icon={<Zap className="h-3.5 w-3.5 text-amber-400" />} label="Trivia" />
                        <div className="space-y-2">
                          {scrapedTrivia.map((t: string, i: number) => (
                            <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
                              className="text-[11px] text-gray-300 leading-relaxed flex gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                              <span className="text-amber-400 shrink-0">💡</span>{t}
                            </motion.p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right column: Heroes + Social + Source */}
                  <div className="space-y-4">
                    {/* Signature Heroes */}
                    {heroSources.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <SectionHeader icon={<Star className="h-3.5 w-3.5 text-amber-400" />} label="Signature Heroes" />
                        <div className="flex flex-wrap gap-2">
                          {heroSources.map((h: string, i: number) => (
                            <motion.span key={h} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.05, type: "spring", stiffness: 400 }}
                              whileHover={{ scale: 1.08, backgroundColor: "rgba(59,130,246,0.18)" }}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-default transition-colors"
                              style={{ background: "rgba(59,130,246,0.08)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.12)" }}>{h}</motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Social Links */}
                    {socialSources.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <SectionHeader icon={<LinkIcon className="h-3.5 w-3.5 text-blue-400" />} label="Social Links" />
                        <div className="flex flex-wrap gap-2">
                          {socialSources.map((l: any, i: number) => (
                            <motion.a key={i} href={l.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition px-3 py-2 rounded-xl"
                              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
                              <LinkIcon className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{l.platform || l.type}</span><ExternalLink className="h-3 w-3 text-gray-600 shrink-0" />
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Scouting Note */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${accent}06 0%, rgba(255,255,255,0.02) 100%)`, border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>Scouting Note</span>
                      </div>
                      <p className="text-[12px] text-gray-300 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>{summary}</p>
                    </motion.div>

                    {/* Source */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="pt-2">
                      <p className="text-[10px] text-gray-500">Data from <a href={person.sourceUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500/70 hover:underline">Liquipedia</a> · Not endorsed by Liquipedia.</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* ═══ ACHIEVEMENTS ═══ */}
              {activeTab === "achievements" && (
                <motion.div key="achievements" initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.3 }} className="space-y-5">
                  {/* Trophy Summary — card-metric-accent for championships */}
                  <motion.div variants={dossierContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: "1st Place", value: derived.firsts, icon: <div className="bg-yellow-500/10 p-2 rounded-full"><Medal className="w-6 h-6 text-yellow-400" /></div>, highlight: true },
                      { label: "2nd Place", value: derived.seconds, icon: <div className="bg-slate-400/10 p-2 rounded-full"><Medal className="w-6 h-6 text-slate-300" /></div>, highlight: false },
                      { label: "S-Tier", value: derived.sTier, icon: <div className="bg-cyan-500/10 p-2 rounded-full"><Zap className="w-6 h-6 text-cyan-400" /></div>, highlight: false },
                      { label: "A-Tier", value: derived.aTier, icon: <div className="bg-amber-500/10 p-2 rounded-full"><Trophy className="w-6 h-6 text-amber-400" /></div>, highlight: false },
                      { label: "Total", value: allAchievements.length, icon: <div className="bg-blue-500/10 p-2 rounded-full"><BarChart3 className="w-6 h-6 text-blue-400" /></div>, highlight: false },
                    ].map((card) => (
                      <motion.div key={card.label} variants={dossierItem}
                        className={`rounded-xl p-3 text-center ${card.highlight ? "card-metric-accent" : "card-metric"}`}
                        style={card.highlight ? { "--accent-color": "#22c55e" } as React.CSSProperties : {}}>
                        <div className="flex justify-center mb-1">{card.icon}</div>
                        <div className="metric-value text-xl text-white">{card.value}</div>
                        <div className="metric-label">{card.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Placement Breakdown Chart */}
                  {placementEntries.length > 1 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <SectionHeader icon={<BarChart3 className="h-3.5 w-3.5 text-blue-400" />} label="Placement Breakdown" />
                      <div className="space-y-2">
                        {placementEntries.slice(0, 6).map(([place, count], i) => (
                          <div key={place} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 w-12 shrink-0 text-right font-mono">{place}</span>
                            <div className="flex-1 h-4 bg-white/[0.03] rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxPlacement) * 100}%` }} transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                                className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accent}80, ${accent}40)` }} />
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 w-6 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Career Timeline — timeline-row classes */}
                  {allAchievements.length > 0 ? (
                    <div className="space-y-0 rounded-xl overflow-hidden card-command-center p-1">
                      <SectionHeader icon={<Trophy className="h-3.5 w-3.5 text-amber-400" />} label={`Career Timeline — ${allAchievements.length} tournaments`} />
                      <div className="max-h-[50vh] overflow-y-auto pr-1">
                        {allAchievements.slice(0, 30).map((a: any, i: number) => {
                          const placeColor = (a.place || "").includes("1st") ? "#22c55e" : (a.place || "").includes("2nd") ? "#3b82f6" : (a.place || "").includes("3rd") ? "#eab308" : "#6b7280";
                          const isTop = (a.place || "").includes("1st") || (a.place || "").includes("2nd");
                          return (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10px" }}
                              transition={{ duration: 0.4, delay: i * 0.03, type: "spring" as const, stiffness: 200 }}
                              className="timeline-row px-3 rounded-lg transition-colors"
                              style={{ background: isTop ? `${placeColor}08` : "transparent" }}>
                              <div className="timeline-dot" style={{ background: placeColor, boxShadow: isTop ? `0 0 8px ${placeColor}40` : "none" }} />
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
                                style={{ background: `${placeColor}12`, border: `1px solid ${placeColor}20` }}>
                                {getMedalIcon(a.place)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold truncate" style={{ color: placeColor, fontFamily: "var(--font-display)" }}>{a.placementname || a.place || "—"}</span>
                                  {a.tier && <span className="text-[8px] font-mono text-gray-500 px-1 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>{a.tier}</span>}
                                </div>
                                <div className="text-[10px] text-gray-400 truncate">{a.pagetournament || a.tournament || "—"}</div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-[10px] text-gray-400">{a.team || "—"}</div>
                                <div className="text-[9px] text-gray-600 font-mono">{a.date || ""}</div>
                                {a.prize && <div className="text-[9px] text-emerald-400 font-mono">{a.prize}</div>}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <PremiumEmptyState icon={<Trophy className="h-8 w-8" />} title="Achievement data pending" subtitle="Sync or enrich this profile from verified sources." />
                  )}
                </motion.div>
              )}

              {/* ═══ AWARDS ═══ */}
              {activeTab === "awards" && (
                <motion.div key="awards" initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.3 }}>
                  {scrapedAwards.length > 0 ? (
                    <div className="space-y-4">
                      {/* Awards Summary — card-metric */}
                      <motion.div variants={dossierContainer} initial="hidden" animate="visible" className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Total Awards", value: scrapedAwards.length, icon: <Award className="h-3 w-3 text-amber-400" /> },
                          { label: "Latest", value: scrapedAwards[0]?.date || "—", icon: <Calendar className="h-3 w-3 text-blue-400" /> },
                          { label: "Latest Type", value: scrapedAwards[0]?.award?.split(" ").slice(0, 2).join(" ") || "—", icon: <Star className="h-3 w-3 text-amber-400" /> },
                        ].map((card) => (
                          <motion.div key={card.label} variants={dossierItem} className="card-metric p-3 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">{card.icon}<span className="metric-label">{card.label}</span></div>
                            <div className="metric-value text-sm text-white truncate">{card.value}</div>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Awards grouped by type */}
                      {(() => {
                        const groups: Record<string, any[]> = {};
                        scrapedAwards.forEach((a: any) => {
                          const type = a.award?.includes("MVP") ? "MVP" : a.award?.includes("First Team") ? "First Team" : a.award?.includes("Team of the Week") ? "Team of the Week" : "Other";
                          if (!groups[type]) groups[type] = [];
                          groups[type].push(a);
                        });
                        const groupOrder = ["MVP", "First Team", "Team of the Week", "Other"];
                        return groupOrder.filter((g) => groups[g]?.length).map((groupName, gi) => (
                          <div key={groupName}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold text-gray-400" style={{ fontFamily: "var(--font-mono)" }}>{groupName}</span>
                              <span className="text-[9px] text-gray-600">({groups[groupName].length})</span>
                              <div className="flex-1 h-px bg-white/[0.04]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {groups[groupName].map((a: any, i: number) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                  transition={{ delay: i * 0.04, type: "spring" as const, stiffness: 300, damping: 20 }}
                                  whileHover={{ scale: 1.02 }}
                                  className="card-metric flex items-center gap-3 p-3 cursor-default">
                                  <div className="shrink-0 bg-amber-500/10 p-2 rounded-full">
                                    {a.award?.includes("MVP") ? <Trophy className="w-5 h-5 text-amber-400" /> : a.award?.includes("First Team") ? <Star className="w-5 h-5 text-yellow-400" /> : <Award className="w-5 h-5 text-amber-300" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-bold text-white truncate">{a.award}</div>
                                    <div className="text-[9px] text-gray-500">{a.tournament} · {a.date}</div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <PremiumEmptyState icon={<Award className="h-8 w-8" />} title="Awards data pending" subtitle="Awards data pending — sync or enrich this profile from verified sources." />
                  )}
                </motion.div>
              )}

              {/* ═══ STATISTICS ═══ */}
              {activeTab === "statistics" && (
                <motion.div key="statistics" initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.3 }} className="space-y-4">
                  {/* Career Summary */}
                  <motion.div variants={dossierContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Placements", value: allAchievements.length || "—", icon: <Trophy className="h-3 w-3 text-amber-400" /> },
                      { label: "Years Active", value: yearsActive || "—", icon: <Calendar className="h-3 w-3 text-blue-400" /> },
                      { label: "Heroes", value: heroCount || "—", icon: <Star className="h-3 w-3 text-amber-400" /> },
                      { label: "Earnings", value: scrapedInfo?.totalWinnings || "No data", icon: <Award className="h-3 w-3 text-emerald-400" /> },
                    ].map((card) => (
                      <motion.div key={card.label} variants={dossierItem} className="card-metric p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">{card.icon}<span className="metric-label">{card.label}</span></div>
                        <div className="metric-value text-base text-white">{card.value}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Charts side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Tier Distribution */}
                    {tierEntries.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 card-command-center">
                        <SectionHeader icon={<Zap className="h-3.5 w-3.5 text-amber-400" />} label="Tier Distribution" />
                        <div className="space-y-2.5">
                          {tierEntries.map(([tier, count], i) => {
                            const tierColor = tier.includes("S-Tier") ? "#eab308" : tier.includes("A-Tier") ? "#3b82f6" : "#6b7280";
                            return (
                              <div key={tier} className="flex items-center gap-2">
                                <span className="text-[10px] w-14 shrink-0 text-right font-mono" style={{ color: tierColor }}>{tier}</span>
                                <div className="stat-bar flex-1">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxTier) * 100}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                                    className="stat-bar-fill" style={{ background: `linear-gradient(90deg, ${tierColor}80, ${tierColor}40)` }} />
                                </div>
                                <span className="text-[11px] font-mono text-gray-400 w-6 text-right font-bold">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Placement Distribution */}
                    {placementEntries.length > 1 && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-4 card-command-center">
                        <SectionHeader icon={<BarChart3 className="h-3.5 w-3.5 text-blue-400" />} label="Placement Distribution" />
                        <div className="space-y-2.5">
                          {placementEntries.slice(0, 5).map(([place, count], i) => {
                            const placeColor = place.includes("1st") ? "#22c55e" : place.includes("2nd") ? "#3b82f6" : place.includes("3rd") ? "#eab308" : "#6b7280";
                            return (
                              <div key={place} className="flex items-center gap-2">
                                <span className="text-[10px] w-10 shrink-0 text-right font-mono" style={{ color: placeColor }}>{place}</span>
                                <div className="stat-bar flex-1">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxPlacement) * 100}%` }} transition={{ duration: 0.8, delay: 0.25 + i * 0.1 }}
                                    className="stat-bar-fill" style={{ background: `linear-gradient(90deg, ${placeColor}70, ${placeColor}35)` }} />
                                </div>
                                <span className="text-[11px] font-mono text-gray-400 w-6 text-right font-bold">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Yearly Activity — full width */}
                  {yearEntries.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <SectionHeader icon={<Calendar className="h-3.5 w-3.5 text-blue-400" />} label="Career Activity by Year" />
                      <div className="flex items-end gap-1.5 h-24">
                        {yearEntries.map(([year, count], i) => {
                          const heightPct = maxYear > 0 ? (count / maxYear) * 100 : 0;
                          return (
                            <div key={year} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[9px] font-mono text-gray-400">{count}</span>
                              <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(heightPct, 8)}%` }} transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                                className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 min-h-[4px]" />
                              <span className="text-[9px] font-mono text-gray-500">{year}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Scraped Stats */}
                  {scrapedStats.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <SectionHeader icon={<Star className="h-3.5 w-3.5 text-blue-400" />} label="Detailed Statistics" />
                      <div className="space-y-2">
                        {scrapedStats.map((s: string, i: number) => (
                          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
                            className="text-[11px] text-gray-300 leading-relaxed py-2 border-b border-white/[0.03] last:border-0">{s}</motion.p>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {tierEntries.length === 0 && yearEntries.length === 0 && scrapedStats.length === 0 && (
                    <PremiumEmptyState icon={<BarChart3 className="h-8 w-8" />} title="Statistics data limited" subtitle="Detailed statistics will appear when placement and award data is available." />
                  )}
                </motion.div>
              )}

              {/* ═══ TEAM HISTORY ═══ */}
              {activeTab === "history" && (
                <motion.div key="history" initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.3 }}>
                  {teamHistory.length > 0 ? (
                    <div className="space-y-2">
                      <SectionHeader icon={<Users className="h-3.5 w-3.5 text-blue-400" />} label="Team History" />
                      <div className="space-y-2">
                        {teamHistory.map((entry, i) => {
                          const entryTeam = allTeams.find((t) => (t.nameReadable || t.name || "").toLowerCase() === entry.team.toLowerCase() || (t.pagename || "").toLowerCase() === entry.team.toLowerCase().replace(/\s+/g, "_"));
                          const entryLogo = entryTeam ? getTeamLogo(entryTeam) : null;
                          const entryAccent = getTeamAccent(entry.team);
                          return (
                            <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                              transition={{ delay: i * 0.05, type: "spring" as const, stiffness: 200, damping: 24 }}
                              className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/[0.03] transition-colors"
                              style={{ background: i === 0 ? `${entryAccent.glow}` : "transparent", border: i === 0 ? `1px solid ${entryAccent.primary}20` : "1px solid transparent" }}>
                              <div className="flex flex-col items-center shrink-0">
                                <div className="h-3 w-3 rounded-full" style={{ background: i === 0 ? entryAccent.primary : "rgba(255,255,255,0.15)" }} />
                                {i < teamHistory.length - 1 && <div className="w-px h-4 bg-white/[0.08] mt-0.5" />}
                              </div>
                              {entryLogo ? <TeamLogoImg src={entryLogo} name={entry.team} size="h-8 w-8" className="bg-white/[0.03] p-0.5" /> : <div className="h-8 w-8 rounded-lg bg-gray-800/50 flex items-center justify-center shrink-0"><span className="text-[9px] font-bold text-gray-600">{entry.team.slice(0, 2).toUpperCase()}</span></div>}
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-white truncate block" style={{ fontFamily: "var(--font-display)" }}>{entry.team}</span>
                                {entry.role && <span className="text-[9px] text-gray-500">{entry.role}</span>}
                              </div>
                              <span className="text-[10px] text-gray-600 font-mono shrink-0">{entry.date}</span>
                              {i === 0 && <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>Current</span>}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <PremiumEmptyState icon={<Users className="h-8 w-8" />} title="Team history data pending" subtitle="No local team-history snapshot synced yet." />
                      {/* Show current team reference even without history */}
                      {team && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                          className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <SectionHeader icon={<Shield className="h-3.5 w-3.5 text-blue-400" />} label="Current Team Reference" />
                          <div className="flex items-center gap-3">
                            {teamLogo ? <TeamLogoImg src={teamLogo} name={team} size="h-12 w-12" className="bg-white/[0.03] p-1.5" /> : <div className="h-12 w-12 rounded-xl bg-gray-800/50 flex items-center justify-center"><Shield className="h-6 w-6 text-gray-600" /></div>}
                            <div>
                              <div className="text-base font-bold text-white" style={{ fontFamily: "var(--font-display)", color: teamColor }}>{team}</div>
                              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>Current Team</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-blue-500/15 border border-blue-500/30">{icon}</div>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500" style={{ fontFamily: "var(--font-mono)" }}>{label}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent" />
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-xs">
      <span className="text-gray-500">{label}: </span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}

function PremiumEmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="flex flex-col items-center justify-center py-16 rounded-xl text-center"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="text-gray-700 mb-3">{icon}</div>
      <p className="text-sm font-bold text-gray-400" style={{ fontFamily: "var(--font-display)" }}>{title}</p>
      <p className="text-[11px] text-gray-600 mt-1 max-w-xs">{subtitle}</p>
    </motion.div>
  );
}

// ─── Team Preview Card ──────────────────────────────────────────────────────

function TeamPreviewCard({ team, onClick, index = 0 }: { team: NormalizedTeam; onClick: () => void; index?: number }) {
  const logo = team.logoUrl || team.darkLogoUrl || team.textlessLogoUrl;
  const displayName = team.nameReadable || team.name;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02, y: -3 }}
    >
      <button type="button" onClick={onClick}
        className="w-full text-left rounded-xl p-4 cursor-pointer group transition-shadow duration-300"
        style={{
          background: "rgba(14, 24, 40, 0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px) saturate(1.5)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px -4px rgba(59,130,246,0.15), 0 8px 20px rgba(0,0,0,0.3)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
      >
      <div className="flex items-start gap-3">
        {/* Logo */}
        {logo ? (
          <div className="h-14 w-14 rounded-lg bg-white/5 border border-gray-700/50 p-1.5 flex items-center justify-center shrink-0">
            <img src={logo} alt={displayName} className="max-h-full max-w-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        ) : (
          <div className="h-14 w-14 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-gray-600">{displayName.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">{displayName}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            {team.status && (
              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                team.status.toLowerCase() === "active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
              }`}>{team.status}</span>
            )}
            {team.region && <span className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{team.region}</span>}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 mt-1" />
      </div>
    </button>
    </motion.div>
  );
}

// ─── Team Detail Drawer ─────────────────────────────────────────────────────

function TeamDetailDrawer({ team, allPlayers, onClose }: { team: NormalizedTeam; allPlayers: NormalizedPlayer[]; onClose: () => void }) {
  const logo = team.logoUrl || team.darkLogoUrl || team.textlessLogoUrl;
  const displayName = team.nameReadable || team.name;

  // Find related players
  const relatedPlayers = useMemo(() => {
    if (!allPlayers.length) return [];
    const tTemplate = (team.template || "").toLowerCase();
    const tPagename = (team.pagename || "").toLowerCase();
    const tName = displayName.toLowerCase();
    return allPlayers.filter((p) => {
      const pTemplate = (p.teamTemplate || "").toLowerCase();
      const pRefRaw = (p.teamReferenceRaw || p.teamReference || "").toLowerCase().replace(/\s+/g, "_");
      const pRefReadable = (p.teamReferenceReadable || p.teamReference || "").toLowerCase();
      if (tTemplate && pTemplate && tTemplate === pTemplate) return true;
      if (tPagename && pRefRaw && tPagename === pRefRaw) return true;
      if (tName && pRefReadable && tName === pRefReadable) return true;
      return false;
    }).slice(0, 20);
  }, [team, allPlayers, displayName]);

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#0a0f1e] border-l border-gray-800 overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition cursor-pointer z-10">
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-800/60">
          <div className="flex items-start gap-4">
            {logo ? (
              <div className="h-20 w-20 rounded-2xl bg-white/5 border border-gray-700/50 p-2 flex items-center justify-center shrink-0">
                <img src={logo} alt={displayName} className="max-h-full max-w-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-gray-600">{displayName.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-xl font-bold text-white">{displayName}</h2>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {team.status && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    team.status.toLowerCase() === "active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                  }`}>{team.status}</span>
                )}
                {team.region && <span className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{team.region}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Info */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Info</h3>
            <div className="space-y-2">
              {team.template && <div className="text-sm text-gray-300">Template: <span className="text-white">{team.template}</span></div>}
              {team.pagename && <div className="text-sm text-gray-400">Page: {team.pagename}</div>}
            </div>
          </section>

          {/* Logo variants */}
          {(team.darkLogoUrl || team.textlessLogoUrl) && (
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Logo Variants</h3>
              <div className="flex gap-3">
                {team.logoUrl && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-16 w-16 rounded-lg bg-white/5 border border-gray-700/50 p-1.5 flex items-center justify-center">
                      <img src={team.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <span className="text-[8px] text-gray-600">Default</span>
                  </div>
                )}
                {team.darkLogoUrl && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-16 w-16 rounded-lg bg-gray-900 border border-gray-700/50 p-1.5 flex items-center justify-center">
                      <img src={team.darkLogoUrl} alt="Dark Logo" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <span className="text-[8px] text-gray-600">Dark</span>
                  </div>
                )}
                {team.textlessLogoUrl && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-16 w-16 rounded-lg bg-white/5 border border-gray-700/50 p-1.5 flex items-center justify-center">
                      <img src={team.textlessLogoUrl} alt="Textless Logo" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <span className="text-[8px] text-gray-600">Textless</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Links */}
          {team.links && team.links.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Links</h3>
              <div className="space-y-1.5">
                {team.links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition">
                    <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{l.type}</span>
                    <ExternalLink className="h-3 w-3 text-gray-600 shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Related players */}
          {relatedPlayers.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Related Players ({relatedPlayers.length})</h3>
              <div className="space-y-1.5">
                {relatedPlayers.map((p) => {
                  const pRc = p.primaryRole ? ROLE_BADGE_COLORS[p.primaryRole.toLowerCase()] : null;
                  return (
                    <div key={p.id} className="flex items-center gap-2.5 text-sm py-1.5">
                      <div className="h-7 w-7 rounded-md flex items-center justify-center text-[9px] font-bold border bg-slate-800/60 border-slate-700/40 text-slate-400 shrink-0">
                        {(p.nickname || "??").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-white font-medium truncate flex-1">{p.nickname}</span>
                      {p.primaryRole && (
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${pRc?.bg || "bg-gray-700/50"} ${pRc?.text || "text-gray-400"} ${pRc?.border || "border-gray-600/30"}`}>
                          {ROLE_LABELS[p.primaryRole] || p.primaryRole}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Source */}
          <section className="pt-4 border-t border-gray-800/60">
            <p className="text-[10px] text-gray-500">
              Data source:{" "}
              <a href={team.sourceUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500/70 hover:underline">Liquipedia</a>
              {" "}· Not endorsed by Liquipedia.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
