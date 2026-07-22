import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function CursorField() {
  const reducedMotion = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -300, y: -300 });
  const currentRef = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number>(0);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = target?.closest("[data-interactive]");
      setIsInteractive(!!interactive);
    };

    const tick = () => {
      const lerpFactor = isInteractive ? 0.25 : 0.12;
      currentRef.current.x = lerp(currentRef.current.x, posRef.current.x, lerpFactor);
      currentRef.current.y = lerp(currentRef.current.y, posRef.current.y, lerpFactor);

      if (fieldRef.current) {
        fieldRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, isInteractive]);

  if (reducedMotion) return null;

  const content = (
    <>
      <div
        ref={fieldRef}
        className="fixed pointer-events-none hidden lg:block"
        style={{
          width: isInteractive ? 400 : 300,
          height: isInteractive ? 400 : 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(6,182,212,${isInteractive ? 0.08 : 0.04}), transparent 70%)`,
          transition: "width 0.2s, height 0.2s, background 0.2s",
          zIndex: 9999,
          left: 0,
          top: 0,
        }}
      />

      <div
        ref={ringRef}
        className="fixed pointer-events-none hidden lg:block"
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: `1px solid rgba(6,182,212,${isInteractive ? 0.4 : 0})`,
          transition: "border-color 0.2s, width 0.2s, height 0.2s",
          zIndex: 9999,
          left: 0,
          top: 0,
        }}
      />
    </>
  );

  return createPortal(content, document.body);
}
