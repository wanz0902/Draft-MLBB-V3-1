import { useState, useEffect, useCallback } from "react";
import { ANIMATION, INTRO_STEPS } from "../constants/landingAnimations";

interface Props {
  onComplete: () => void;
}

export default function DraftIntroLoader({ onComplete }: Props) {
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    if (done) return;
    setDone(true);
    sessionStorage.setItem("draftIntroSeen", "true");
    setFading(true);
    setTimeout(() => onComplete(), ANIMATION.INTRO_FADE_OUT_MS);
  }, [done, onComplete]);

  useEffect(() => {
    if (sessionStorage.getItem("draftIntroSeen") === "true") {
      onComplete();
      return;
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion && !done) {
      sessionStorage.setItem("draftIntroSeen", "true");
      onComplete();
    }
  }, [reducedMotion, done, onComplete]);

  useEffect(() => {
    if (reducedMotion || done) return;
    const start = performance.now();
    const duration = ANIMATION.INTRO_TOTAL_MS;
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setProgress(Math.floor(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, done, finish]);

  useEffect(() => {
    if (reducedMotion || done) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    INTRO_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStepIdx(i), i * ANIMATION.INTRO_STEP_DELAY_MS));
    });
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion, done]);

  if (reducedMotion || sessionStorage.getItem("draftIntroSeen") === "true") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading DraftMLBB"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f7f8fb] transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(14,165,233,0.02) 2px, rgba(14,165,233,0.02) 4px)" }} />
      
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.03) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

      <div className="relative z-10 flex flex-col items-center gap-7">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #7dd3fc, #2563eb)", fontFamily: "JetBrains Mono, monospace", boxShadow: "0 0 40px rgba(14,165,233,0.15)" }}>
          ML
        </div>

        <div className="text-sm font-semibold text-slate-700 tracking-tight">Draft Analyst</div>

        <div className="w-[180px] h-[1px] rounded bg-slate-200 overflow-hidden">
          <div className="h-full rounded transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7dd3fc, #2563eb)", boxShadow: "0 0 8px rgba(125,211,252,0.3)" }} />
        </div>

        <div className="font-mono text-[10px] text-cyan-600/50 tracking-[0.1em] uppercase min-h-[16px]">
          {INTRO_STEPS[stepIdx]}
        </div>
      </div>
    </div>
  );
}
