import { useState, useEffect, useRef, RefCallback } from "react";
import { ANIMATION } from "../constants/landingAnimations";

export function useCounterAnimation(
  target: number,
  options: { duration?: number; triggerOnce?: boolean } = {}
) {
  const { duration = ANIMATION.COUNTER_DURATION_MS, triggerOnce = true } = options;
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);

  const ref: RefCallback<Element> = (el) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }
    elementRef.current = el;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          if (triggerOnce) observerRef.current?.unobserve(el);
        }
      },
      { threshold: ANIMATION.SCROLL_THRESHOLD }
    );
    observerRef.current.observe(el);
  };

  useEffect(() => {
    if (!started) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, target, duration]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [ref, count] as const;
}
