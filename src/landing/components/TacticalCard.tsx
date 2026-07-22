import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SPRING_MAGNETIC, SPRING_SNAP } from "../constants/motionConstants";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  highlighted?: boolean;
  "data-testid"?: string;
}

export default function TacticalCard({
  children,
  className = "",
  onClick,
  highlighted = false,
  "data-testid": testId,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, SPRING_MAGNETIC);
  const springRY = useSpring(rotateY, SPRING_MAGNETIC);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = -((e.clientY - cy) / (rect.height / 2)) * 6;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * 8;
      rotateX.set(rx);
      rotateY.set(ry);
      setSpotPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [rotateX, rotateY, reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
    setSpotPos({ x: 50, y: 50 });
  }, [rotateX, rotateY]);

  const handleMouseDown = useCallback(() => {
    if (!reducedMotion) {
      rotateX.set(rotateX.get() * 0.5);
      rotateY.set(rotateY.get() * 0.5);
    }
  }, [rotateX, rotateY, reducedMotion]);

  return (
    <motion.div
      ref={ref}
      data-testid={testId}
      data-interactive="true"
      style={{
        rotateX: reducedMotion ? 0 : springRX,
        rotateY: reducedMotion ? 0 : springRY,
        perspective: 800,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl transition-colors ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      whileHover={{ y: reducedMotion ? 0 : -4 }}
      whileTap={{ scale: 0.985 }}
      tabIndex={0}
      role={onClick ? "button" : undefined}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200 z-10"
        style={{
          opacity: hovered && !reducedMotion ? 1 : 0,
          background: `radial-gradient(circle 200px at ${spotPos.x}% ${spotPos.y}%, rgba(6,182,212,0.08), transparent)`,
        }}
      />

      {highlighted && !reducedMotion && (
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none -z-10"
          style={{
            background: `conic-gradient(from 0deg at ${spotPos.x}% ${spotPos.y}%, rgba(6,182,212,0.3), transparent 60deg, transparent 300deg, rgba(6,182,212,0.3))`,
          }}
          animate={{ opacity: hovered ? 0.8 : 0.3 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}
