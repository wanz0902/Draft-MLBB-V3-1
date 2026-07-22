import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Swords,
  Trophy,
  Sparkles,
  Cpu,
  History,
  Ghost,
  Shield,
  Target,
  BarChart3,
} from "lucide-react";
import { HeroStats } from "../types";
import heroesMaster from "../data/heroes_master.json";
import FallbackImage from "./FallbackImage";
import { getHeroImageUrl, getHeroRole } from "../lib/heroUtils";

const ANIM_KEYFRAMES = `
@keyframes intelFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes intelFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes intelScaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
@keyframes intelGlow { 0%, 100% { box-shadow: 0 0 20px var(--glow-color, rgba(123,97,255,0.15)); } 50% { box-shadow: 0 0 35px var(--glow-color, rgba(123,97,255,0.25)); } }
@keyframes intelPulse { 0%, 100% { opacity: 0.03; } 50% { opacity: 0.07; } }
.intel-fade-up { animation: intelFadeUp 0.5s ease-out both; }
.intel-fade-in { animation: intelFadeIn 0.4s ease-out both; }
.intel-scale-in { animation: intelScaleIn 0.6s ease-out both; }
.intel-glow { animation: intelGlow 3s ease-in-out infinite; }
`;
let animInjected = false;
function ensureAnimStyles() {
  if (animInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = ANIM_KEYFRAMES;
  document.head.appendChild(el);
  animInjected = true;
}

const ROLE_ABBREVS: Record<string, string> = {
  Assassin: "ASN", Fighter: "FHT", Mage: "MAG",
  Marksman: "MKS", Tank: "TNK", Support: "SUP",
};

const TIER_STYLE: Record<string, { bg: string; text: string; glow: string }> = {
  "S+": { bg: "linear-gradient(135deg,#FFD700,#FFA500)", text: "#1a0a00", glow: "0 0 8px rgba(255,215,0,0.4)" },
  "S":  { bg: "linear-gradient(135deg,#FFD700,#FFA500)", text: "#1a0a00", glow: "0 0 8px rgba(255,215,0,0.4)" },
  "A":  { bg: "linear-gradient(135deg,#C8AA6E,#A08040)", text: "#1a1000", glow: "0 0 6px rgba(200,170,110,0.3)" },
  "B":  { bg: "linear-gradient(135deg,#00AAFF,#0077CC)", text: "#001a33", glow: "0 0 6px rgba(0,170,255,0.3)" },
  "C":  { bg: "linear-gradient(135deg,#9BA0B4,#606478)", text: "#1a1a20", glow: "none" },
  "D":  { bg: "linear-gradient(135deg,#ff4444,#cc2222)", text: "#1a0000", glow: "none" },
};

function CompactHeroMetaCard({
  heroName, heroAssets, role, tier, winrate, picks, bans, presence, isSelected, onClick,
}: {
  heroName: string;
  heroAssets: Record<string, string>;
  role?: string;
  tier?: string;
  winrate?: string;
  picks?: string;
  bans?: string;
  presence?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const ROLE_COLORS: Record<string, string> = {
    Tank: "#2dd4bf", Fighter: "#ff6b2b", Assassin: "#ff4d6d",
    Mage: "#7b61ff", Marksman: "#00d4ff", Support: "#4ade80",
  };
  const accent = ROLE_COLORS[role || ""] || "#7b61ff";
  const wrNum = parseFloat(String(winrate || "0").replace("%", "")) || 0;
  const picksNum = parseInt(String(picks || "0"), 10) || 0;
  const bansNum = parseInt(String(bans || "0"), 10) || 0;
  const presNum = parseFloat(String(presence || "0").replace("%", "")) || 0;
  const wrColor = wrNum >= 55 ? "#34d399" : wrNum >= 48 ? "#f59e0b" : "#fb7185";
  const tierKey = (tier || "B").toUpperCase().replace("S_PLUS", "S+");
  const tierStyle = TIER_STYLE[tierKey] || TIER_STYLE["C"];
  const roleShort = ROLE_ABBREVS[role || ""] || "UNK";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${accent}10, ${accent}04)`
          : "rgba(13,18,37,0.8)",
        borderColor: isSelected ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.06)",
        boxShadow: isSelected ? "0 4px 16px -2px rgba(251,191,36,0.15)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.borderColor = `${accent}80`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        }
      }}
    >
      <div className="flex items-center gap-3">
        <FallbackImage
          src={getHeroImageUrl(heroName, heroAssets)}
          fallbackText={heroName}
          alt={heroName}
          className="h-[52px] w-[52px] rounded-lg object-cover border"
          style={{ borderColor: `${accent}40` }}
          containerClassName="h-[52px] w-[52px] rounded-lg shrink-0 text-sm font-bold"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm font-bold text-white truncate" style={{ fontFamily: "var(--font-display)" }}>
              {heroName}
            </span>
            <span
              className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0"
              style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}
            >
              {roleShort}
            </span>
            <span
              className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-black tracking-wider shrink-0"
              style={{ background: tierStyle.bg, color: tierStyle.text, boxShadow: tierStyle.glow }}
            >
              {tierKey}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold" style={{ color: wrColor, fontFamily: "var(--font-display)" }}>
              {winrate || "0%"} WR
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {picksNum} picks
            </span>
            <span
              className="text-[10px] font-mono"
              style={{
                color: bansNum > 50 ? "#f43f5e" : bansNum > 20 ? "#fb7185" : "#9ca3af",
                fontWeight: bansNum > 50 ? 700 : 400,
              }}
            >
              {bansNum} bans
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-800/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, presNum))}%`,
                background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
              }}
            />
          </div>
          <span className="text-[9px] text-gray-500 font-mono">{presNum.toFixed(1)}% presence</span>
        </div>
      </div>
    </button>
  );
}

