import { useState, useEffect, useRef, useCallback } from "react";
import { apiUrl } from "../../lib/api";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import DraftIntroLoader from "./DraftIntroLoader";
import CommandBackground from "./CommandBackground";
import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import ProductShowcaseStrip from "./ProductShowcaseStrip";
import HowItWorksSection from "./HowItWorksSection";
import BanPickPOVSection from "./BanPickPOVSection";
import AIAnalysisPreview from "./AIAnalysisPreview";
import MetaIntelligenceSection from "./MetaIntelligenceSection";
import FeatureShowcaseGrid from "./FeatureShowcaseGrid";
import HeroIntelTeaser from "./HeroIntelTeaser";
import PricingSection from "./PricingSection";
import RoadmapSection from "./RoadmapSection";
import FinalCTASection from "./FinalCTASection";
import LandingFooter from "./LandingFooter";
import { registerLandingCallbacks } from "../integration";
import { useReducedMotion } from "../hooks/useReducedMotion";
import CursorField from "./CursorField";

interface Props {
  onChangeTab: (tab: string) => void;
  heroesCount: number;
  onOpenHeroIntelligence?: (heroName: string) => void;
}

function CursorFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button'], input, textarea, select")) {
        setHovering(true);
      }
    };
    const out = () => setHovering(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mouseout", out, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={{
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          borderColor: hovering ? "rgba(6, 182, 212, 0.6)" : "rgba(6, 182, 212, 0.3)",
          backgroundColor: hovering ? "rgba(6, 182, 212, 0.08)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="rounded-full border-2 border-cyan-400/30 flex items-center justify-center"
        style={{ backdropFilter: "blur(2px)" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
      </motion.div>
    </motion.div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollH > 0 ? window.scrollY / scrollH : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: progress,
          background: "linear-gradient(90deg, #06b6d4, #2563eb)",
        }}
      />
    </div>
  );
}

function MouseSpotlight() {
  const reducedMotion = useReducedMotion();
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);
  const springX = useSpring(cursorX, { stiffness: 150, damping: 25 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 25 });
  const bg = useTransform(
    [springX, springY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(6,182,212,0.07), transparent 55%), ` +
      `radial-gradient(900px circle at ${x}px ${y}px, rgba(6,182,212,0.02), transparent 60%)`
  );

  useEffect(() => {
    if (reducedMotion) return;
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 hidden lg:block"
        style={{ background: bg }}
      />
      <motion.div
        className="fixed pointer-events-none z-0 hidden lg:block rounded-full border border-cyan-400/10"
        style={{
          x: springX,
          y: springY,
          width: 120,
          height: 120,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}

export default function LandingPage({ onChangeTab, heroesCount, onOpenHeroIntelligence }: Props) {
  const [introDone, setIntroDone] = useState(() => sessionStorage.getItem("draftIntroSeen") === "true");
  const [heroAssets, setHeroAssets] = useState<Record<string, string>>({});
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerLandingCallbacks(onChangeTab, () => {}, onOpenHeroIntelligence);
  }, [onChangeTab, onOpenHeroIntelligence]);

  useEffect(() => {
    fetch(apiUrl("/api/assets"))
      .then((r) => r.json())
      .then((d) => setHeroAssets(d?.heroes || {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      sessionStorage.setItem("draftIntroSeen", "true");
      setIntroDone(true);
    }
  }, [reducedMotion]);

  const handleIntroComplete = () => {
    setIntroDone(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] overflow-x-hidden">
      {!introDone && <DraftIntroLoader onComplete={handleIntroComplete} />}

      {introDone && (
        <>
          <CursorFollower />
          <CommandBackground />
          <CursorField />
          <ScrollProgress />
          <LandingNavbar />
          <main className="relative z-10">
            <HeroSection heroAssets={heroAssets} />
            <ProductShowcaseStrip />
            <HowItWorksSection />
            <BanPickPOVSection heroAssets={heroAssets} />
            <AIAnalysisPreview />
            <MetaIntelligenceSection heroAssets={heroAssets} />
            <FeatureShowcaseGrid />
            <HeroIntelTeaser heroAssets={heroAssets} />
            <RoadmapSection />
            <FinalCTASection />
            <PricingSection />
          </main>
          <LandingFooter />
        </>
      )}
    </div>
  );
}
