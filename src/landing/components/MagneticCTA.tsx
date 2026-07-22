import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  "data-testid"?: string;
}

export default function MagneticCTA({ children, onClick, className = "", variant = "primary", "data-testid": testId }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    mouseX.set(Math.max(-10, Math.min(10, x)));
    mouseY.set(Math.max(-10, Math.min(10, y)));
  }, [mouseX, mouseY, reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }, [mouseX, mouseY]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    }
    setTimeout(() => onClick?.(), 150);
  }, [onClick]);

  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20",
    secondary: "border border-slate-200 text-slate-600 hover:border-cyan-200 hover:text-cyan-600",
    ghost: "text-slate-500 hover:text-slate-700",
  };

  return (
    <motion.button
      ref={ref}
      data-testid={testId}
      data-interactive="true"
      style={{ x: reducedMotion ? 0 : springX, y: reducedMotion ? 0 : springY }}
      className={`relative overflow-hidden rounded-xl font-bold text-sm transition-colors ${variants[variant]} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: reducedMotion ? 1 : 1.03 }}
      whileTap={{ scale: 0.97 }}
      tabIndex={0}
    >
      {variant === "primary" && !reducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: hovered ? "200%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}

      {ripple && (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y, width: 10, height: 10, translateX: "-50%", translateY: "-50%" }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
