import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Sword, Shield, Crosshair, Gem } from "lucide-react";
import { enterApp, resolveHeroPortrait, getHeroList } from "../integration";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ANIMATION } from "../constants/landingAnimations";
import { AI_COACH_LINES } from "../constants/landingDemoData";
import PremiumButton from "./PremiumButton";

const ROLE_ICONS: Record<string, typeof Sword> = {
  Assassin: Sword,
  Fighter: Shield,
  Marksman: Crosshair,
  Mage: Gem,
  Tank: Shield,
  Support: Gem,
};

const FLOATING_DOTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  duration: 15 + Math.random() * 20,
  delay: Math.random() * 5,
}));

export default function HeroSection({ heroAssets }: { heroAssets: Record<string, string> }) {
  const reducedMotion = useReducedMotion();
  const heroList = useMemo(() => getHeroList(), []);
  const [activeIdx, setActiveIdx] = useState(0);
  const { currentLine } = useTypingEffect(AI_COACH_LINES);
  const sectionRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseRef.current = { x, y };
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % 8), ANIMATION.HERO_ROTATE_MS);
    return () => clearInterval(t);
  }, [reducedMotion]);

  const featuredSlugs = useMemo(() => ["fanny", "zhuxin", "martis", "beatrix", "tigreal", "atlas", "valentina", "fredrinn"], []);

  const parallaxX = (mousePos.x - 0.5) * -20;
  const parallaxY = (mousePos.y - 0.5) * -15;
  const tiltX = (mousePos.y - 0.5) * 8;
  const tiltY = (mousePos.x - 0.5) * -8;

  const headlineWords1 = "Bukan cuma pick hero.".split(" ");
  const headlineWords2 = "Ini Draft War Room.".split(" ");

  const blueBans = [0, 1, 2, 3, 4];
  const redBans = [0, 1, 2, 3, 4];
  const bluePicks = [0, 1, 2, 3, 4];
  const redPicks = [0, 1, 2, 3, 4];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
            left: `calc(30% + ${parallaxX * 1.5}px)`,
            top: `calc(40% + ${parallaxY * 1.5}px)`,
            transition: "left 0.3s ease-out, top 0.3s ease-out",
          }}
        />

        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0f172a" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {FLOATING_DOTS.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              width: dot.size,
              height: dot.size,
              left: `${dot.x}%`,
              top: `${dot.y}%`,
            }}
            animate={reducedMotion ? {} : {
              y: [0, -30, 0, 20, 0],
              x: [0, 10, -10, 5, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: dot.duration,
              delay: dot.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
            right: `calc(10% + ${parallaxX * -0.8}px)`,
            bottom: `calc(10% + ${parallaxY * -0.8}px)`,
            transition: "right 0.4s ease-out, bottom 0.4s ease-out",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="glitch-text font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900">
              {headlineWords1.map((word, i) => (
                <motion.span
                  key={`w1-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {headlineWords2.map((word, i) => (
                <motion.span
                  key={`w2-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                  className="inline-block mr-[0.3em]"
                >
                  {i === headlineWords2.length - 1 ? (
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #2563eb)" }}>
                      {word}
                    </span>
                  ) : (
                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #2563eb)" }}>
                      {word}
                    </span>
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-5 text-slate-500 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              DraftMLBB reads bans, detects enemy signals, simulates hero picks, and turns every draft into a tactical gameplan.
            </motion.p>

            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { label: "Draft Engine Online", color: "bg-emerald-400" },
                { label: "MPL Data Synced", color: "bg-cyan-400" },
                { label: "Enemy Signal Reading", color: "bg-amber-400" },
                { label: "Counter Matrix Ready", color: "bg-violet-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-slate-200 bg-[#fafbfe]">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.color} animate-pulse`} />
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.05 }}
              className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start"
            >
              <PremiumButton
                data-testid="cta-open-warroom"
                onClick={() => enterApp("draft")}
                className="px-6 py-3"
              >
                <span>Open Draft War Room</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </PremiumButton>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
              >
                See How It Works
              </motion.a>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                transform: reducedMotion ? undefined : `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <motion.div
                animate={reducedMotion ? {} : {
                  boxShadow: [
                    "0 0 0 1px rgba(6,182,212,0.1), 0 0 20px rgba(6,182,212,0.05)",
                    "0 0 0 1px rgba(6,182,212,0.25), 0 0 30px rgba(6,182,212,0.1)",
                    "0 0 0 1px rgba(6,182,212,0.1), 0 0 20px rgba(6,182,212,0.05)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-cyan-200 bg-white p-5 sm:p-6"
                style={{
                  transform: reducedMotion ? undefined : `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Blue Side</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Red Side</span>
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[8px] text-slate-400 font-mono uppercase w-8">Bans</span>
                  <div className="flex gap-1.5 flex-1">
                    {blueBans.map((i) => {
                      const show = (i === 0 && activeIdx >= 1) || (i === 1 && activeIdx >= 2) || (i === 2 && activeIdx >= 3);
                      return (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={show ? { scale: [0.8, 1], opacity: [0, 1] } : { opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center overflow-hidden ${show ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-slate-50"}`}
                        >
                          {show ? (
                            <img loading="lazy" src={resolveHeroPortrait(featuredSlugs[i], heroAssets)} alt={featuredSlugs[i]} className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-slate-100" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="w-px h-5 bg-slate-200 mx-1" />
                  <div className="flex gap-1.5 flex-1">
                    {redBans.map((i) => {
                      const show = (i === 0 && activeIdx >= 4) || (i === 1 && activeIdx >= 5);
                      return (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={show ? { scale: [0.8, 1], opacity: [0, 1] } : { opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center overflow-hidden ${show ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                        >
                          {show ? (
                            <img loading="lazy" src={resolveHeroPortrait(featuredSlugs[i + 3], heroAssets)} alt={featuredSlugs[i + 3]} className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-slate-100" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-slate-400 font-mono uppercase w-8">Picks</span>
                  <div className="flex gap-1.5 flex-1">
                    {bluePicks.map((i) => {
                      const show = i === 0 && activeIdx >= 6;
                      return (
                        <motion.div
                          key={i}
                          initial={false}
                          animate={show ? { scale: [0.85, 1], opacity: [0, 1] } : { opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl border flex items-center justify-center overflow-hidden ${show ? "border-blue-300 bg-blue-50 shadow-lg shadow-blue-500/10" : "border-slate-200 bg-slate-50"}`}
                        >
                          {show ? (
                            <img loading="lazy" src={resolveHeroPortrait(featuredSlugs[4], heroAssets)} alt="hero" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-100" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="w-px h-5 bg-slate-200 mx-1" />
                  <div className="flex gap-1.5 flex-1">
                    {redPicks.map((i) => (
                      <div key={i} className="w-9 h-11 sm:w-11 sm:h-13 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-1.5 mt-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                      key={i}
                      animate={i <= activeIdx ? { scale: [1, 1.3, 1], backgroundColor: "#2563eb" } : { backgroundColor: "#e2e8f0" }}
                      transition={{ duration: 0.3 }}
                      className="w-1.5 h-1.5 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-4 rounded-xl border border-slate-200 bg-slate-900 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">AI Coach</span>
                </div>
                <div className="font-mono text-[11px] text-green-400 leading-relaxed min-h-[36px]">
                  {reducedMotion ? AI_COACH_LINES[0] : currentLine}
                  <span className="inline-block w-[2px] h-3 bg-green-400 ml-0.5 align-middle animate-[pulse_1s_ease-in-out_infinite]" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-700/50">
                  {[
                    "Draft Engine Online",
                    "MPL Data Synced",
                    "Enemy Signal Reading",
                    "Counter Matrix Ready",
                  ].map((label) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-700/60 bg-slate-800/60"
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
