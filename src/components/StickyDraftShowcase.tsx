import React from "react";
import { motion, AnimatePresence } from "motion/react";
import LandingDemoCard from "./LandingDemoCard";

interface StickyDraftShowcaseProps {
  activeStep: number;
  heroAssets: Record<string, string>;
  teamAssets: Record<string, string>;
}

const stepMeta = [
  { label: "Draft Structure", accent: "cyan" },
  { label: "Ban Intelligence", accent: "amber" },
  { label: "Hero Deep Dive", accent: "violet" },
  { label: "Team Intelligence", accent: "cyan" },
  { label: "Final Assessment", accent: "emerald" },
];

const accentColors: Record<string, string> = {
  cyan: "border-cyan-500/20 shadow-[0_0_40px_-12px_rgba(0,212,255,0.2)]",
  amber: "border-amber-500/20 shadow-[0_0_40px_-12px_rgba(245,158,11,0.2)]",
  violet: "border-violet-500/20 shadow-[0_0_40px_-12px_rgba(139,92,246,0.2)]",
  emerald: "border-emerald-500/20 shadow-[0_0_40px_-12px_rgba(16,185,129,0.2)]",
};

const accentBorders: Record<string, string> = {
  cyan: "border-cyan-500/30",
  amber: "border-amber-500/30",
  violet: "border-violet-500/30",
  emerald: "border-emerald-500/30",
};

const accentTexts: Record<string, string> = {
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
};

const accentDots: Record<string, string> = {
  cyan: "bg-cyan-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
  emerald: "bg-emerald-400",
};

export default function StickyDraftShowcase({ activeStep, heroAssets, teamAssets }: StickyDraftShowcaseProps) {
  const meta = stepMeta[activeStep] || stepMeta[0];
  const borderClass = accentColors[meta.accent] || accentColors.cyan;

  return (
    <div className="lg:sticky lg:top-[10vh] lg:h-[80vh] flex flex-col">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-3 px-1">
        {stepMeta.map((s, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i === activeStep
                ? `${accentDots[s.accent]} opacity-100`
                : i < activeStep
                ? "bg-white/20"
                : "bg-white/[0.06]"
            }`}
          />
        ))}
      </div>

      {/* Step label */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`h-2 w-2 rounded-full ${accentDots[meta.accent]} animate-pulse`} />
        <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${accentTexts[meta.accent]}`}>
          Step {activeStep + 1} of 5 — {meta.label}
        </span>
      </div>

      {/* Dashboard card */}
      <div className={`flex-1 rounded-2xl border bg-[#f0f4f8]/90 backdrop-blur-md overflow-hidden transition-all duration-500 ${borderClass}`}>
        <div className="p-4 sm:p-5 h-full overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <LandingDemoCard step={activeStep} heroAssets={heroAssets} teamAssets={teamAssets} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom step dots (mobile) */}
      <div className="flex items-center justify-center gap-2 mt-3 lg:hidden">
        {stepMeta.map((s, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              i === activeStep ? `${accentDots[s.accent]} scale-125` : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
