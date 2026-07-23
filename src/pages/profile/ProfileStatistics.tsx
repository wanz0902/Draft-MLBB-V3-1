import { motion } from "framer-motion";
import {
  BarChart3,
  Trophy,
  Target,
  Flame,
  Swords,
  Shield,
  Zap,
  Crown,
  Skull,
  HeartPulse,
  Coins,
  Sparkles,
} from "lucide-react";

const TOP_METRICS = [
  { label: "Total Matches", icon: Target, value: "---" },
  { label: "Win Rate", icon: Trophy, value: "---" },
  { label: "MVP", icon: Crown, value: "---" },
  { label: "Rank Score", icon: BarChart3, value: "---" },
];

const DETAIL_METRICS = [
  { label: "Legendary", icon: Flame },
  { label: "Maniac", icon: Swords },
  { label: "Savage", icon: Skull },
  { label: "Double Kill", icon: Zap },
  { label: "Triple Kill", icon: Zap },
  { label: "First Blood", icon: Target },
  { label: "Highest Kills", icon: Swords },
  { label: "Highest Assists", icon: HeartPulse },
  { label: "Longest Win Streak", icon: Trophy },
  { label: "Highest Damage", icon: Flame },
  { label: "Highest Damage Taken", icon: Shield },
  { label: "Highest GPM", icon: Coins },
];

const RADAR_LABELS = ["Push", "KDA", "Durability", "Team Fight", "Farm", "Damage"];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ProfileStatistics() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <motion.div {...fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Battlefield Statistics</h1>
            <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
        className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/[0.06] to-purple-500/[0.04] p-5"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Feature Preview</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Player statistics data source is not connected yet. Statistik personal belum tersedia.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TOP_METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-4 text-center"
            >
              <Icon className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
              <p className="text-2xl font-bold text-white">{m.value}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{m.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {DETAIL_METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-3 text-center"
            >
              <Icon className="mx-auto mb-1.5 h-4 w-4 text-slate-500" />
              <p className="text-lg font-bold text-slate-300">---</p>
              <p className="text-[11px] text-slate-500">{m.label}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-6"
      >
        <h3 className="mb-6 text-center text-sm font-semibold text-white">
          Radar Profile
        </h3>
        <div className="relative mx-auto h-64 w-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-full border border-white/[0.08] opacity-30" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border border-white/[0.06] opacity-20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border border-white/[0.04] opacity-10" />
          </div>
          {RADAR_LABELS.map((label, i) => {
            const angle = (i * 360) / RADAR_LABELS.length - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + 46 * Math.cos(rad);
            const y = 50 + 46 * Math.sin(rad);
            return (
              <div
                key={label}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {label}
              </div>
            );
          })}
          <svg
            className="absolute inset-0 h-full w-full opacity-10"
            viewBox="0 0 100 100"
          >
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-cyan-400"
            />
            <polygon
              points="50,20 80,35 80,65 50,80 20,65 20,35"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-cyan-400 opacity-50"
            />
            <polygon
              points="50,35 65,42.5 65,57.5 50,65 35,57.5 35,42.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-cyan-400 opacity-30"
            />
            {RADAR_LABELS.map((_, i) => {
              const angle = (i * 360) / RADAR_LABELS.length - 90;
              const rad = (angle * Math.PI) / 180;
              const x1 = 50;
              const y1 = 50;
              const x2 = 50 + 45 * Math.cos(rad);
              const y2 = 50 + 45 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="0.15"
                  className="text-cyan-400 opacity-40"
                />
              );
            })}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
