import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import StickyDraftShowcase from "./StickyDraftShowcase";

interface ScrollStoryLandingProps {
  heroAssets: Record<string, string>;
  teamAssets: Record<string, string>;
}

interface StoryStep {
  stepLabel: string;
  headline: string;
  description: string;
  accentColor: string;
}

const storySteps: StoryStep[] = [
  {
    stepLabel: "Phase 1 — Draft Structure",
    headline: "See the battlefield before the game starts.",
    description: "Analyze pick order, team composition gaps, and role distribution at a glance. Every slot tells a strategic story.",
    accentColor: "cyan",
  },
  {
    stepLabel: "Phase 2 — Ban Intelligence",
    headline: "Bans aren't random. Every ban tells a story.",
    description: "Spot what opponents fear most. Protect your win condition. Disrupt their game plan before the first pick.",
    accentColor: "amber",
  },
  {
    stepLabel: "Phase 3 — Hero Deep Dive",
    headline: "Every hero is a data point. Read them all.",
    description: "Attributes, best builds, matchup synergy, and current meta placement — in one scouting report view.",
    accentColor: "violet",
  },
  {
    stepLabel: "Phase 4 — Team Intelligence",
    headline: "Know your opponent before champion select.",
    description: "Recent match history, comfort picks, win patterns, and tendencies — surfaced automatically from real data.",
    accentColor: "cyan",
  },
  {
    stepLabel: "Phase 5 — Final Assessment",
    headline: "Your AI analyst, ready at draft time.",
    description: "Draft score, composition strengths, risk warnings, and real-time adjustments. Local data, AI narration.",
    accentColor: "emerald",
  },
];

const accentTexts: Record<string, string> = {
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
};

const accentBgs: Record<string, string> = {
  cyan: "bg-cyan-500/10 border-cyan-500/20",
  amber: "bg-amber-500/10 border-amber-500/20",
  violet: "bg-violet-500/10 border-violet-500/20",
  emerald: "bg-emerald-500/10 border-emerald-500/20",
};

function StoryStepCard({ step, index, isActive }: { step: StoryStep; index: number; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      data-step={index}
      className={`min-h-[60vh] flex items-center transition-all duration-500 ${isActive ? "opacity-100" : "opacity-40"}`}
    >
      <div className="max-w-md">
        {/* Step label chip */}
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-4 ${accentBgs[step.accentColor]}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "animate-pulse" : ""} bg-current ${accentTexts[step.accentColor]}`} />
          <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.25em] ${accentTexts[step.accentColor]}`}>
            {step.stepLabel}
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight mb-3">
          {step.headline}
        </h3>

        {/* Description */}
        <p className="text-[14px] leading-relaxed text-slate-400/70">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function ScrollStoryLanding({ heroAssets, teamAssets }: ScrollStoryLandingProps) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const setStepRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    stepRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = Number(entry.target.getAttribute("data-step"));
            if (!isNaN(stepIndex)) {
              setActiveStep(stepIndex);
            }
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "-10% 0px -30% 0px",
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
      aria-label="Product feature walkthrough"
    >
      {/* Section header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-500/[0.04] px-3 py-1.5 mb-4">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400/90">How It Works</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white max-w-lg">
          Five Steps to Smarter Drafts
        </h2>
      </div>

      {/* Desktop: side-by-side | Mobile: stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Story steps */}
        <div className="space-y-4" role="list" aria-label="Feature walkthrough steps">
          {storySteps.map((step, i) => (
            <div key={i} role="listitem" ref={setStepRef(i)}>
              <StoryStepCard step={step} index={i} isActive={activeStep === i} />
            </div>
          ))}
        </div>

        {/* Right: Sticky dashboard */}
        <div className="hidden lg:block">
          <StickyDraftShowcase activeStep={activeStep} heroAssets={heroAssets} teamAssets={teamAssets} />
        </div>
      </div>

      {/* Mobile: stacked dashboard cards */}
      <div className="lg:hidden mt-8 space-y-6">
        {storySteps.map((step, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full bg-${step.accentColor}-400`} />
              <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-${step.accentColor}-400`}>
                Step {i + 1} — {step.stepLabel.split("—")[1]?.trim() || step.stepLabel}
              </span>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#f0f4f8]/80 p-4" style={{ maxHeight: "320px", overflowY: "auto" }}>
              <LandingDemoCard step={i} heroAssets={heroAssets} teamAssets={teamAssets} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Re-export LandingDemoCard for mobile use
import LandingDemoCard from "./LandingDemoCard";
