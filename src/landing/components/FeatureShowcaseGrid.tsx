import type React from "react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Swords, Brain, Trophy, Database, Users, Calendar, Map, ChevronRight } from "lucide-react";
import { enterApp } from "../integration";
import { VIEWPORT } from "../constants/landingAnimations";
import { useReducedMotion } from "../hooks/useReducedMotion";

const FEATURES = [
  {
    id: "draft",
    icon: Swords,
    title: "Draft War Room",
    description: "Simulate full 5v5 drafts with AI coaching in real-time. React to enemy bans, pivot strategies, and discover hidden win conditions as the draft unfolds.",
    ctaLabel: "Open Draft",
    ctaTargetTab: "draft" as const,
    testId: "cta-open-warroom",
    preview: "draft",
  },
  {
    id: "intel",
    icon: Brain,
    title: "Hero Intelligence",
    description: "Deep analysis for every hero: counters, synergies, skill breakdowns, and draft value. Know exactly when and why to pick each hero.",
    ctaLabel: "Explore Heroes",
    ctaTargetTab: "intelligence" as const,
    testId: "cta-explore-heroes",
    preview: "intel",
  },
  {
    id: "stats",
    icon: Trophy,
    title: "MPL Hero Stats",
    description: "Tournament-grade pick/ban analytics from MPL ID S17, MPL MY, and MPL PH. See which heroes dominate at the highest level.",
    ctaLabel: "View Stats",
    ctaTargetTab: "heroes" as const,
    testId: "cta-view-mpl",
    preview: "stats",
  },
  {
    id: "catalog",
    icon: Database,
    title: "Data Catalog",
    description: "Items, emblems, and battle spells with full stat breakdowns. Browse 144 items and 7 emblem systems to optimize your builds.",
    ctaLabel: "Open Catalog",
    ctaTargetTab: "items" as const,
    testId: "cta-open-catalog",
    preview: "catalog",
  },
  {
    id: "teams",
    icon: Users,
    title: "Team Analytics",
    description: "Team compositions, win conditions, and match scouting. Analyze how pro teams draft and adapt their strategies across tournaments.",
    ctaLabel: "Analyze Teams",
    ctaTargetTab: "teams" as const,
    testId: "cta-analyze-teams",
    preview: "teams",
  },
  {
    id: "planner",
    icon: Calendar,
    title: "Team Draft Planner",
    description: "Plan tournament drafts with team-specific strategies. Build draft sequences, counter-strategies, and deception layers for your team.",
    ctaLabel: "Open Planner",
    ctaTargetTab: "tdp" as const,
    testId: "cta-open-planner",
    preview: "planner",
  },
  {
    id: "macro",
    icon: Map,
    title: "Macro Map Planner",
    description: "Visualize rotations, objective timings, and lane assignments on a live map. Coordinate team movements and control the map.",
    ctaLabel: "Open Map",
    ctaTargetTab: "macro" as const,
    testId: "cta-plan-macro",
    preview: "macro",
  },
];

function DraftPreview() {
  const bans = ["Fanny", "Zhuxin", "Badang"];
  const picks = ["Lancelot", "Fredrinn"];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1">
        {bans.map((b, i) => (
          <motion.div key={b} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={VIEWPORT} transition={{ delay: 0.1 * i }}
            className="w-8 h-8 rounded bg-red-50 border border-red-200 flex items-center justify-center text-[8px] font-bold text-red-400 line-through">
            {b.slice(0, 3)}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1">
        {picks.map((p, i) => (
          <motion.div key={p} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={VIEWPORT} transition={{ delay: 0.3 + 0.1 * i }}
            className="w-8 h-8 rounded bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[8px] font-bold text-cyan-600">
            {p.slice(0, 3)}
          </motion.div>
        ))}
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-8 h-8 rounded border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-300">
          ?
        </motion.div>
      </div>
    </div>
  );
}

function IntelPreview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200" />
        <div className="flex-1">
          <div className="h-1.5 w-16 bg-slate-200 rounded" />
          <div className="h-1 w-10 bg-slate-100 rounded mt-1" />
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
          51.4% WR
        </motion.div>
        <div className="text-[8px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
          61.5% PR
        </div>
      </div>
    </div>
  );
}

