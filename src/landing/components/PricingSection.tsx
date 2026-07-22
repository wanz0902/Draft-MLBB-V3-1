import type React from "react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { enterApp } from "../integration";
import { PRICING_TIERS } from "../constants/pricingData";
import { VIEWPORT } from "../constants/landingAnimations";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useCounterAnimation } from "../hooks/useCounterAnimation";
import PremiumButton from "./PremiumButton";

function parsePriceNumeric(priceStr: string): number {
  const match = priceStr.replace(/\./g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function parsePriceThousands(priceStr: string): number {
  const numeric = parsePriceNumeric(priceStr);
  return Math.round(numeric / 1000);
}

function PriceDisplay({ price }: { price: string }) {
  const thousands = parsePriceThousands(price);
  const counterRef = useCounterAnimation(thousands);

  return (
    <span className="font-[family-name:var(--font-display)] text-3xl font-black text-slate-900">
      Rp<span ref={counterRef}>{thousands}</span>.000
    </span>
  );
}

function PricingCard({ tier, index }: { tier: (typeof PRICING_TIERS)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 20 });
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    if (window.innerWidth < 1024) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - y) * 10);
    rotateY.set((x - 0.5) * 10);
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x: px, y: py });
  }

  function handleMouseLeave() {
    if (reducedMotion) return;
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      role="listitem"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(6,182,212,0.12)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 600, rotateX: springX, rotateY: springY }}
      className={`group rounded-2xl border p-6 flex flex-col relative ${
        tier.highlighted
          ? "border-cyan-300 bg-white shadow-lg shadow-cyan-500/10"
          : "border-slate-200 bg-[#fafbfe]"
      }`}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at ${spotPos.x}% ${spotPos.y}%, rgba(6,182,212,0.06), transparent 60%)`,
        }}
      />
      {tier.highlighted && (
        <motion.div
          className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-cyan-400/20 -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {tier.badge && (
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600 text-[10px] font-bold uppercase tracking-wider mb-3">
          <motion.span
            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-3 w-3" />
          </motion.span> {tier.badge}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-800 mb-1">{tier.name}</h3>
      <div className="flex items-baseline gap-1">
        <PriceDisplay price={tier.price} />
        <span className="text-sm text-slate-400">{tier.period}</span>
      </div>
      <ul className="mt-5 space-y-2.5 flex-1">
        {tier.features.map((f, fi) => (
          <motion.li
            key={f}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: fi * 0.06 }}
            className="flex items-start gap-2 text-sm text-slate-600"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{f}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-auto">
        <PremiumButton
          variant={tier.highlighted ? "primary" : "secondary"}
          size="sm"
          data-testid={tier.testId}
          onClick={() => enterApp(tier.ctaTarget)}
          className="mt-6 w-full"
        >
          {tier.ctaLabel}
        </PremiumButton>
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f7f8fb]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 id="pricing-title" className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-3">
            Choose Your War Room
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Choose the plan that fits your draft grind.
          </p>
        </motion.div>

        <div role="list" className="grid md:grid-cols-3 gap-5 mt-12">
          {PRICING_TIERS.map((tier, i) => (
            <PricingCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-[11px] text-slate-400 mt-8"
        >
          Semua harga dalam Rupiah. Berlangganan kapan saja, batalkan kapan saja.
        </motion.p>
      </div>
    </section>
  );
}
