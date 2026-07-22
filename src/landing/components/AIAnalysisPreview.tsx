import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { enterApp } from "../integration";
import { AI_ANALYSIS_PREVIEW } from "../constants/landingDemoData";
import { VIEWPORT } from "../constants/landingAnimations";

const TACTICAL_MODES = [
  { label: "Composition", icon: "🎯" },
  { label: "Win Condition", icon: "⚡" },
  { label: "Risks", icon: "⚠️" },
  { label: "Lane Read", icon: "📊" },
  { label: "Macro Plan", icon: "🗺️" },
];

export default function AIAnalysisPreview() {
  const d = AI_ANALYSIS_PREVIEW;
  const [activeMode, setActiveMode] = useState(0);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-800 text-center tracking-tight mb-3">From draft chaos to a clear gameplan.</h2>
          <p className="text-slate-500 text-sm text-center mb-10 max-w-md mx-auto">Every recommendation backed by data. No random guesses.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl border border-slate-200 bg-[#fafbfe] p-6 sm:p-8">
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Draft Analysis</span>
              <h3 className="text-lg font-bold text-slate-800 mt-1">{d.teamBlue} vs {d.teamRed}</h3>
            </div>
            <div className="flex gap-1.5">
              {d.compositionIdentity.map((c) => (
                <span key={c} className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600 text-[10px] font-bold uppercase tracking-wider">{c}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {TACTICAL_MODES.map((mode, i) => (
              <button
                key={mode.label}
                onClick={() => setActiveMode(i)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeMode === i
                    ? "bg-cyan-50 border border-cyan-300 text-cyan-600 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-[#fafbfe] border border-slate-200 text-slate-400 hover:border-cyan-200 hover:text-cyan-500"
                }`}
              >
                <span>{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeMode === 0 && (
              <motion.div
                key="composition"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-5 p-4 rounded-xl bg-cyan-50 border border-cyan-200">
                  <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-[0.15em]">Win Condition</span>
                  <p className="text-sm text-slate-600 mt-1.5">{d.winCondition}</p>
                </div>

                <div className="mb-5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Risk Distribution</span>
                  <div className="flex gap-1 mt-2 h-2 rounded-full overflow-hidden">
                    <motion.div className="bg-emerald-500/60 rounded-full" initial={{ flexGrow: 0 }} animate={{ flexGrow: d.riskDistribution.early }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} />
                    <motion.div className="bg-amber-500/60 rounded-full" initial={{ flexGrow: 0 }} animate={{ flexGrow: d.riskDistribution.mid }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} />
                    <motion.div className="bg-red-500/60 rounded-full" initial={{ flexGrow: 0 }} animate={{ flexGrow: d.riskDistribution.late }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[9px] text-slate-400 font-mono">
                    <span>Early {d.riskDistribution.early}%</span><span>Mid {d.riskDistribution.mid}%</span><span>Late {d.riskDistribution.late}%</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Draft Warning</span>
                    <p className="text-[11px] text-slate-500 mt-1">{d.draftWarning}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
                    <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-wider">AI Coach Note</span>
                    <p className="text-[11px] text-slate-500 mt-1">"{d.aiCoachNote}"</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMode === 1 && (
              <motion.div
                key="wincon"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 rounded-xl bg-cyan-50 border border-cyan-200">
                  <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-[0.15em]">Primary Win Condition</span>
                  <p className="text-base text-slate-700 mt-2 leading-relaxed">{d.winCondition}</p>
                  <div className="mt-4 pt-4 border-t border-cyan-200">
                    <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-wider">AI Coach Note</span>
                    <p className="text-sm text-slate-500 mt-1 italic">"{d.aiCoachNote}"</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMode === 2 && (
              <motion.div
                key="risks"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Risk Distribution</span>
                  <div className="flex gap-1.5 mt-3 h-3 rounded-full overflow-hidden">
                    <motion.div className="bg-emerald-500/70 rounded-full" initial={{ flexGrow: 0 }} animate={{ flexGrow: d.riskDistribution.early }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} />
                    <motion.div className="bg-amber-500/70 rounded-full" initial={{ flexGrow: 0 }} animate={{ flexGrow: d.riskDistribution.mid }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} />
                    <motion.div className="bg-red-500/70 rounded-full" initial={{ flexGrow: 0 }} animate={{ flexGrow: d.riskDistribution.late }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                    <span>Early {d.riskDistribution.early}%</span><span>Mid {d.riskDistribution.mid}%</span><span>Late {d.riskDistribution.late}%</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Draft Warning</span>
                  <p className="text-sm text-slate-600 mt-1.5">{d.draftWarning}</p>
                </div>
              </motion.div>
            )}

            {activeMode === 3 && (
              <motion.div
                key="lanes"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] block mb-3">Lane Read</span>
                <div className="grid grid-cols-5 gap-3">
                  {d.laneRead.map((l) => (
                    <div key={l.lane} className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 font-mono">{l.lane}</div>
                      <div className={`text-sm font-bold mt-1 ${l.color === "red" ? "text-red-500" : l.color === "cyan" ? "text-cyan-600" : l.color === "emerald" ? "text-emerald-400" : l.color === "amber" ? "text-amber-400" : "text-slate-500"}`}>{l.status}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeMode === 4 && (
              <motion.div
                key="macro"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] block mb-3">Macro Plan</span>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Early Game</span>
                    <p className="text-[11px] text-slate-500 mt-1">Secure vision and contest first objective. Establish lane priority.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Mid Game</span>
                    <p className="text-[11px] text-slate-500 mt-1">Group for Turtle. Force fights with composition spike.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Late Game</span>
                    <p className="text-[11px] text-slate-500 mt-1">Avoid prolonged trades. Look for Lord setup and split-push pressure.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <button data-testid="cta-analyze-your-draft" onClick={() => enterApp("draft")} className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.03]" style={{ background: "linear-gradient(135deg, #7dd3fc, #2563eb)" }}>
              Analyze Your Draft <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
