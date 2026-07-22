import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../lib/api";
import { Clock, Trophy, Users, Zap, Radio, Calendar, Timer, Shield, AlertTriangle, Info } from "lucide-react";

const COUNTRY_FLAGS: Record<string, string> = {
  IDN: "🇮🇩", ID: "🇮🇩", PHI: "🇵🇭", SGP: "🇸🇬", MAS: "🇲🇾", MY: "🇲🇾",
  CAM: "🇰🇭", KHM: "🇰🇭", MMR: "🇲🇲", MYA: "🇲🇲", LAO: "🇱🇦", VIE: "🇻🇳", VNM: "🇻🇳",
  THA: "🇹🇭", KSA: "🇸🇦", OMN: "🇴🇲", JOR: "🇯🇴", ARE: "🇦🇪", UAE: "🇦🇪",
  IRI: "🇮🇷", IRN: "🇮🇷", UZB: "🇺🇿", KGZ: "🇰🇬", PAK: "🇵🇰", HKG: "🇭🇰",
  TLS: "🇹🇱", BRN: "🇧🇳",
};

function getFlag(code: string): string { return COUNTRY_FLAGS[code.toUpperCase()] || ""; }

interface MatchTeam { name: string; shortName: string; score: number | null; logoUrl: string; logoSource: string | null; }
interface Match { id: string; sourceMode: string; status: string; statusLabel: string; startTime: string | null; startTimestamp: number; startTimeWIB: string | null; teamA: MatchTeam; teamB: MatchTeam; matchTitle: string; bestOf: number | string | null; bestOfLabel: string; tournament: string; eventId: string; tier: string; winner?: string; }
interface EventInfo { id: string; name: string; matchCount: number; upcomingCount: number; ongoingCount: number; completedCount: number; selected?: boolean; }
interface HubData { ok: boolean; sourceMode: string; sourceLabel?: string; publicVisible: boolean; showCountdown: boolean; fromCache?: boolean; cooldownRemainingSeconds?: number; stats: { upcoming: number; ongoing: number; completed: number; selectedEvents: number }; events: EventInfo[]; matches: Match[]; message?: string; warning?: string; }
type StatusFilter = "all" | "upcoming" | "ongoing" | "completed";

function useCountdown(targetTimestamp: number | null) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    if (!targetTimestamp) { setRemaining(""); return; }
    const update = () => { const diff = targetTimestamp - Date.now(); if (diff <= 0) { setRemaining("Started"); return; } const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000); setRemaining(`${h}h ${m}m ${s}s`); };
    update(); const id = setInterval(update, 1000); return () => clearInterval(id);
  }, [targetTimestamp]);
  return remaining;
}

