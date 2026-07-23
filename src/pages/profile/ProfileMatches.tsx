import { motion } from "framer-motion";
import { History, Clock, Sparkles, Swords, Shield, Timer, CalendarDays } from "lucide-react";
import { useSharedData } from "../../App";
import heroesMaster from "../../data/heroes_master.json";
import { staggerContainer, staggerItem } from "../../lib/motionPresets";

interface HeroEntry {
  hero_id: number;
  hero_name: string;
  slug: string;
  role: string[];
  lanes?: string[];
}

const allHeroes = heroesMaster as HeroEntry[];
const placeholderHeroes = allHeroes.slice(0, 4);

const TABS = ["All", "Ranked", "Classic"];

export default function ProfileMatches() {
  const { heroAssets } = useSharedData();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
            <History className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Match History</h1>
            <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
        className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/[0.06] to-purple-500/[0.04] p-5"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">Feature Preview</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Personal match history data source is not connected yet. Data pertandingan personal belum tersedia.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              i === 0
                ? "bg-cyan-400/10 text-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {[0, 1, 2, 3].map((i) => {
          const hero = placeholderHeroes[i];
          const heroImg =
            hero && heroAssets[hero.hero_name]
              ? heroAssets[hero.hero_name]
              : hero && heroAssets[hero.slug]
                ? heroAssets[hero.slug]
                : null;

          return (
            <motion.div
              key={i}
              variants={staggerItem}
              className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/[0.06] opacity-40 blur-sm">
                  {heroImg ? (
                    <img
                      src={heroImg}
                      alt={hero?.hero_name || "Hero"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Swords className="h-7 w-7 text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-20 rounded-full bg-white/[0.06] opacity-40 blur-sm" />
                    <div className="h-4 w-16 rounded-full bg-white/[0.06] opacity-40 blur-sm" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-8 text-center rounded bg-white/[0.06] opacity-40 blur-sm">
                      <span className="invisible">---</span>
                    </div>
                    <span className="text-xs text-slate-600">/</span>
                    <div className="h-3 w-8 text-center rounded bg-white/[0.06] opacity-40 blur-sm">
                      <span className="invisible">---</span>
                    </div>
                    <span className="text-xs text-slate-600">/</span>
                    <div className="h-3 w-8 text-center rounded bg-white/[0.06] opacity-40 blur-sm">
                      <span className="invisible">---</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-slate-600 opacity-40" />
                      <div className="h-3 w-12 rounded bg-white/[0.06] opacity-40 blur-sm" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3 text-slate-600 opacity-40" />
                      <div className="h-3 w-14 rounded bg-white/[0.06] opacity-40 blur-sm" />
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 text-slate-600 opacity-40" />
                      <div className="h-3 w-16 rounded bg-white/[0.06] opacity-40 blur-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]">
          <Clock className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Data pertandingan personal belum terhubung dengan sumber resmi.
        </p>
      </div>
    </div>
  );
}
