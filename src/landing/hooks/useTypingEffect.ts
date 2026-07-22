import { useState, useEffect } from "react";
import { ANIMATION } from "../constants/landingAnimations";

export function useTypingEffect(lines: string[]) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    if (lines.length === 0) return;
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), ANIMATION.TYPING_CHAR_DELAY_MS + Math.random() * 12);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setLineIdx((i) => (i + 1) % lines.length); setCharIdx(0); }, ANIMATION.TYPING_CYCLE_MS);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, lines]);
  return { currentLine: lines[lineIdx]?.slice(0, charIdx) ?? "", lineIdx, charIdx };
}
