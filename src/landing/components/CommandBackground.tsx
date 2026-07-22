import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function CommandBackground() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden lg:block">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(6,182,212,0.03) 30deg, transparent 60deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.06), transparent)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-cyan-500/10" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-cyan-500/10" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-cyan-500/10" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-cyan-500/10" />

      <motion.div
        className="absolute w-3 h-3 border border-cyan-400/5 rotate-45"
        style={{ top: "20%", left: "15%" }}
        animate={{ y: [0, -20, 0], rotate: [45, 90, 45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-4 h-4 border border-cyan-400/5"
        style={{ top: "60%", right: "20%", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
        animate={{ y: [0, 15, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-2.5 h-2.5 border border-cyan-400/5 rounded-full"
        style={{ top: "40%", left: "70%" }}
        animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-cyan-400/[0.01] blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-400/[0.01] blur-3xl" />
    </div>
  );
}
