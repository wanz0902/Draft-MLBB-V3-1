import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Swords, Star, TrendingUp } from "lucide-react";
import { enterApp, resolveHeroPortrait } from "../integration";
import { VIEWPORT } from "../constants/landingAnimations";

const SKILLS = [
  { name: "Passive", desc: "Zhuxin converts max mana into butterflies that allow her to cast her skill 2 continuously.", icon: "/raw-assets/skill_icons/zhuxin/crimson_butterflies.png", video: "/videos/heroes/zhuxin/video-3-0.mp4" },
  { name: "Skill 1", desc: "Deals Magic Damage in an area and slows enemies. Primary poke and wave-clear tool.", icon: "/raw-assets/skill_icons/zhuxin/fluttering_grace.png", video: "/videos/heroes/zhuxin/video-2-0.mp4" },
  { name: "Skill 2", desc: "Consumes mana continuously to deal damage and pull enemies together. AoE CC teamfight engine.", icon: "/raw-assets/skill_icons/zhuxin/lantern_flare.png", video: "/videos/heroes/zhuxin/video-0-0.mp4" },
  { name: "Ultimate", desc: "Zhuxin dashes and gains a shield. Butterflies continuously damage nearby enemies.", icon: "/raw-assets/skill_icons/zhuxin/crimson_beacon.png", video: "/videos/heroes/zhuxin/video-1-0.mp4" },
];

const COUNTERS = [
  { name: "Hayabusa", slug: "hayabusa", reason: "High mobility dodges her AoE" },
  { name: "Lancelot", slug: "lancelot", reason: "I-frames negate her burst" },
  { name: "Fanny", slug: "fanny", reason: "Outpaces her zone control" },
];

const SYNERGIES = [
  { name: "Atlas", slug: "atlas", reason: "Setup for her AoE combos" },
  { name: "Tigreal", slug: "tigreal", reason: "CC chain maximizes passive" },
];

export default function HeroIntelTeaser({ heroAssets }: { heroAssets: Record<string, string> }) {
  const [activeSkill, setActiveSkill] = useState(0);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-800 text-center tracking-tight mb-12">Know the hero before you lock it.</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}>
            <div className="relative mx-auto max-w-[280px]">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative">
                <video
                  src="/videos/heroes/zhuxin/video-0-0.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-violet-200 bg-violet-50 text-[9px] font-bold text-violet-600 uppercase tracking-wider">Mage</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-[9px] font-bold text-amber-600 uppercase tracking-wider">
                      <Star className="h-2.5 w-2.5 mr-0.5" /> S-Tier
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-black text-white mt-2">Zhuxin</h3>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[10px] font-mono text-slate-300">61.49% <span className="text-slate-400">Presence</span></span>
                    <span className="text-[10px] font-mono text-cyan-400">51.40% <span className="text-slate-400">WR</span></span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" /> Meta</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {SKILLS.map((s, i) => (
                <button key={s.name} onClick={() => setActiveSkill(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                    activeSkill === i
                      ? "text-cyan-600 border border-cyan-300 bg-cyan-50"
                      : "text-slate-400 border border-slate-200 bg-[#fafbfe] hover:border-cyan-200 hover:text-cyan-500"
                  }`}>
                  <img src={s.icon} alt={s.name} className="w-4 h-4 rounded" loading="lazy" />
                  {s.name}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeSkill} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <div className="rounded-xl overflow-hidden border border-slate-200 mb-3">
                  <video
                    key={SKILLS[activeSkill].video}
                    src={SKILLS[activeSkill].video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="bg-[#fafbfe] border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={SKILLS[activeSkill].icon} alt={SKILLS[activeSkill].name} className="w-6 h-6 rounded" />
                    <span className="text-[11px] font-bold text-slate-800">{SKILLS[activeSkill].name}</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{SKILLS[activeSkill].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mb-5 mt-5">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-red-500" /> Top Counters
              </h4>
              <div className="flex flex-col gap-1.5">
                {COUNTERS.map((c, i) => (
                  <motion.div key={c.name} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2.5 bg-[#fafbfe] border border-slate-200 rounded-lg px-3 py-2 hover:border-red-200 transition-all">
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={resolveHeroPortrait(c.slug, heroAssets)} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-[10px] font-bold text-red-500 w-4">{i + 1}</span>
                    <span className="text-[11px] font-bold text-slate-700">{c.name}</span>
                    <span className="text-[9px] text-slate-400 ml-auto">{c.reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Swords className="h-3 w-3 text-cyan-500" /> Top Synergies
              </h4>
              <div className="flex gap-2">
                {SYNERGIES.map((s, i) => (
                  <motion.div key={s.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={VIEWPORT} transition={{ delay: i * 0.1 }}
                    className="flex-1 bg-[#fafbfe] border border-slate-200 rounded-lg px-3 py-2 hover:border-cyan-200 transition-all flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={resolveHeroPortrait(s.slug, heroAssets)} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">{s.name}</span>
                      <span className="text-[9px] text-slate-400">{s.reason}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button data-testid="cta-explore-heroes" onClick={() => enterApp("intelligence", "Zhuxin")}
              className="group flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-500 transition-colors">
              See Full Analysis <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