function StatsPreview() {
  const tiers = [
    { tier: "S", heroes: ["Fred", "Lan"], color: "text-amber-600 bg-amber-50 border-amber-200" },
    { tier: "A", heroes: ["Zhux", "Mart"], color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
    { tier: "B", heroes: ["Tigr"], color: "text-slate-500 bg-slate-50 border-slate-200" },
  ];
  return (
    <div className="flex flex-col gap-1">
      {tiers.map((t, i) => (
        <motion.div key={t.tier} initial={{ x: -10, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={VIEWPORT} transition={{ delay: 0.1 * i }}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded border ${t.color}`}>
          <span className="text-[8px] font-black w-3">{t.tier}</span>
          <span className="text-[7px] font-medium">{t.heroes.join(" · ")}</span>
        </motion.div>
      ))}
    </div>
  );
}

function CatalogPreview() {
  const items = ["⚔️", "🛡️", "💍", "👟", "🗡️", "🪄"];
  return (
    <div className="grid grid-cols-6 gap-1">
      {items.map((item, i) => (
        <motion.div key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT} transition={{ delay: 0.05 * i }}
          className="w-6 h-6 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px]">
          {item}
        </motion.div>
      ))}
    </div>
  );
}

function TeamsPreview() {
  const roles = ["EXP", "JGL", "MID", "GOLD", "ROAM"];
  return (
    <div className="flex gap-1">
      {roles.map((r, i) => (
        <motion.div key={r} initial={{ y: 8, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={VIEWPORT} transition={{ delay: 0.08 * i }}
          className="flex flex-col items-center gap-0.5">
          <div className="w-5 h-5 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
            <span className="text-[6px] font-bold text-violet-500">{r.slice(0, 1)}</span>
          </div>
          <span className="text-[6px] text-slate-400 font-medium">{r}</span>
        </motion.div>
      ))}
    </div>
  );
}

function PlannerPreview() {
  return (
    <div className="flex items-center gap-0.5">
      {["Ban", "Ban", "Pick", "Pick", "Ban"].map((step, i) => (
        <motion.div key={i} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={VIEWPORT} transition={{ delay: 0.1 * i }}
          className={`h-4 flex-1 rounded-sm flex items-center justify-center text-[6px] font-bold ${
            step === "Ban" ? "bg-red-50 text-red-400 border border-red-200" : "bg-cyan-50 text-cyan-500 border border-cyan-200"
          }`}>
          {step}
        </motion.div>
      ))}
    </div>
  );
}

function MacroPreview() {
  return (
    <div className="relative w-full h-12 bg-slate-50 rounded border border-slate-200 overflow-hidden">
      <svg viewBox="0 0 120 40" className="w-full h-full">
        <motion.path d="M20,30 Q40,10 60,20 T100,15" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={VIEWPORT} transition={{ duration: 1.5 }} />
        <motion.circle cx="20" cy="30" r="3" className="fill-cyan-400" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT} transition={{ delay: 0.2 }} />
        <motion.circle cx="60" cy="20" r="3" className="fill-amber-400" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT} transition={{ delay: 0.6 }} />
        <motion.circle cx="100" cy="15" r="3" className="fill-emerald-400" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT} transition={{ delay: 1 }} />
      </svg>
    </div>
  );
}

const PREVIEW_MAP: Record<string, () => React.JSX.Element> = {
  draft: DraftPreview,
  intel: IntelPreview,
  stats: StatsPreview,
  catalog: CatalogPreview,
  teams: TeamsPreview,
  planner: PlannerPreview,
  macro: MacroPreview,
};

function FeatureCard({ feat, index }: { feat: (typeof FEATURES)[number]; index: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 20 });
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  const Icon = feat.icon;
  const Preview = PREVIEW_MAP[feat.preview];

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (reducedMotion) return;
    if (window.innerWidth < 1024) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - y) * 10);
    rotateY.set((x - 0.5) * 10);
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x: px, y: py });
  }

  function handleMouseLeave() {
    if (reducedMotion) return;
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.button
      ref={ref}
      data-testid={feat.testId}
      onClick={() => enterApp(feat.ctaTargetTab)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(6,182,212,0.12)" }}
      style={{ perspective: 600, rotateX: springX, rotateY: springY }}
      className={`text-left rounded-2xl border p-5 transition-all group cursor-pointer ${
        index === 0
          ? "sm:col-span-2 lg:col-span-1 border-cyan-200 bg-[#fafbfe]"
          : "border-slate-200 bg-[#fafbfe] hover:border-cyan-200 hover:shadow-lg"
      }`}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at ${spotPos.x}% ${spotPos.y}%, rgba(6,182,212,0.06), transparent 60%)`,
        }}
      />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
          <Icon className="h-4 w-4 text-cyan-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">{feat.title}</h3>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{feat.description}</p>
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 mb-4">
        {Preview && <Preview />}
      </div>
      <span className="text-[11px] font-bold text-cyan-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
        {feat.ctaLabel} <ChevronRight className="h-3 w-3" />
      </span>
    </motion.button>
  );
}

export default function FeatureShowcaseGrid() {
  return (
    <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-800 text-center tracking-tight mb-3">Everything you need to master the draft</h2>
          <p className="text-slate-500 text-sm text-center mb-12 max-w-md mx-auto">From casual ranked to MPL-level preparation.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <FeatureCard key={feat.id} feat={feat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
