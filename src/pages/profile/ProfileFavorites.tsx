import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Swords, Star, BarChart3, Trophy, Target, Settings, Sparkles } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useSharedData } from "../../App";
import heroesMaster from "../../data/heroes_master.json";
import { staggerContainer, staggerItem } from "../../lib/motionPresets";

interface HeroEntry {
  hero_id: number;
  hero_name: string;
  slug: string;
  role: string[];
  lanes?: string[];
  specialty?: string;
}

const allHeroes = heroesMaster as HeroEntry[];
const placeholderHeroes = allHeroes.slice(0, 8);

export default function ProfileFavorites() {
  const { user } = useAuth();
  const { heroAssets } = useSharedData();

  const showcaseHero = user?.showcase_hero
    ? allHeroes.find((h) => h.slug === user.showcase_hero)
    : null;

  const showcaseImg =
    showcaseHero && heroAssets[showcaseHero.hero_name]
      ? heroAssets[showcaseHero.hero_name]
      : showcaseHero && heroAssets[showcaseHero.slug]
        ? heroAssets[showcaseHero.slug]
        : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
            <Heart className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Favorite Heroes</h1>
            <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-5"
        >
          <h3 className="mb-4 text-sm font-semibold text-white">Showcase Hero</h3>
          {showcaseHero ? (
            <div className="space-y-4">
              <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                {showcaseImg ? (
                  <>
                    <img
                      src={showcaseImg}
                      alt={showcaseHero.hero_name}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </>
                ) : (
                  <Swords className="h-16 w-16 text-cyan-400/40" />
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{showcaseHero.hero_name}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {showcaseHero.role.join(" / ")}
                </p>
                {showcaseHero.specialty && (
                  <p className="mt-0.5 text-xs text-slate-500">{showcaseHero.specialty}</p>
                )}
              </div>
              <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Showcase Hero
                </p>
              </div>
              <Link
                to="/settings/profile"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
              >
                <Settings className="h-3.5 w-3.5" />
                Change Showcase
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
                <Star className="h-7 w-7 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">No showcase hero selected</p>
              <Link
                to="/settings/profile"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
              >
                Set Showcase Hero
              </Link>
            </div>
          )}
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Hero Collection</h3>
              <div className="flex gap-1 rounded-lg bg-white/[0.04] p-0.5">
                <button className="rounded-md px-3 py-1 text-[11px] font-medium bg-cyan-400/10 text-cyan-400">
                  Season Current
                </button>
                <button className="rounded-md px-3 py-1 text-[11px] font-medium text-slate-400 hover:text-white">
                  All Seasons
                </button>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            >
              {placeholderHeroes.map((hero) => {
                const heroImg =
                  heroAssets[hero.hero_name] || heroAssets[hero.slug] || null;
                return (
                  <motion.div
                    key={hero.hero_id}
                    variants={staggerItem}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] transition-all duration-200 hover:border-cyan-500/20 hover:bg-white/[0.06]"
                  >
                    <div className="mb-2 flex h-28 items-center justify-center overflow-hidden bg-white/[0.06]">
                      {heroImg ? (
                        <img
                          src={heroImg}
                          alt={hero.hero_name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Swords className="h-8 w-8 text-slate-600 group-hover:text-cyan-400/50 transition-colors" />
                      )}
                    </div>
                    <div className="px-3 pb-3">
                      <p className="text-center text-sm font-medium text-white">
                        {hero.hero_name}
                      </p>
                      <p className="text-center text-[11px] text-slate-500">
                        {hero.role.join(", ")}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Favorite Hero Statistics</h3>
              <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                Coming Soon
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Hero Power", icon: BarChart3, value: "---" },
                { label: "Matches", icon: Target, value: "---" },
                { label: "Win Rate", icon: Trophy, value: "---" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-white/[0.04] p-3 text-center"
                  >
                    <Icon className="mx-auto mb-1 h-4 w-4 text-slate-500" />
                    <p className="text-lg font-bold text-slate-300">{stat.value}</p>
                    <p className="text-[11px] text-slate-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
