import { useMemo } from "react";
import { motion } from "framer-motion";
import { Database, BarChart3, Activity, Search, Cpu, Zap, Shield, Trophy, Users, Hash, BookOpen, Swords } from "lucide-react";
import { resolveHeroPortrait, getHeroList } from "../integration";
import { META_STATS } from "../constants/landingDemoData";
import { useCounterAnimation } from "../hooks/useCounterAnimation";
import { ANIMATION, VIEWPORT } from "../constants/landingAnimations";

function StatBlock({ value, label, icon: Icon }: { value: string; label: string; icon: typeof Trophy }) {
  const num = parseInt(value.replace(/[^0-9]/g, ""));
  const ref = useCounterAnimation(num);
  return (
    <div className="rounded-xl border border-slate-200 bg-[#fafbfe] p-4 text-center hover:border-cyan-200 hover:shadow-md transition-all">
      <Icon className="h-4 w-4 text-cyan-500 mx-auto mb-2" />
      <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-800">
        {num > 0 ? <span ref={ref}>0</span> : value.replace(/[0-9]+/, "")}
        {value.includes("+") ? "+" : ""}
      </div>
      <div className="text-[10px] text-slate-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

const STAT_ICONS = [Trophy, Hash, Database, Users, BookOpen, Shield];

const DATA_SOURCES = [
  { icon: Database, title: "Tournament Data", desc: "171+ draft series from MPL ID S17, MPL MY, MPL PH", tags: ["MPL ID", "MPL MY", "MPL PH"], heroSlugs: ["fanny", "zhuxin", "martis", "beatrix", "tigreal"] },
  { icon: BarChart3, title: "Hero Analytics", desc: "132+ heroes with counters, synergies, win conditions", tags: ["Counters", "Synergies", "Wincons"], heroSlugs: ["lancelot", "gusion", "ling", "hayabusa", "natalia"] },
  { icon: Activity, title: "Meta Tracking", desc: "Real-time pick/ban rates across all ranks", tags: ["Ranked", "Mythic", "MPL"], heroSlugs: ["atlas", "tigreal", "khufra", "franco", "akai"] },
];

const ENGINE_STEPS = [
  { icon: Database, title: "Collect", desc: "Data from tournaments and ranked matches across all regions", heroSlug: "fanny" },
  { icon: Search, title: "Analyze", desc: "Pattern recognition across 132+ heroes and millions of matches", heroSlug: "lancelot" },
  { icon: Cpu, title: "Synthesize", desc: "Counter-strategies, win conditions, and team compositions", heroSlug: "zhuxin" },
  { icon: Zap, title: "Recommend", desc: "Actionable draft advice delivered in real-time during your draft", heroSlug: "martis" },
];

function HeroPortrait({ slug, heroAssets, size = "w-10 h-10" }: { slug: string; heroAssets: Record<string, string>; size?: string }) {
  return (
    <div className={`${size} rounded-lg overflow-hidden border border-slate-200 bg-[#fafbfe] shrink-0 hover:border-cyan-300 hover:shadow-md transition-all`}>
      <img loading="lazy" src={resolveHeroPortrait(slug, heroAssets)} alt={slug} className="w-full h-full object-cover" />
    </div>
  );
}

export default function MetaIntelligenceSection({ heroAssets }: { heroAssets: Record<string, string> }) {
  const heroList = useMemo(() => getHeroList(), []);
  const validHeroes = useMemo(() => heroList.filter((h) => heroAssets[h.slug]).slice(0, 20), [heroList, heroAssets]);
  const marqueeItems = useMemo(() => [...validHeroes, ...validHeroes], [validHeroes]);

  return (
    <section id="meta" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-800 text-center tracking-tight mb-3">The intelligence behind every recommendation</h2>
          <p className="text-slate-500 text-sm text-center mb-12 max-w-lg mx-auto">DraftMLBB combines tournament data, hero analytics, and real-time pattern recognition.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {DATA_SOURCES.map((src, i) => {
            const Icon = src.icon;
            return (
              <motion.div key={src.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 hover:border-cyan-200 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{src.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{src.desc}</p>
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {src.tags.map((tag) => (
                    <span key={tag} className="text-[8px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-1.5 mt-3">
                  {src.heroSlugs.map((slug) => (
                    <div key={slug} className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200">
                      <img src={resolveHeroPortrait(slug, heroAssets)} alt={slug} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }} className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 sm:p-6 mb-16">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Current Meta Tier List
          </h3>
          <div className="space-y-2.5">
            {[
              { tier: "S+", color: "bg-red-500", heroes: ["fanny", "zhuxin", "fredrinn"] },
              { tier: "S", color: "bg-orange-500", heroes: ["martis", "beatrix", "lancelot", "valentina"] },
              { tier: "A", color: "bg-amber-500", heroes: ["tigreal", "atlas", "gusion", "ling", "hayabusa"] },
              { tier: "B", color: "bg-emerald-500", heroes: ["natalia", "khufra", "franco", "akai", "chou", "badang"] },
            ].map(({ tier, color, heroes }) => (
              <div key={tier} className="flex items-center gap-3">
                <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0`}>{tier}</div>
                <div className="flex gap-1.5 flex-wrap">
                  {heroes.map((slug) => (
                    <div key={slug} className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 hover:border-cyan-300 hover:shadow-sm transition-all">
                      <img src={resolveHeroPortrait(slug, heroAssets)} alt={slug} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 sm:p-6 mb-16">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-600" />
            Top Pick/Ban Rates
          </h3>
          <div className="space-y-3">
            {[
              { slug: "fanny", name: "Fanny", rate: 87 },
              { slug: "zhuxin", name: "Zhuxin", rate: 78 },
              { slug: "martis", name: "Martis", rate: 72 },
              { slug: "beatrix", name: "Beatrix", rate: 65 },
              { slug: "atlas", name: "Atlas", rate: 58 },
            ].map(({ slug, name, rate }, i) => (
              <motion.div key={slug} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.4, delay: i * 0.08 }} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <img src={resolveHeroPortrait(slug, heroAssets)} alt={name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-xs font-medium text-slate-700 w-16 shrink-0">{name}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${rate}%` }} viewport={VIEWPORT} transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 w-8 text-right">{rate}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mb-16">
          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT}
            className="font-[family-name:var(--font-display)] text-lg font-black text-slate-800 text-center mb-8">How the Engine Works</motion.h3>
          <div className="relative max-w-lg mx-auto">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200">
              <motion.div initial={{ height: "0%" }} whileInView={{ height: "100%" }} viewport={VIEWPORT} transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-cyan-200" />
            </div>
            {ENGINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.4, delay: i * 0.15 }}
                  className="relative flex items-start gap-4 mb-8 last:mb-0">
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VIEWPORT} transition={{ delay: i * 0.15, type: "spring" }}
                    className="w-10 h-10 rounded-full bg-[#fafbfe] border-2 border-cyan-200 flex items-center justify-center shrink-0 z-10">
                    <Icon className="h-4 w-4 text-cyan-600" />
                  </motion.div>
                  <div className="pt-1 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-bold text-cyan-500 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded-full">Step {i + 1}</span>
                      <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  <HeroPortrait slug={step.heroSlug} heroAssets={heroAssets} size="w-8 h-8" />
                  {i < ENGINE_STEPS.length - 1 && (
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT} transition={{ delay: i * 0.15 + 0.3 }}
                      className="absolute left-[18px] top-10 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-200" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {META_STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: i * 0.05 }}>
              <StatBlock value={s.value} label={s.label} icon={STAT_ICONS[i]} />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 sm:p-6 mb-16">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-500" />
            Popular Items Meta
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[
              { name: "Blade of Despair", bg: "bg-red-50", border: "border-red-200" },
              { name: "Malefic Roar", bg: "bg-orange-50", border: "border-orange-200" },
              { name: "Immortality", bg: "bg-emerald-50", border: "border-emerald-200" },
              { name: "Windtalker", bg: "bg-cyan-50", border: "border-cyan-200" },
              { name: "Athena Shield", bg: "bg-blue-50", border: "border-blue-200" },
              { name: "Dominance Ice", bg: "bg-sky-50", border: "border-sky-200" },
              { name: "Thunder Belt", bg: "bg-amber-50", border: "border-amber-200" },
              { name: "Glowing Wand", bg: "bg-purple-50", border: "border-purple-200" },
            ].map(({ name, bg, border }) => (
              <div key={name} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border ${border} ${bg} hover:shadow-md transition-all`}>
                <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
                <span className="text-[8px] text-slate-500 text-center leading-tight font-medium">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {marqueeItems.length > 0 && (
          <div className="overflow-hidden mb-8">
            <div className="flex gap-3" style={{ width: "max-content", animation: `marquee ${ANIMATION.MARQUEE_SPEED_S}s linear infinite` }}>
              {marqueeItems.map((h, i) => (
                <div key={`m-${i}-${h.slug}`} className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-[#fafbfe] hover:border-cyan-300 hover:shadow-md transition-all">
                  <img loading="lazy" src={resolveHeroPortrait(h.slug, heroAssets)} alt={h.hero_name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 bg-cyan-50">
            <Shield className="h-3.5 w-3.5 text-cyan-600" />
            <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">Local Draft Engine first, AI explanation second</span>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
