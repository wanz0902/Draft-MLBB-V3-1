import React from "react";
import { getHeroImageUrl } from "../lib/heroUtils";

interface LandingDemoCardProps {
  step: number;
  heroAssets: Record<string, string>;
  teamAssets: Record<string, string>;
}

/* ── SVG Radar Chart (simple polygon) ── */
function RadarChart({ stats }: { stats: { label: string; value: number }[] }) {
  const cx = 100, cy = 100, r = 70;
  const n = stats.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i: number, val: number) => {
    const angle = angleStep * i - Math.PI / 2;
    const dist = (val / 10) * r;
    return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
  };

  const polygonPoints = stats.map((s, i) => getPoint(i, s.value)).join(" ");

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="Hero attribute radar chart">
      {/* Grid rings */}
      {[2, 4, 6, 8, 10].map((ring) => (
        <polygon
          key={ring}
          points={stats.map((_, i) => getPoint(i, ring)).join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0.5"
        />
      ))}
      {/* Axis lines */}
      {stats.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(0,212,255,0.15)"
        stroke="#00d4ff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Data points */}
      {stats.map((s, i) => (
        <circle
          key={i}
          cx={parseFloat(getPoint(i, s.value).split(",")[0])}
          cy={parseFloat(getPoint(i, s.value).split(",")[1])}
          r="3"
          fill="#00d4ff"
          stroke="#0a0e1a"
          strokeWidth="1"
        />
      ))}
      {/* Labels */}
      {stats.map((s, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const lx = cx + (r + 16) * Math.cos(angle);
        const ly = cy + (r + 16) * Math.sin(angle);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/40 text-[8px] font-mono"
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Step 1: Draft Phase ── */
function DraftPhaseDemo({ heroAssets }: { heroAssets: Record<string, string> }) {
  const bluePicks = ["Mathilda", "Harith", "Fredrinn"];
  const bluePicks2 = ["Zhuxin", "Moskov"];
  const redPicks = ["Fanny", "Ling", "Baxia"];
  const redPicks2 = ["Beatrix", "Angela"];
  const blueBans = ["Freya", "Chip"];
  const redBans = ["Phoveus", "Harley", "Nolan"];

  return (
    <div className="space-y-3">
      {/* Teams header */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-400">Blue Team</span>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400">Red Team</span>
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        </div>
      </div>

      {/* Bans */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-wider text-rose-400/60 mb-1.5">Bans</div>
          <div className="flex gap-1">
            {blueBans.map((h) => (
              <div key={h} className="h-8 w-8 rounded-md overflow-hidden border border-rose-500/15 bg-rose-500/[0.04]">
                <img src={getHeroImageUrl(h, heroAssets)} alt={h} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-wider text-rose-400/60 mb-1.5 text-right">Bans</div>
            <div className="flex gap-1">
              {redBans.map((h) => (
                <div key={h} className="h-8 w-8 rounded-md overflow-hidden border border-rose-500/15 bg-rose-500/[0.04]">
                  <img src={getHeroImageUrl(h, heroAssets)} alt={h} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Picks */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-wider text-blue-400/60 mb-1.5">Picks</div>
          <div className="flex gap-1">
            {bluePicks.map((h) => (
              <div key={h} className="h-10 w-10 rounded-lg overflow-hidden border border-blue-500/15 bg-blue-500/[0.04]">
                <img src={getHeroImageUrl(h, heroAssets)} alt={h} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-1">
            {bluePicks2.map((h) => (
              <div key={h} className="h-10 w-10 rounded-lg overflow-hidden border border-blue-500/15 bg-blue-500/[0.04]">
                <img src={getHeroImageUrl(h, heroAssets)} alt={h} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-wider text-rose-400/60 mb-1.5 text-right">Picks</div>
            <div className="flex gap-1">
              {redPicks.map((h) => (
                <div key={h} className="h-10 w-10 rounded-lg overflow-hidden border border-rose-500/15 bg-rose-500/[0.04]">
                  <img src={getHeroImageUrl(h, heroAssets)} alt={h} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-1">
              {redPicks2.map((h) => (
                <div key={h} className="h-10 w-10 rounded-lg overflow-hidden border border-rose-500/15 bg-rose-500/[0.04]">
                  <img src={getHeroImageUrl(h, heroAssets)} alt={h} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active phase indicator */}
      <div className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06] px-3 py-2 mt-2">
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-400">Pick Phase 2 — Blue Team Turn</span>
      </div>
    </div>
  );
}

/* ── Step 2: Ban Intelligence ── */
function BanIntelligenceDemo({ heroAssets }: { heroAssets: Record<string, string> }) {
  const bans = [
    { hero: "Fanny", reason: "Protect win condition", color: "cyan", score: 91 },
    { hero: "Harith", reason: "Deny comfort pick", color: "amber", score: 84 },
    { hero: "Ling", reason: "Counter their jungler", color: "violet", score: 78 },
    { hero: "Chip", reason: "Hide your strategy", color: "rose", score: 72 },
  ];

  return (
    <div className="space-y-3">
      <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400/60 mb-2">Ban Recommendations</div>
      {bans.map((b) => (
        <div key={b.hero} className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
          <div className="h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-white/[0.06]">
            <img src={getHeroImageUrl(b.hero, heroAssets)} alt={b.hero} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-white">{b.hero}</span>
              <span className={`font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border border-${b.color}-500/20 bg-${b.color}-500/10 text-${b.color}-400`}>{b.reason}</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                style={{ width: `${b.score}%` }}
              />
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-cyan-400">{b.score}%</span>
        </div>
      ))}
    </div>
  );
}

/* ── Step 3: Hero Intelligence ── */
function HeroIntelligenceDemo({ heroAssets }: { heroAssets: Record<string, string> }) {
  const radarStats = [
    { label: "DMG", value: 8 },
    { label: "SURV", value: 5 },
    { label: "CTRL", value: 7 },
    { label: "MOB", value: 6 },
    { label: "FARM", value: 4 },
    { label: "OBJ", value: 7 },
  ];

  const items = ["Berserker's Fury", "Haas's Claws", "War Axe", "Athena's Shield", "Immortality"];

  return (
    <div className="space-y-3">
      {/* Hero header */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/[0.08]">
          <img src={getHeroImageUrl("Zhuxin", heroAssets)} alt="Zhuxin" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h4 className="font-display text-lg font-bold text-white">Zhuxin</h4>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400">Mage</span>
            <span className="font-mono text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">Tier S+</span>
          </div>
        </div>
      </div>

      {/* Radar chart */}
      <div className="h-36 w-36 mx-auto">
        <RadarChart stats={radarStats} />
      </div>

      {/* Attribute bars */}
      <div className="space-y-1.5">
        {[
          { label: "Early Game", value: 6, color: "bg-cyan-400" },
          { label: "Mid Game", value: 9, color: "bg-violet-400" },
          { label: "Late Game", value: 8, color: "bg-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-2">
            <span className="font-mono text-[8px] text-slate-500/60 w-16">{stat.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div className={`h-full rounded-full ${stat.color} transition-all duration-700`} style={{ width: `${stat.value * 10}%` }} />
            </div>
            <span className="font-mono text-[9px] text-white/60 w-4 text-right">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Recommended build */}
      <div>
        <div className="font-mono text-[8px] uppercase tracking-wider text-slate-500/50 mb-1.5">Recommended Build</div>
        <div className="flex gap-1">
          {items.map((item) => (
            <div key={item} className="h-8 w-8 rounded-md border border-white/[0.06] bg-white/[0.02] flex items-center justify-center" title={item}>
              <span className="text-[6px] text-slate-500 font-mono text-center leading-tight px-0.5">{item.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 4: Team Intelligence ── */
function TeamIntelligenceDemo({ heroAssets, teamAssets }: { heroAssets: Record<string, string>; teamAssets: Record<string, string> }) {
  const comfortPicks = ["Fanny", "Ling", "Harith", "Mathilda"];
  const lastMatches = [
    { result: "W", opponent: "DEWA", score: "2-0" },
    { result: "W", opponent: "BTR", score: "2-1" },
    { result: "L", opponent: "TLID", score: "1-2" },
    { result: "W", opponent: "GEEK", score: "2-0" },
    { result: "W", opponent: "AE", score: "2-1" },
  ];

  return (
    <div className="space-y-3">
      {/* Team header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/[0.06] bg-white flex items-center justify-center">
          {teamAssets["ONIC"] ? (
            <img src={teamAssets["ONIC"]} alt="ONIC" className="h-full w-full object-contain p-0.5" />
          ) : (
            <span className="text-[10px] font-black text-amber-400">ON</span>
          )}
        </div>
        <div>
          <h4 className="font-display text-base font-bold text-white">ONIC Esports</h4>
          <span className="font-mono text-[10px] text-emerald-400 font-bold">W8 L3 (73%)</span>
        </div>
      </div>

      {/* Comfort picks */}
      <div>
        <div className="font-mono text-[8px] uppercase tracking-wider text-slate-500/50 mb-1.5">Comfort Picks</div>
        <div className="flex gap-1.5">
          {comfortPicks.map((h) => (
            <div key={h} className="h-9 w-9 rounded-lg overflow-hidden border border-white/[0.06]">
              <img src={getHeroImageUrl(h, heroAssets)} alt={h} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>

      {/* Last 5 matches */}
      <div>
        <div className="font-mono text-[8px] uppercase tracking-wider text-slate-500/50 mb-1.5">Last 5 Matches</div>
        <div className="flex gap-2">
          {lastMatches.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black ${
                m.result === "W" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
              }`}>
                {m.result}
              </div>
              <span className="font-mono text-[7px] text-slate-500/50">{m.opponent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tendencies */}
      <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] text-emerald-400 font-bold">✓</span>
          <span className="text-[11px] text-slate-300">Preferred: Early aggression</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] text-amber-400 font-bold">!</span>
          <span className="text-[11px] text-slate-300">Weakness: Extended teamfights</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 5: Coach Analysis ── */
function CoachAnalysisDemo() {
  const [score, setScore] = React.useState(0);
  const scoreRef = React.useRef<HTMLDivElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / 1500, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setScore(Math.floor(eased * 87));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (scoreRef.current) observer.observe(scoreRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-3">
      {/* Score header */}
      <div ref={scoreRef} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-wider text-slate-500/50">Draft Assessment</div>
          <div className="font-display text-xs text-slate-300 mt-0.5">Blue Team Composition</div>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-black text-cyan-400">{score}<span className="text-lg text-slate-500">/100</span></div>
        </div>
      </div>

      {/* Strengths */}
      <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] px-3 py-2.5">
        <div className="font-mono text-[8px] uppercase tracking-wider text-emerald-400/80 mb-1.5">Strengths</div>
        <div className="space-y-1">
          {["Strong teamfight synergy", "Flexible objective control", "Multi-angle engage potential"].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span className="text-[9px] text-emerald-400">✓</span>
              <span className="text-[11px] text-slate-300">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risks */}
      <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.04] px-3 py-2.5">
        <div className="font-mono text-[8px] uppercase tracking-wider text-amber-400/80 mb-1.5">Risks</div>
        <div className="space-y-1">
          {["Vulnerable to early poke", "Missing hard engage tool"].map((r) => (
            <div key={r} className="flex items-center gap-2">
              <span className="text-[9px] text-amber-400">!</span>
              <span className="text-[11px] text-slate-300">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-[9px] text-slate-500/40 font-mono">
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
        Local engine · AI context · You decide
      </div>
    </div>
  );
}

/* ── Main Export ── */
export default function LandingDemoCard({ step, heroAssets, teamAssets }: LandingDemoCardProps) {
  switch (step) {
    case 0: return <DraftPhaseDemo heroAssets={heroAssets} />;
    case 1: return <BanIntelligenceDemo heroAssets={heroAssets} />;
    case 2: return <HeroIntelligenceDemo heroAssets={heroAssets} />;
    case 3: return <TeamIntelligenceDemo heroAssets={heroAssets} teamAssets={teamAssets} />;
    case 4: return <CoachAnalysisDemo />;
    default: return <DraftPhaseDemo heroAssets={heroAssets} />;
  }
}
