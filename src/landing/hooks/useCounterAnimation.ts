import { useRef, useState, useEffect } from "react";
import { ANIMATION } from "../constants/landingAnimations";

export function useCounterAnimation(target: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / ANIMATION.COUNTER_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.floor(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return ref;
}
