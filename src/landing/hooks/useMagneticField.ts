import { useEffect, useRef } from "react";

interface MagneticElement {
  ref: React.RefObject<HTMLElement>;
  strength: number;
}

export function useMagneticField(containerRef: React.RefObject<HTMLElement>, elements: MagneticElement[]) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        elements.forEach(({ ref, strength }) => {
          const el = ref.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distX = e.clientX - centerX;
          const distY = e.clientY - centerY;
          const dist = Math.sqrt(distX * distX + distY * distY);
          const radius = 80;
          if (dist < radius) {
            const factor = (1 - dist / radius) * strength * 8;
            el.style.transform = `translate(${distX * factor * 0.01}px, ${distY * factor * 0.01}px)`;
          } else {
            el.style.transform = "";
          }
        });
      });
    };

    const handleMouseLeave = () => {
      elements.forEach(({ ref }) => {
        if (ref.current) ref.current.style.transform = "";
      });
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, elements]);
}
