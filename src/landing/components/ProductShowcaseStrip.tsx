import { motion } from "framer-motion";
import { Swords, BrainCircuit, TrendingUp, Database, Users, Target, Map, ChevronRight } from "lucide-react";
import { enterApp } from "../integration";
import { FEATURE_CARDS } from "../constants/landingDemoData";
import { VIEWPORT } from "../constants/landingAnimations";

const ICONS: Record<string, React.FC<{ className?: string }>> = {
  draft: Swords, intel: BrainCircuit, stats: TrendingUp, catalog: Database,
  teams: Users, planner: Target, macro: Map,
};

export default function ProductShowcaseStrip() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-800 text-center tracking-tight mb-3">One platform. Every draft weapon.</h2>
          <p className="text-slate-500 text-sm text-center mb-10 max-w-md mx-auto">Every tool you need to read, plan, and win the draft phase.</p>
        </motion.div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
          {FEATURE_CARDS.map((card, i) => {
            const Icon = ICONS[card.id] || Swords;
            return (
              <motion.button key={card.id} data-testid={card.testId} onClick={() => enterApp(card.ctaTargetTab as any)}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="snap-start shrink-0 w-[240px] sm:w-[260px] rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left hover:border-cyan-200 hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-cyan-600 transition-colors">{card.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{card.description}</p>
                <div className="mt-3 text-[10px] font-bold text-cyan-500 flex items-center gap-1">{card.ctaLabel} <ChevronRight className="h-3 w-3" /></div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