function Countdown({ targetTimestamp }: { targetTimestamp: number | null }) {
  const display = useCountdown(targetTimestamp);
  if (!display || display === "Started") return <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1"><Radio className="h-3 w-3 animate-pulse" /> Live now</span>;
  return <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1"><Timer className="h-3 w-3" /> {display}</span>;
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = { upcoming: "bg-blue-500/15 text-blue-400 border border-blue-500/25", ongoing: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25", completed: "bg-gray-500/15 text-gray-400 border border-gray-500/25" };
  const labels: Record<string, string> = { upcoming: "Upcoming", ongoing: "Live / Updating", completed: "Completed" };
  return (<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles[status] || styles.completed}`}>{status === "ongoing" && <Radio className="h-2.5 w-2.5 animate-pulse" />}{labels[status] || status}</span>);
}

function TeamInitials({ team }: { team: MatchTeam }) {
  const [failed, setFailed] = useState(false);
  const shortCode = team.shortName.length <= 4 ? team.shortName.toUpperCase() : team.shortName.slice(0, 4).toUpperCase();
  const flag = getFlag(team.shortName);
  if (team.logoUrl && !failed) return <img src={team.logoUrl} alt={team.shortName} className="h-8 w-8 object-contain rounded" onError={() => setFailed(true)} />;
  return (
    <div className="flex items-center gap-1.5">
      {flag && <span className="text-lg leading-none">{flag}</span>}
      <div className="h-8 w-8 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/[0.08]">
        <span className="text-[10px] font-bold text-gray-400">{shortCode}</span>
      </div>
    </div>
  );
}

function MatchCard({ match, showCountdown }: { match: Match; showCountdown: boolean }) {
  const isUpcoming = match.status === "upcoming";
  const isOngoing = match.status === "ongoing";
  const isCompleted = match.status === "completed";
  const isLocalSeed = match.sourceMode === "local-seed-historical";
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border p-4 transition-all duration-200 hover:border-white/[0.15] hover:shadow-lg hover:shadow-black/20"
      style={{ background: isOngoing ? "rgba(34,197,94,0.04)" : "rgba(255,255,255,0.025)", borderColor: isOngoing ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-medium text-gray-400 truncate max-w-[220px]">{match.tournament}</span>
          {match.bestOfLabel && <span className="text-[9px] font-mono text-gray-500 px-1.5 py-0.5 rounded bg-white/[0.05]">{match.bestOfLabel}</span>}
        </div>
        <StatusPill status={match.status} />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <TeamInitials team={match.teamA} />
          <div className="min-w-0"><div className="text-sm font-bold text-white truncate">{match.teamA.name}</div><div className="text-[9px] text-gray-500 font-mono uppercase">{match.teamA.shortName}</div></div>
        </div>
        <div className="flex flex-col items-center shrink-0 px-3 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
          {(isCompleted || isOngoing) && (match.teamA.score !== null || match.teamB.score !== null) ? (
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{match.teamA.score ?? 0}</span>
              <span className="text-xs text-gray-500 font-bold">-</span>
              <span className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{match.teamB.score ?? 0}</span>
            </div>
          ) : <span className="text-sm font-bold text-gray-400" style={{ fontFamily: "var(--font-display)" }}>VS</span>}
        </div>
        <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
          <div className="text-right min-w-0"><div className="text-sm font-bold text-white truncate">{match.teamB.name}</div><div className="text-[9px] text-gray-500 font-mono uppercase">{match.teamB.shortName}</div></div>
          <TeamInitials team={match.teamB} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500"><Clock className="h-3 w-3" /><span>{match.startTimeWIB || "—"}</span></div>
        <div className="flex items-center gap-2">
          {showCountdown && isUpcoming && match.startTimestamp > Date.now() && <Countdown targetTimestamp={match.startTimestamp} />}
          {isOngoing && <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1"><Radio className="h-3 w-3 animate-pulse" /> Live</span>}
          {isCompleted && match.winner && <span className="text-[10px] text-amber-400/80 font-medium">Winner: {match.winner}</span>}
          {isLocalSeed && <span className="text-[9px] text-gray-600 italic" title="Local historical seed data">seed</span>}
        </div>
      </div>
    </motion.div>
  );
}

function SourceBanner({ sourceMode, sourceLabel, warning }: { sourceMode: string; sourceLabel?: string; warning?: string }) {
  if (sourceMode === "liquipedia-api-live") return null;
  if (sourceMode === "local-seed-historical") return (
    <div className="mb-4 px-4 py-3 rounded-lg bg-amber-950/30 border border-amber-900/30 flex items-center gap-3">
      <Info className="h-4 w-4 text-amber-400 shrink-0" />
      <div className="text-xs text-amber-300">
        <p className="font-medium">Historical local seed — {sourceLabel || "MPL S17"}</p>
        <p className="text-amber-400/60 text-[10px] mt-0.5">Not current Asian Games live data. Sync via API for current matches.</p>
      </div>
    </div>
  );
  if (sourceMode === "error" && warning) return (
    <div className="mb-4 px-4 py-3 rounded-lg bg-red-950/30 border border-red-900/30 flex items-center gap-3">
      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
      <p className="text-xs text-red-300">{warning}</p>
    </div>
  );
  return null;
}

export default function LiveMatchHub() {
  const [data, setData] = useState<HubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(); params.set("status", "all"); params.set("limit", "30");
      if (selectedEvent !== "all") params.set("event", selectedEvent);
      const res = await fetch(apiUrl(`/api/liquipedia/live-hub?${params.toString()}`));
      const json = await res.json();
      setData(json); setError(json.warning || null);
      if (statusFilter === null) { const s = json.stats || {}; if (s.ongoing > 0) setStatusFilter("ongoing"); else if (s.upcoming > 0) setStatusFilter("upcoming"); else if (s.completed > 0) setStatusFilter("completed"); else setStatusFilter("all"); }
    } catch { setError("Failed to load match data."); if (statusFilter === null) setStatusFilter("all"); } finally { setLoading(false); }
  }, [selectedEvent, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { const id = setInterval(loadData, 120000); return () => clearInterval(id); }, [loadData]);

  const filteredMatches = useMemo(() => { if (!data?.matches) return []; return statusFilter === "all" ? data.matches : data.matches.filter((m) => m.status === statusFilter); }, [data?.matches, statusFilter]);
  const stats = data?.stats || { upcoming: 0, ongoing: 0, completed: 0, selectedEvents: 0 };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4"><Zap className="h-3.5 w-3.5 text-blue-400" /><span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">Live Match Hub</span></div>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>MLBB Live Match Hub</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">Upcoming, live, and completed matches. Data from Liquipedia — may update based on contributors.</p>
      </motion.div>

      <SourceBanner sourceMode={data?.sourceMode || "empty"} sourceLabel={data?.sourceLabel} warning={error || data?.warning || undefined} />

      {data && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[{ label: "Upcoming", value: stats.upcoming, icon: <Calendar className="h-4 w-4 text-blue-400" /> }, { label: "Live", value: stats.ongoing, icon: <Radio className="h-4 w-4 text-emerald-400" /> }, { label: "Completed", value: stats.completed, icon: <Trophy className="h-4 w-4 text-amber-400" /> }, { label: "Events", value: stats.selectedEvents, icon: <Users className="h-4 w-4 text-purple-400" /> }].map((c) => (
            <div key={c.label} className="rounded-xl p-3 text-center border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}><div className="flex items-center justify-center gap-1.5 mb-1">{c.icon}<span className="text-[10px] text-gray-500">{c.label}</span></div><div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{c.value}</div></div>
          ))}
        </motion.div>
      )}

      {data?.fromCache && <div className="text-center mb-3 text-[10px] text-gray-600">Cached · sync in {Math.ceil((data.cooldownRemainingSeconds || 0) / 60)}m</div>}

      <div className="flex items-center gap-2 mb-5 justify-center flex-wrap">
        {([ { id: "all" as StatusFilter, label: "All", count: stats.upcoming + stats.ongoing + stats.completed }, { id: "upcoming" as StatusFilter, label: "Upcoming", count: stats.upcoming }, { id: "ongoing" as StatusFilter, label: "Live", count: stats.ongoing }, { id: "completed" as StatusFilter, label: "Completed", count: stats.completed } ]).map((tab) => (
          <button key={tab.id} onClick={() => setStatusFilter(tab.id)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${statusFilter === tab.id ? "bg-blue-600 text-white" : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]"}`}>{tab.label} <span className="text-[9px] opacity-60">({tab.count})</span></button>
        ))}
      </div>

      {data?.events && data.events.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5 justify-center">
          <button onClick={() => setSelectedEvent("all")} className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all border ${selectedEvent === "all" ? "bg-white/10 text-white border-white/20" : "bg-transparent text-gray-500 border-white/[0.06] hover:text-white hover:border-white/[0.15]"}`}>All Events</button>
          {data.events.slice(0, 8).map((ev) => (<button key={ev.id} onClick={() => setSelectedEvent(selectedEvent === ev.id ? "all" : ev.id)} className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all border ${selectedEvent === ev.id ? "bg-blue-600/20 text-blue-300 border-blue-500/30" : "bg-transparent text-gray-500 border-white/[0.06] hover:text-white hover:border-white/[0.15]"}`}>{ev.name} ({ev.matchCount})</button>))}
        </div>
      )}

      {loading && <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" /></div>}

      {!loading && filteredMatches.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Shield className="h-10 w-10 mx-auto mb-3 text-gray-600" />
          <p className="text-sm font-medium">No {statusFilter === "all" ? "matches" : statusFilter} right now.</p>
          <p className="text-xs text-gray-600 mt-1">{statusFilter === "upcoming" ? `Try All (${stats.upcoming + stats.ongoing + stats.completed}) or Completed (${stats.completed}).` : statusFilter === "ongoing" ? `Try All (${stats.upcoming + stats.ongoing + stats.completed}) or Completed (${stats.completed}).` : "No match data available."}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>{filteredMatches.map((m) => <MatchCard key={m.id} match={m} showCountdown={data?.showCountdown ?? true} />)}</AnimatePresence>
      </div>

      <div className="text-center mt-10 text-[10px] text-gray-600">Data source: <a href="https://liquipedia.net/mobilelegends" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">Liquipedia</a>. Match information may update based on Liquipedia contributors.</div>
    </section>
  );
}
