import { useState, useEffect, useRef, useCallback } from "react";
import { ANIMATION } from "../constants/landingAnimations";

export function useTypingEffect(
  lines: string[],
  options: { charDelay?: number; cycleDelay?: number } = {}
) {
  const { charDelay = ANIMATION.TYPING_CHAR_DELAY_MS, cycleDelay = ANIMATION.TYPING_CYCLE_MS } = options;
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) {
      setCharIdx(lines[currentLineIdx]?.length || 0);
      return;
    }

    const line = lines[currentLineIdx];
    if (!line) return;

    if (charIdx < line.length) {
      timerRef.current = setTimeout(
        () => setCharIdx((i) => i + 1),
        charDelay + Math.random() * 18
      );
    } else {
      timerRef.current = setTimeout(() => {
        setCurrentLineIdx((i) => (i + 1) % lines.length);
        setCharIdx(0);
      }, cycleDelay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentLineIdx, charIdx, lines, charDelay, cycleDelay, prefersReduced]);

  const currentText = lines[currentLineIdx]?.slice(0, charIdx) || "";
  const currentLine = lines[currentLineIdx] || "";

  return { currentText, currentLine, currentLineIdx };
}
