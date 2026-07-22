import { useState, useEffect, useRef, useCallback } from "react";
import { ANIMATION } from "../constants/landingAnimations";

interface BoardPhase {
  bans: { hero: string; side: "blue" | "red" }[];
  picks: { hero: string; side: "blue" | "red" }[];
}

const DEMO_PHASES: BoardPhase[] = [
  { bans: [], picks: [] },
  { bans: [{ hero: "Fanny", side: "red" }], picks: [] },
  { bans: [{ hero: "Fanny", side: "red" }, { hero: "Zhuxin", side: "blue" }], picks: [] },
  { bans: [{ hero: "Fanny", side: "red" }, { hero: "Zhuxin", side: "blue" }, { hero: "Harith", side: "blue" }], picks: [] },
  { bans: [{ hero: "Fanny", side: "red" }, { hero: "Zhuxin", side: "blue" }, { hero: "Harith", side: "blue" }], picks: [{ hero: "Fredrinn", side: "red" }] },
  { bans: [{ hero: "Fanny", side: "red" }, { hero: "Zhuxin", side: "blue" }, { hero: "Harith", side: "blue" }], picks: [{ hero: "Fredrinn", side: "red" }, { hero: "Martis", side: "blue" }] },
];

export function useDraftBoardAnimation(heroAssets: Record<string, string>) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    timerRef.current = setTimeout(() => {
      setPhaseIdx((i) => (i + 1) % DEMO_PHASES.length);
    }, 1800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phaseIdx]);

  const currentPhase = DEMO_PHASES[phaseIdx];

  return { phaseIdx, currentPhase, totalPhases: DEMO_PHASES.length };
}
