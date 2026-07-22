import { useEffect, useRef, useState, RefCallback } from "react";

export function useIntersectionObserver(
  options: IntersectionObserverInit & { triggerOnce?: boolean } = {}
): [RefCallback<Element>, boolean] {
  const { threshold = 0.15, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
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
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(el);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    observerRef.current.observe(el);
  };

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return [ref, isVisible];
}
