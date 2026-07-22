import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Zap, Brain, Shield, Users, Sparkles, Target, BarChart3, Layers } from "lucide-react";
import { enterApp } from "../integration";
import { VIEWPORT } from "../constants/landingAnimations";
import PremiumButton from "./PremiumButton";

function FloatingDot({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-blue-200/40"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Particle({ angle, delay, distance }: { angle: number; delay: number; distance: number }) {
  const rad = (angle * Math.PI) / 180;
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
      style={{ left: "50%", top: "50%" }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: Math.cos(rad) * distance, y: Math.sin(rad) * distance, opacity: 0, scale: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  );
}

function FeatureBadge({ icon: Icon, label, delay }: { icon: React.ElementType; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.08, y: -2 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow cursor-default"
    >
      <Icon className="w-4 h-4 text-cyan-500" />
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </motion.div>
  );
}

function GlowPulse() {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{
        background: "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(37,99,235,0.3))",
        filter: "blur(20px)",
      }}
      animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function InclusionItem({ icon: Icon, text, delay }: { icon: React.ElementType; text: string; delay: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-2 text-sm text-slate-500"
    >
      <Icon className="w-4 h-4 text-emerald-500" />
      <span>{text}</span>
    </motion.li>
  );
}

export default function FinalCTASection() {
  const [particles, setParticles] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, (v) => v - 200);
  const glowY = useTransform(mouseY, (v) => v - 200);

  const fireParticles = () => {
    const angles = Array.from({ length: 24 }, (_, i) => i * 15);
    setParticles(angles);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 overflow-hidden bg-[#f7f8fb]"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          left: glowX,
          top: glowY,
          background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(-45deg, rgba(56,189,248,0.02), rgba(99,102,241,0.02), rgba(168,85,247,0.02), rgba(56,189,248,0.02))",
          backgroundSize: "400% 400%",
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <FloatingDot delay={0} x={15} y={30} size={6} />
        <FloatingDot delay={1.2} x={80} y={20} size={4} />
        <FloatingDot delay={0.6} x={70} y={70} size={5} />
        <FloatingDot delay={1.8} x={25} y={75} size={3} />
        <FloatingDot delay={0.3} x={50} y={10} size={4} />
        <FloatingDot delay={2.0} x={90} y={55} size={5} />
        <FloatingDot delay={0.9} x={35} y={50} size={7} />
        <FloatingDot delay={1.5} x={60} y={85} size={3} />
        <FloatingDot delay={2.3} x={10} y={60} size={5} />
        <FloatingDot delay={0.4} x={85} y={40} size={4} />
        <FloatingDot delay={1.1} x={45} y={25} size={6} />
        <FloatingDot delay={2.6} x={55} y={65} size={3} />
        <FloatingDot delay={0.7} x={20} y={15} size={8} />
        <FloatingDot delay={1.9} x={75} y={90} size={4} />
        <FloatingDot delay={3.0} x={95} y={30} size={5} />
        <FloatingDot delay={0.2} x={5} y={80} size={4} />
        <FloatingDot delay={1.4} x={40} y={45} size={3} />
        <FloatingDot delay={2.8} x={65} y={55} size={6} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/60 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-xs font-semibold text-cyan-600">MLBB Draft Intelligence</span>
          </motion.div>

          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Your enemies won't know{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              what hit them.
            </span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-slate-500 text-sm mt-5 max-w-md mx-auto leading-relaxed"
        >
          Stop guessing. Start dominating. Every ban, pick, and counter — decoded in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          <FeatureBadge icon={Brain} label="132+ Heroes Analyzed" delay={0.2} />
          <FeatureBadge icon={Zap} label="2.3s Analysis Time" delay={0.3} />
          <FeatureBadge icon={Target} label="94% Detection Rate" delay={0.4} />
          <FeatureBadge icon={Shield} label="Free to Use" delay={0.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Join 1000+ players who draft smarter</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <div className="relative">
            <AnimatePresence>
              {particles.length > 0 && particles.map((angle, i) => (
                <Particle key={`${angle}-${i}`} angle={angle} delay={i * 0.015} distance={120} />
              ))}
            </AnimatePresence>

            <GlowPulse />

            <PremiumButton
              variant="primary"
              size="lg"
              data-testid="cta-launch-final"
              onClick={() => { fireParticles(); setTimeout(() => enterApp("draft"), 300); }}
            >
              Launch Draft War Room <ArrowRight className="h-4 w-4" />
            </PremiumButton>
          </div>

          <PremiumButton
            variant="secondary"
            data-testid="cta-analyze-sample"
            onClick={() => enterApp("draft")}
          >
            Analyze Sample Draft
          </PremiumButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 pt-8 border-t border-slate-200/60"
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">What's included</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <InclusionItem icon={Brain} text="AI Draft Analysis" delay={0.45} />
            <InclusionItem icon={BarChart3} text="Hero Intelligence Database" delay={0.5} />
            <InclusionItem icon={Target} text="Counter-Pick Recommendations" delay={0.55} />
            <InclusionItem icon={Layers} text="Team Composition Builder" delay={0.6} />
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