interface StatsDashboardProps {
  heroes: HeroStats[];
  heroAssets: Record<string, string>;
  onOpenHeroIntelligence?: (heroName: string) => void;
  onOpenFullPage?: (heroName: string) => void;
}

export default function StatsDashboard({
  heroes,
  heroAssets,
  onOpenHeroIntelligence,
  onOpenFullPage,
}: StatsDashboardProps) {
  if (import.meta.env.DEV && heroes.length > 100) {
    console.warn(
      `[StatsDashboard] Expected MPL hero stats (~82 heroes), got ${heroes.length}. ` +
      `This component should receive data from /api/hero-stats only, not the full hero roster. ` +
      `Check that /api/hero-stats does not merge heroes_master.json.`
    );
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [sortBy, setSortBy] = useState<
    "presence" | "winrate" | "picks" | "bans" | "name"
  >("presence");
  const [selectedHero, setSelectedHero] = useState<HeroStats | null>(null);

  const ROLE_ACCENT: Record<string, string> = {
    Tank: "#2dd4bf", Fighter: "#ff6b2b", Assassin: "#ff4d6d",
    Mage: "#7b61ff", Marksman: "#00d4ff", Support: "#4ade80",
  };
  const TIER_GLOW: Record<string, string> = {
    "S+": "#FFD700", S: "#FFD700", A: "#C8AA6E", B: "#00AAFF", C: "#9BA0B4", D: "#ff4444",
  };

  function getRoleAccent(role?: string | string[]): string {
    if (!role) return "#7b61ff";
    const r = Array.isArray(role) ? role[0] || "" : role;
    for (const k of Object.keys(ROLE_ACCENT)) {
      if (r.includes(k)) return ROLE_ACCENT[k];
    }
    return "#7b61ff";
  }

  function parsePercent(v?: string): number {
    if (!v) return 0;
    const n = parseFloat(String(v).replace("%", ""));
    return isNaN(n) ? 0 : n;
  }

  function clampPercent(v: number): number {
    return Math.max(0, Math.min(100, v || 0));
  }

  function safeNumber(v?: string | number): number {
    if (v === null || v === undefined || v === "") return 0;
    const n = typeof v === "number" ? v : parseFloat(String(v).replace("%", ""));
    return isNaN(n) ? 0 : n;
  }

  function safeRatio(part: number, total: number): number {
    if (!total || total <= 0) return 0;
    return part / total;
  }

  function getRoleHex(role?: string | string[]): string {
    return getRoleAccent(role);
  }

  function getWinRateColor(wr: number): string {
    if (wr >= 55) return "#34d399";
    if (wr >= 48) return "#f59e0b";
    return "#fb7185";
  }

  function getRoleShort(role?: string): string {
    if (!role) return "UNK";
    const map: Record<string, string> = {
      Assassin: "ASN", Fighter: "FHT", Mage: "MAG",
      Marksman: "MKS", Tank: "TNK", Support: "SUP",
    };
    return map[role] || role.slice(0, 3).toUpperCase();
  }

  const roles = [
    "ALL",
    "Assassin",
    "Fighter",
    "Mage",
    "Marksman",
    "Tank",
    "Support",
  ];

  const processedHeroes = useMemo(() => {
    return heroes.map((h) => {
      const presence = parseFloat((h.tournament_presence || "0").replace("%", ""));
      const picks = parseInt(h.picks_total || "0", 10);
      const bans = parseInt(h.bans_total || "0", 10);
      const totalImpact = picks + bans;
      let tier = "C";
      if (presence >= 55 || totalImpact >= 28) tier = "S+";
      else if (presence >= 40 || totalImpact >= 22) tier = "S";
      else if (presence >= 24 || totalImpact >= 14) tier = "A";
      else if (presence >= 12 || totalImpact >= 8) tier = "B";
      else if (presence >= 5 || totalImpact >= 3) tier = "C";
      else tier = "D";

      return {
        ...h,
        role: getHeroRole(h.hero_name),
        tier,
        picksNum: picks,
        bansNum: bans,
        presenceNum: presence,
        winrateNum: parseFloat((h.winrate || "0").replace("%", "")),
      };
    });
  }, [heroes]);

  const filteredAndSorted = useMemo(() => {
    return processedHeroes
      .filter((hero) => {
        const matchesSearch = String(hero.hero_name || "")
          .toLowerCase()
          .includes(String(searchTerm || "").toLowerCase());
        const matchesRole =
          selectedRole === "ALL" || hero.role === selectedRole;
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === "presence") return b.presenceNum - a.presenceNum;
        if (sortBy === "winrate") return b.winrateNum - a.winrateNum;
        if (sortBy === "picks") return b.picksNum - a.picksNum;
        if (sortBy === "bans") return b.bansNum - a.bansNum;
        return String(a.hero_name || "").localeCompare(
          String(b.hero_name || ""),
        );
      });
  }, [processedHeroes, searchTerm, selectedRole, sortBy]);

  // Set default selected hero when list changes
  React.useEffect(() => {
    if (filteredAndSorted.length > 0 && !selectedHero) {
      setSelectedHero(filteredAndSorted[0]);
    }
  }, [filteredAndSorted, selectedHero]);

  // Inject animation keyframes once
  useEffect(() => { ensureAnimStyles(); }, []);

  const { unpickedHeroes, unbannedHeroes, completelyIgnored } = useMemo(() => {
    const statsMap = new Map();
    processedHeroes.forEach((h) => {
      const normalName = String(h.hero_name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
      statsMap.set(normalName, h);
    });

    const unpicked: any[] = [];
    const unbanned: any[] = [];
    const ignored: any[] = [];

    heroesMaster.forEach((masterHero) => {
      const normalName =
        masterHero.slug ||
        masterHero.hero_name.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const stat = statsMap.get(normalName);

      const picks = stat ? stat.picksNum : 0;
      const bans = stat ? stat.bansNum : 0;

      const heroObj = {
        hero_name: masterHero.hero_name,
        slug: masterHero.slug,
        role: Array.isArray(masterHero.role)
          ? masterHero.role.join(", ")
          : masterHero.role,
        picks,
        bans,
      };

      if (picks === 0) unpicked.push(heroObj);
      if (bans === 0) unbanned.push(heroObj);
      if (picks === 0 && bans === 0) ignored.push(heroObj);
    });

    return {
      unpickedHeroes: unpicked,
      unbannedHeroes: unbanned,
      completelyIgnored: ignored,
    };
  }, [processedHeroes]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-ghost justify-start text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>
        <div className="ui-badge border-white/10 bg-white/[0.04] text-slate-300">
          Hero Stats
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4 rounded-xl border border-gray-900 bg-gray-950 p-4 shadow-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Swords className="h-5 w-5 text-indigo-400" />
                Statistik Hero MPL ID
              </h2>
              <p className="text-xs text-gray-400">
                Analisis preferensi pick, ban, dan performa win rate per side.
              </p>
            </div>

            <div className="font-mono text-[10px] rounded px-2.5 py-1 bg-indigo-900/20 text-indigo-400 font-semibold border border-indigo-500/10">
              HERO TERDATA MPL: {filteredAndSorted.length}
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Cari nama hero..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 py-1.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 outline-none focus:border-indigo-600 transition"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    Role: {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-300 outline-none focus:border-indigo-600 transition"
              >
                <option value="presence">Urutkan: Presensi / Kontes</option>
                <option value="winrate">Urutkan: Win Rate Tertinggi</option>
                <option value="picks">Urutkan: Sering Di-pick</option>
                <option value="bans">Urutkan: Sering Di-ban</option>
                <option value="name">Urutkan: Abjad</option>
              </select>
            </div>
          </div>

          {/* Meta Scout Board — Compact Hero Grid */}
          <div
            className="max-h-[680px] overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}
          >
            {filteredAndSorted.map((hero) => {
              const isSelected = selectedHero?.hero_name === hero.hero_name;
              return (
                <CompactHeroMetaCard
                  key={hero.hero_name}
                  heroName={hero.hero_name}
                  heroAssets={heroAssets}
                  role={hero.role}
                  tier={(hero as any).tier}
                  winrate={hero.winrate}
                  picks={hero.picks_total}
                  bans={hero.bans_total}
                  presence={hero.tournament_presence}
                  isSelected={isSelected}
                  onClick={() => setSelectedHero(hero)}
                />
              );
            })}
          </div>
        </div>

        {/* Details Panel — Hero Intelligence Card (Compact) */}
        <div className="flex flex-col rounded-2xl border border-white/[0.06] shadow-2xl overflow-hidden" style={{ background: "rgba(14, 24, 40, 0.7)", backdropFilter: "blur(16px)" }}>
          {selectedHero ? (() => {
            const accent = getRoleHex(selectedHero.role);
            const wr = safeNumber(selectedHero.winrate);
            const picks = safeNumber(selectedHero.picks_total);
            const bans = safeNumber(selectedHero.bans_total);
            const total = picks + bans;
            const pickPct = safeRatio(picks, total) * 100;
            const banPct = safeRatio(bans, total) * 100;
            const blWr = safeNumber(selectedHero.blue_side_wr);
            const rdWr = safeNumber(selectedHero.red_side_wr);
            const tierRaw = ((selectedHero as any).tier || "B").toUpperCase().replace("S_PLUS", "S+");
            const WRING_R = 34;
            const WRING_C = 2 * Math.PI * WRING_R;
            const WRING_OFF = WRING_C - (clampPercent(wr) / 100) * WRING_C;
            const wrColor = wr >= 55 ? "#34d399" : wr >= 47 ? "#fbbf24" : "#f43f5e";
            const wrColorClass = wr >= 55 ? "text-emerald-400" : wr >= 47 ? "text-amber-400" : "text-rose-400";
            const presenceLabel = selectedHero.tournament_presence || "0%";
            const heroRole = Array.isArray(selectedHero.role) ? selectedHero.role.join(", ") : (selectedHero.role || getHeroRole(selectedHero.hero_name));
            return (
              <div className="flex flex-col">
                {/* S1: Header */}
                <div
                  className="intel-fade-up relative px-4 pt-4 pb-3"
                  style={{ background: `linear-gradient(160deg, ${accent}18 0%, ${accent}06 40%, transparent 70%)`, animationDelay: "0s" }}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: accent, opacity: 0.04, filter: "blur(50px)", animation: "intelPulse 4s ease-in-out infinite" }} />
                  <div className="flex items-start gap-3">
                    <div className="intel-scale-in relative shrink-0" style={{ animationDelay: "0.1s" }}>
                      <div className="absolute -inset-1.5 rounded-xl pointer-events-none intel-glow" style={{ background: `linear-gradient(135deg, ${accent}30, transparent)`, opacity: 0.3, filter: "blur(10px)", "--glow-color": `${accent}25` } as React.CSSProperties} />
                      <FallbackImage
                        src={getHeroImageUrl(selectedHero.hero_name, heroAssets)}
                        fallbackText={selectedHero.hero_name}
                        alt={selectedHero.hero_name}
                        className="relative h-20 w-20 rounded-xl object-cover border-2 shadow-xl"
                        style={{ borderColor: `${accent}60`, boxShadow: `0 0 20px ${accent}20, 0 4px 16px rgba(0,0,0,0.5)` }}
                        containerClassName="relative h-20 w-20 rounded-xl text-xl font-bold"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}>
                          {heroRole}
                        </span>
                        {tierRaw && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}BB)`, color: "#fff", boxShadow: `0 0 8px ${accent}40` }}>
                            {tierRaw}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                        {selectedHero.hero_name}
                      </h3>
                      <p className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.22em] mt-0.5 opacity-80">
                        LIQUIPEDIA S17 &middot; MPL ID ANALYTICS
                      </p>
                    </div>
                  </div>
                </div>

                {/* S2: Win Rate Ring */}
                <div className="intel-fade-up px-4 py-3" style={{ animationDelay: "0.1s" }}>
                  <div className="flex items-center gap-4">
                    <div className="intel-scale-in relative shrink-0" style={{ width: 88, height: 88, animationDelay: "0.2s" }}>
                      <svg width={88} height={88} viewBox="0 0 88 88" className="-rotate-90">
                        <circle cx={44} cy={44} r={WRING_R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={7} />
                        <circle cx={44} cy={44} r={WRING_R} fill="none" stroke={wrColor} strokeWidth={7} strokeLinecap="round" strokeDasharray={WRING_C} strokeDashoffset={WRING_OFF} style={{ transition: "stroke-dashoffset 1s ease-out 0.3s" }} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xl font-black leading-none ${wrColorClass}`} style={{ fontFamily: "var(--font-display)" }}>{selectedHero.winrate || "0%"}</span>
                        <span className="text-[8px] text-gray-500 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>Win Rate</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Win / Loss Record</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                          <span className="text-[11px] font-bold text-emerald-400" style={{ fontFamily: "var(--font-display)" }}>{selectedHero.picks_win || 0} Wins</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]" />
                          <span className="text-[11px] font-bold text-rose-400" style={{ fontFamily: "var(--font-display)" }}>{selectedHero.picks_loss || 0} Losses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* S3: Core Stats */}
                <div className="intel-fade-up px-4 pb-2" style={{ animationDelay: "0.2s" }}>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: "Presence", value: presenceLabel, color: "#22d3ee" },
                      { label: "Picks", value: String(picks), color: "#22d3ee" },
                      { label: "Bans", value: String(bans), color: "#fb7185" },
                      { label: "Total", value: String(total), color: "#a78bfa" },
                    ].map((s, i) => (
                      <div key={s.label} className="intel-fade-up rounded-lg border border-white/[0.06] px-1.5 py-2 text-center transition-all duration-200 hover:border-white/[0.12] hover:scale-[1.03]" style={{ background: "rgba(255,255,255,0.02)", animationDelay: `${0.25 + i * 0.05}s` }}>
                        <div className="text-base font-black leading-none" style={{ color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* S4: Side Performance */}
                <div className="intel-fade-up px-4 pb-2" style={{ animationDelay: "0.3s" }}>
                  <div className="rounded-lg border border-white/[0.06] p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Target className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400" style={{ fontFamily: "var(--font-mono)" }}>Side Performance</span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300" style={{ fontFamily: "var(--font-display)" }}>Blue Side</span>
                        </div>
                        <span className="text-[11px] font-black text-blue-400" style={{ fontFamily: "var(--font-display)" }}>{selectedHero.blue_side_wr || "0.0%"}</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-out" style={{ width: `${clampPercent(safeNumber(selectedHero.blue_side_wr))}%`, transitionDelay: "0.5s" }} />
                      </div>
                      <div className="text-[9px] text-gray-500 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>{selectedHero.blue_side_picks || 0} matches ({selectedHero.blue_side_win || 0}W / {selectedHero.blue_side_loss || 0}L)</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300" style={{ fontFamily: "var(--font-display)" }}>Red Side</span>
                        </div>
                        <span className="text-[11px] font-black text-rose-400" style={{ fontFamily: "var(--font-display)" }}>{selectedHero.red_side_wr || "0.0%"}</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-1000 ease-out" style={{ width: `${clampPercent(safeNumber(selectedHero.red_side_wr))}%`, transitionDelay: "0.6s" }} />
                      </div>
                      <div className="text-[9px] text-gray-500 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>{selectedHero.red_side_picks || 0} matches ({selectedHero.red_side_win || 0}W / {selectedHero.red_side_loss || 0}L)</div>
                    </div>
                  </div>
                </div>

                {/* S5: Pick vs Ban Ratio */}
                <div className="intel-fade-up px-4 pb-2" style={{ animationDelay: "0.4s" }}>
                  <div className="rounded-lg border border-white/[0.06] p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>Pick vs Ban Ratio</span>
                    </div>
                    <div className="h-3 w-full rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-1000 ease-out" style={{ width: `${clampPercent(pickPct)}%`, transitionDelay: "0.6s" }} />
                      <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-1000 ease-out" style={{ width: `${clampPercent(banPct)}%`, transitionDelay: "0.7s" }} />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-cyan-400" />
                        <span className="text-[10px] text-gray-400" style={{ fontFamily: "var(--font-mono)" }}><span className="font-bold text-cyan-400">{picks}</span> Picks ({Math.round(pickPct)}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-rose-400" />
                        <span className="text-[10px] text-gray-400" style={{ fontFamily: "var(--font-mono)" }}><span className="font-bold text-rose-400">{bans}</span> Bans ({Math.round(banPct)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* S6: Draft Insight */}
                <div className="intel-fade-up px-4 pb-2" style={{ animationDelay: "0.5s" }}>
                  <div className="rounded-lg border p-3" style={{ borderColor: `${accent}15`, background: `linear-gradient(135deg, ${accent}06, transparent)` }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="h-3 w-3" style={{ color: accent }} />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: accent, fontFamily: "var(--font-mono)" }}>Draft Insight</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-snug" style={{ fontFamily: "var(--font-sans)" }}>
                      Hero {selectedHero.hero_name} berkontribusi <span className="font-bold text-white">{presenceLabel}</span> dari total kehadiran draft pro.
                      {blWr >= rdWr ? ` Performa lebih kuat di Blue Side (First Pick).` : ` Performa lebih kuat di Red Side (Second Pick).`}
                    </p>
                  </div>
                </div>

                {/* S7: CTA */}
                <div className="intel-fade-up px-4 pb-4" style={{ animationDelay: "0.6s" }}>
                  <button
                    onClick={() => onOpenFullPage?.(selectedHero.hero_name)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs tracking-wide cursor-pointer border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: `linear-gradient(135deg, ${accent}35, ${accent}15)`, borderColor: `${accent}30`, color: "#fff", boxShadow: `0 4px 20px -4px ${accent}30, 0 0 30px ${accent}08` }}
                    title="Open Hero Intelligence Dashboard"
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    View Intelligence Profile
                  </button>
                </div>
              </div>
            );
          })() : (
            <div className="flex flex-1 flex-col items-center justify-center text-center py-20 text-gray-600">
              <Trophy className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm font-sans">Pilih hero untuk melihat detail statistik performa.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hero Pool Analysis Section */}
      <div className="rounded-xl border border-gray-900 bg-[#0a1120] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Target className="w-48 h-48" />
        </div>
        <div className="mb-8 relative z-10">
          <h2 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 uppercase flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" /> Tournament Metagame
            Voids
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Analisis struktural pool hero. Mengidentifikasi kelemahan meta,
            hidden priorities, dan secret picks. Bagian ini menyoroti anomali
            turnamen: hero yang secara teknis ada di roster namun diabaikan,
            diprioritaskan, atau sepenuhnya terlupakan dalam sistem kompetitif
            tertinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Unpicked Heroes */}
          <div className="bg-[#101827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
            <div className="flex items-center justify-between mb-3 border-b border-gray-800/80 pb-3">
              <h3 className="font-sans text-sm font-bold text-gray-200 flex items-center gap-2">
                <History className="w-4 h-4 text-orange-400" />
                Unpicked Heroes
              </h3>
              <span className="bg-orange-950/30 text-orange-400 border border-orange-900/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                {unpickedHeroes.length} HEROES
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-5 leading-relaxed bg-black/20 p-3 rounded-lg border border-gray-800/50">
              Mungkin sering di-ban namun <strong>tidak pernah</strong> dipilih
              (first-pick/blind-pick). Menandakan bahwa tim menghormati potensi
              counter mereka yang spesifik, namun hero tersebut tidak cukup
              fleksibel atau stabil untuk menjadi prioritas draf utama.
            </p>
            <div className="flex flex-wrap gap-2 transition">
              {unpickedHeroes.length > 0 ? (
                unpickedHeroes.map((h) => (
                  <button
                    key={h.hero_name}
                    onClick={() => onOpenFullPage?.(h.hero_name)}
                    className="relative group/icon"
                    title={`View ${h.hero_name} Intelligence`}
                  >
                    <FallbackImage
                      src={getHeroImageUrl(h.hero_name, heroAssets)}
                      fallbackText={h.hero_name}
                      alt={h.hero_name}
                      containerClassName="w-9 h-9 rounded-lg shrink-0 text-[10px]"
                      className="w-9 h-9 rounded-lg shrink-0 object-cover border border-gray-700 opacity-60 group-hover/icon:opacity-100 group-hover/icon:border-orange-500 group-hover/icon:scale-110 transition-all duration-200"
                    />
                    <div className="absolute opacity-0 group-hover/icon:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-xs text-white px-3 py-2 rounded shadow-2xl z-20 pointer-events-none border border-gray-700 flex flex-col items-center gap-1">
                      <span className="font-bold text-sm text-gray-100">
                        {h.hero_name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-wider">
                        {h.role || "Unknown"}
                      </span>
                      <div className="flex gap-2 text-[9px] mt-1">
                        <span className="bg-gray-800 px-1 py-0.5 rounded text-orange-400">
                          Picks: {h.picks}
                        </span>
                        <span className="bg-gray-800 px-1 py-0.5 rounded text-emerald-400">
                          Bans: {h.bans}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <span className="text-xs text-gray-600 font-mono italic">
                  No unpicked heroes.
                </span>
              )}
            </div>
          </div>

          {/* Unbanned Heroes */}
          <div className="bg-[#101827] border border-emerald-900/20 rounded-xl p-5 hover:border-emerald-900/40 transition">
            <div className="flex items-center justify-between mb-3 border-b border-gray-800/80 pb-3">
              <h3 className="font-sans text-sm font-bold text-gray-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Unbanned Heroes
              </h3>
              <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                {unbannedHeroes.length} HEROES
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-5 leading-relaxed bg-black/20 p-3 rounded-lg border border-gray-800/50">
              Dipilih sesekali namun <strong>tidak pernah</strong> di-ban.
              Merepresentasikan pilar kestabilan draf. Mereka adalah *safe
              fallback picks* yang fungsional, adil secara mekanik, dan tidak
              ditakuti secara strategis oleh tim lawan.
            </p>
            <div className="flex flex-wrap gap-2 transition">
              {unbannedHeroes.length > 0 ? (
                unbannedHeroes.map((h) => (
                  <button
                    key={h.hero_name}
                    onClick={() => onOpenFullPage?.(h.hero_name)}
                    className="relative group/icon"
                    title={`View ${h.hero_name} Intelligence`}
                  >
                    <FallbackImage
                      src={getHeroImageUrl(h.hero_name, heroAssets)}
                      fallbackText={h.hero_name}
                      alt={h.hero_name}
                      containerClassName="w-9 h-9 rounded-lg shrink-0 text-[10px]"
                      className="w-9 h-9 rounded-lg shrink-0 object-cover border border-gray-700 opacity-60 group-hover/icon:opacity-100 group-hover/icon:border-emerald-500 group-hover/icon:scale-110 transition-all duration-200"
                    />
                    <div className="absolute opacity-0 group-hover/icon:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-xs text-white px-3 py-2 rounded shadow-2xl z-20 pointer-events-none border border-gray-700 flex flex-col items-center gap-1">
                      <span className="font-bold text-sm text-gray-100">
                        {h.hero_name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-wider">
                        {h.role || "Unknown"}
                      </span>
                      <div className="flex gap-2 text-[9px] mt-1">
                        <span className="bg-gray-800 px-1 py-0.5 rounded text-orange-400">
                          Picks: {h.picks}
                        </span>
                        <span className="bg-gray-800 px-1 py-0.5 rounded text-emerald-400">
                          Bans: {h.bans}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <span className="text-xs text-gray-600 font-mono italic">
                  All heroes have been banned.
                </span>
              )}
            </div>
          </div>

          {/* Unpicked & Unbanned Heroes */}
          <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-5 hover:border-red-900/60 transition shadow-[inset_0_0_20px_rgba(220,38,38,0.05)]">
            <div className="flex items-center justify-between mb-3 border-b border-red-900/20 pb-3">
              <h3 className="font-sans text-sm font-bold text-red-300 flex items-center gap-2">
                <Ghost className="w-4 h-4 text-red-500" />
                Completely Ignored
              </h3>
              <span className="bg-red-950/50 text-red-400 border border-red-900/50 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                {completelyIgnored.length} HEROES
              </span>
            </div>
            <p className="text-[11px] text-rose-300/80 mb-5 leading-relaxed bg-red-950/30 p-3 rounded-lg border border-red-900/30">
              <strong>0% Tournament Presence.</strong> Sama sekali tidak pernah
              dipick atau di-ban. Secara statistik pahlawan ini keluar dari
              relevansi patch. Mereka adalah korban *power creep* atau perubahan
              mikro yang menunggu buff drastis.
            </p>
            <div className="flex flex-wrap gap-2 transition">
              {completelyIgnored.length > 0 ? (
                completelyIgnored.map((h) => (
                  <button
                    key={h.hero_name}
                    onClick={() => onOpenFullPage?.(h.hero_name)}
                    className="relative group/icon"
                    title={`View ${h.hero_name} Intelligence`}
                  >
                    <FallbackImage
                      src={getHeroImageUrl(h.hero_name, heroAssets)}
                      fallbackText={h.hero_name}
                      alt={h.hero_name}
                      containerClassName="w-9 h-9 rounded-lg shrink-0 text-[10px]"
                      className="w-9 h-9 rounded-lg shrink-0 object-cover border border-gray-800 opacity-40 group-hover/icon:opacity-100 group-hover/icon:border-red-500 group-hover/icon:scale-110 transition-all duration-200 grayscale group-hover/icon:grayscale-0"
                    />
                    <div className="absolute opacity-0 group-hover/icon:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-950 border border-red-800 text-xs text-white px-3 py-2 rounded shadow-2xl z-20 pointer-events-none flex flex-col items-center gap-1">
                      <span className="font-bold text-sm text-gray-100">
                        {h.hero_name}
                      </span>
                      <span className="text-[10px] text-rose-400 font-mono tracking-wider font-bold">
                        Priority: 0%
                      </span>
                      <div className="flex gap-2 text-[9px] mt-1">
                        <span className="bg-black/50 px-1 py-0.5 rounded text-gray-400 border border-gray-800">
                          Picks: 0
                        </span>
                        <span className="bg-black/50 px-1 py-0.5 rounded text-gray-400 border border-gray-800">
                          Bans: 0
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <span className="text-xs text-gray-600 font-mono italic">
                  No ignored heroes.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
