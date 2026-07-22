import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SPRING_SNAP, SPRING_MAGNETIC, SPRING_PRESS } from "../constants/motionConstants";

type BtnState = "idle" | "hover" | "armed" | "confirming";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  "data-testid"?: string;
  disabled?: boolean;
}

export default function PremiumButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  "data-testid": testId,
  disabled = false,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<BtnState>("idle");
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING_MAGNETIC);
  const springY = useSpring(mouseY, SPRING_MAGNETIC);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !ref.current || disabled) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseX.set(x * 8);
      mouseY.set(y * 6);
      ref.current.style.setProperty("--cursor-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      ref.current.style.setProperty("--cursor-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    },
    [mouseX, mouseY, reducedMotion, disabled]
  );

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setState("hover");
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setState("idle");
  }, [mouseX, mouseY]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      setState("armed");
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
      }
    },
    [disabled]
  );

  const handleMouseUp = useCallback(() => {
    if (disabled) return;
    setState("confirming");
    setTimeout(() => {
      onClick?.();
      setState("idle");
    }, reducedMotion ? 0 : 150);
  }, [onClick, disabled, reducedMotion]);

  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      ref={ref}
      data-testid={testId}
      data-interactive={isPrimary ? "cta" : "true"}
      disabled={disabled}
      style={{
        x: reducedMotion ? 0 : springX,
        y: reducedMotion ? 0 : springY,
        "--cursor-x": "50%",
        "--cursor-y": "50%",
      } as React.CSSProperties}
      className={`
        relative overflow-hidden rounded-xl font-bold uppercase tracking-wider
        transition-colors select-none cursor-pointer
        ${sizeClasses[size]}
        ${isPrimary ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : ""}
        ${isSecondary ? "border border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600" : ""}
        ${variant === "ghost" ? "text-slate-500 hover:text-slate-700" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      animate={{
        y: state === "armed" ? 1 : state === "hover" ? -2 : 0,
        scale: state === "armed" ? 0.97 : state === "confirming" ? 1.02 : 1,
        filter:
          state === "armed"
            ? "brightness(1.15)"
            : state === "confirming"
              ? "brightness(1.3)"
              : "brightness(1)",
      }}
      transition={{
        type: "spring",
        ...(state === "armed" ? SPRING_PRESS : SPRING_SNAP),
      }}
      whileFocus={{ outline: "2px solid rgba(6,182,212,0.5)", outlineOffset: "2px" }}
      tabIndex={0}
    >
      {isPrimary && !reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-150"
          style={{
            opacity: state === "hover" || state === "armed" ? 1 : 0,
            background: `radial-gradient(circle 120px at var(--cursor-x) var(--cursor-y), rgba(255,255,255,0.15), transparent)`,
          }}
        />
      )}

      {isPrimary && state === "hover" && !reducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-full w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12" />
        </motion.div>
      )}

      {ripple && (
        <motion.div
          key={ripple.key}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            translateX: "-50%",
            translateY: "-50%",
            background: isPrimary ? "rgba(255,255,255,0.35)" : "rgba(6,182,212,0.3)",
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {state === "armed" && !reducedMotion && (
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: isPrimary ? "rgba(255,255,255,0.6)" : "rgba(6,182,212,0.5)" }}
          initial={{ top: 0, opacity: 0.8 }}
          animate={{ top: "100%", opacity: 0 }}
          transition={{ duration: 0.08, ease: "linear" }}
        />
      )}

      {state === "idle" && isPrimary && !reducedMotion && (
        <div className="absolute inset-0 rounded-xl border border-white/10 animate-border-glow pointer-events-none" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
