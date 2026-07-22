import { useState, useEffect, useRef, useCallback } from "react";
import { ANIMATION } from "../constants/landingAnimations";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  "Booting Draft Engine…",
  "Loading 132 Hero Intelligence…",
  "Reading MPL ID S17 data…",
  "Syncing Global Rank Meta…",
  "Building draft signals…",
  "AI Coach ready.",
];

const SESSION_KEY = "draftIntroSeen";

export default function DraftIntroLoader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const [skip, setSkip] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (prefersReduced) setSkip(true);
  }, [prefersReduced]);

  useEffect(() => {
    if (skip) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onComplete();
    }
  }, [skip, onComplete]);

  useEffect(() => {
    if (skip) return;

    document.body.style.overflow = "hidden";

    const startTime = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(elapsed / ANIMATION.INTRO_TOTAL_MS, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setProgress(Math.floor(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        timers.current.push(setTimeout(() => setFade(true), 200));
        timers.current.push(setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, "1");
          document.body.style.overflow = "";
          onComplete();
        }, ANIMATION.INTRO_FADE_OUT_MS + 200));
      }
    };

    timers.current.push(setTimeout(() => requestAnimationFrame(tick), 100));

    STEPS.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(setTimeout(() => setStepIdx(i), 100 + i * ANIMATION.INTRO_STEP_DELAY_MS));
    });

    return () => {
      timers.current.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [skip, onComplete]);

  if (skip) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading DraftMLBB"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        opacity: fade ? 0 : 1,
        transition: `opacity ${ANIMATION.INTRO_FADE_OUT_MS}ms cubic-bezier(.25,.1,.25,1)`,
        pointerEvents: fade ? "none" : "auto",
      }}
    >
      {/* Scanline */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(125,211,252,0.012) 2px, rgba(125,211,252,0.012) 4px)",
          animation: "scanlineScroll 8s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Hero silhouette blur */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          pointerEvents: "none",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: `rgba(125,211,252,${0.02 + i * 0.005})`,
              filter: "blur(16px)",
              animation: `silhouetteDrift ${8 + i * 2}s ease-in-out ${i * 0.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(125,211,252,0.04) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Ban/pick slot blink */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 8,
          pointerEvents: "none",
          opacity: 0.15,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid rgba(125,211,252,0.3)",
              animation: `slotBlink 1.2s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {/* Logo */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(135deg, #7dd3fc, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 900,
            fontFamily: "JetBrains Mono, monospace",
            color: "#ffffff",
            boxShadow: "0 0 40px rgba(125,211,252,0.25)",
            animation: "introFadeIn 0.4s ease-out both",
          }}
        >
          DL
        </div>

        {/* App name */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: "-0.2px",
            fontFamily: "Inter, sans-serif",
            animation: "introFadeIn 0.4s ease-out 0.1s both",
          }}
        >
          DraftMLBB
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 200,
            height: 1,
            borderRadius: 1,
            background: "rgba(0,0,0,0.06)",
            overflow: "hidden",
            animation: "introFadeIn 0.4s ease-out 0.2s both",
          }}
        >
          <div
            style={{
              height: "100%",
              width: progress + "%",
              background: "linear-gradient(90deg, #7dd3fc, #3b82f6)",
              borderRadius: 1,
              transition: "width 0.1s linear",
              boxShadow: "0 0 8px rgba(125,211,252,0.3)",
            }}
          />
        </div>

        {/* Step text */}
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "rgba(125,211,252,0.5)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            animation: "introFadeIn 0.4s ease-out 0.3s both",
            minHeight: 16,
          }}
        >
          {STEPS[stepIdx]}
        </div>
      </div>

      <style>{`
        @keyframes introFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanlineScroll {
          from { transform: translateY(0); }
          to { transform: translateY(4px); }
        }
        @keyframes slotBlink {
          0%, 100% { border-color: rgba(125,211,252,0.1); }
          50% { border-color: rgba(125,211,252,0.4); box-shadow: 0 0 8px rgba(125,211,252,0.15); }
        }
        @keyframes silhouetteDrift {
          from { transform: translateX(-20px); }
          to { transform: translateX(20px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
