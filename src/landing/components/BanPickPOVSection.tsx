import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveHeroPortrait } from "../integration";
import { BAN_PICK_PHASES } from "../constants/landingDemoData";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { VIEWPORT } from "../constants/landingAnimations";

const TERMINAL_LINES = [
  "Scanning hero pool...",
  "Cross-referencing 132 hero interactions...",
  "Pattern match: engage comp detected",
  "Risk assessment: low sustain identified",
  "Win condition: force Turtle 1-2, snowball mid",
  "Counter-strategy generated",
  "Lane read complete — EXP slight win, GOLD danger",
  "Analysis complete in 2.3s",
];

const PHASE_SEQUENCE = [
  { label: "Ban Phase 1", blue: 0, red: 0 },
  { label: "Ban Phase 2", blue: 1, red: 1 },
  { label: "Pick Phase 1", blue: 2, red: 2 },
  { label: "Ban Phase 3", blue: 3, red: 3 },
  { label: "Pick Phase 2", blue: 4, red: 4 },
];

const CONFIDENCE_VALUES = [91, 87, 94, 82, 89];

export default function BanPickPOVSection({ heroAssets }: { heroAssets: Record<string, string> }) {
  const [activeStep, setActiveStep] = useState(0);
  const [timer, setTimer] = useState(35);
  const [showTerminal, setShowTerminal] = useState(false);

  const typed = useTypingEffect(TERMINAL_LINES);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep((s) => (s < PHASE_SEQUENCE.length - 1 ? s + 1 : s));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (activeStep >= 2 && !showTerminal) setShowTerminal(true);
  }, [activeStep, showTerminal]);

  useEffect(() => {
    const t = setInterval(() => setTimer((v) => (v > 1 ? v - 1 : 35)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="demo" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-3">
            Watch the AI coach in real-time
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            See how DraftMLBB reads every draft phase and turns it into strategic insight.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 sm:p-6 shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Blue Side</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-600">{timer}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {PHASE_SEQUENCE[Math.min(activeStep, PHASE_SEQUENCE.length - 1)].label}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Red Side</span>
              </div>

              <div className="mb-3">
                <span className="text-[8px] text-slate-400 font-mono uppercase block mb-1.5">Bans</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const filled = i <= activeStep && BAN_PICK_PHASES[i % BAN_PICK_PHASES.length];
                    const isBan = filled?.action === "ban";
                    const heroSlug = BAN_PICK_PHASES[i % BAN_PICK_PHASES.length]?.heroName?.toLowerCase();
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg border flex items-center justify-center overflow-hidden transition-all duration-500 ${
                          isBan ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <AnimatePresence>
                          {isBan && (
                            <motion.img
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              src={resolveHeroPortrait(heroSlug || "fanny", heroAssets)}
                              alt={heroSlug}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-3">
                <span className="text-[8px] text-slate-400 font-mono uppercase block mb-1.5">Picks</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[3, 4, 5, 6, 7].map((i) => {
                    const filled = i <= activeStep + 2 && BAN_PICK_PHASES[(i - 2) % BAN_PICK_PHASES.length];
                    const isPick = filled?.action === "pick";
                    const heroSlug = BAN_PICK_PHASES[(i - 2) % BAN_PICK_PHASES.length]?.heroName?.toLowerCase();
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl border flex items-center justify-center overflow-hidden transition-all duration-500 ${
                          isPick ? "border-blue-200 bg-blue-50 shadow-sm shadow-blue-100" : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <AnimatePresence>
                          {isPick && (
                            <motion.img
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              src={resolveHeroPortrait(heroSlug || "lancelot", heroAssets)}
                              alt={heroSlug}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-1.5 mt-4">
                {PHASE_SEQUENCE.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      i <= activeStep ? "bg-cyan-500 scale-125" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <div className="space-y-3">
            {BAN_PICK_PHASES.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`rounded-xl border p-4 transition-all duration-500 ${
                  i === activeStep
                    ? "border-slate-200 bg-[#fafbfe] shadow-sm opacity-100 scale-[1.01]"
                    : "border-slate-100 bg-slate-50 opacity-40"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${phase.side === "red" ? "bg-red-500" : "bg-blue-500"}`} />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    {phase.action === "ban" ? "Ban" : "Pick"}: {phase.heroName} ({phase.side === "blue" ? "Blue" : "Red"})
                  </span>
                  <span className="ml-auto text-[9px] font-mono text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-full px-1.5 py-0.5">
                    AI {CONFIDENCE_VALUES[i]}%
                  </span>
                </div>
                {phase.commentary.map((c, j) => (
                  <p key={j} className="text-[12px] text-slate-500 leading-relaxed">{c}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 sm:p-6 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                }}
              />
              <motion.div
                className="absolute left-0 right-0 h-8 bg-gradient-to-b from-cyan-400/5 to-transparent"
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[10px] font-mono text-slate-500">draft_engine.log</span>
            </div>
            <div className="font-mono text-[11px] leading-relaxed min-h-[140px]">
              <AnimatePresence>
                {showTerminal && (
                  <>
                    {TERMINAL_LINES.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: i <= (typed.lineIdx || 0) ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-cyan-600 select-none">&gt;</span>
                        <span className={`${i === (typed.lineIdx || 0) ? "text-emerald-400" : i < (typed.lineIdx || 0) ? "text-slate-400" : "text-transparent"}`}>
                          {i < (typed.lineIdx || 0) ? line : i === (typed.lineIdx || 0) ? typed.currentLine : line}
                        </span>
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
              {!showTerminal && (
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-cyan-600 select-none">&gt;</span>
                  <span>Initializing draft analysis...</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
