import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, Cpu, Zap, Shield, Swords, Crosshair } from "lucide-react";
import { VIEWPORT } from "../constants/landingAnimations";

const SIGNALS = [
  { hero: "Fanny", text: "Early jungle pressure denied. Enemy fears aggression.", type: "threat" as const },
  { hero: "Zhuxin", text: "Zone control threat removed. Space is open.", type: "opportunity" as const },
  { hero: "Badang", text: "Noise ban detected. Real intent hidden.", type: "deception" as const },
];

const PATTERNS = [
  { label: "Counter-strategy detected", confidence: 92, icon: Shield, color: "text-emerald-600" },
  { label: "Win condition identified", confidence: 88, icon: Crosshair, color: "text-blue-600" },
  { label: "Deception pattern found", confidence: 76, icon: Swords, color: "text-amber-500" },
];

const LANES = [
  { lane: "EXP", status: "slight win", color: "bg-emerald-500" },
  { lane: "JGL", status: "neutral", color: "bg-slate-400" },
  { lane: "MID", status: "safe", color: "bg-cyan-500" },
  { lane: "GOLD", status: "danger", color: "bg-red-500" },
  { lane: "ROAM", status: "flexible", color: "bg-amber-500" },
];

const HERO_SLUGS = ["fanny", "zhuxin", "badang", "fredrinn", "lancelot"];

const HERO_IMG: Record<string, string> = {
  fanny: "/raw-assets/aset_hero/assassin/85px-ML_icon_Fanny.png",
  zhuxin: "/raw-assets/aset_hero/mage/85px-ML_icon_Zhuxin.png",
  badang: "/raw-assets/aset_hero/fighter/85px-ML_icon_Badang.png",
  fredrinn: "/raw-assets/aset_hero/tank/85px-ML_icon_Fredrinn.png",
  lancelot: "/raw-assets/aset_hero/assassin/85px-ML_icon_Lancelot_2021.png",
};

const SIG_STYLE = { threat: "border-red-200 bg-red-50", opportunity: "border-emerald-200 bg-emerald-50", deception: "border-amber-200 bg-amber-50" };
const SIG_TEXT = { threat: "text-red-600", opportunity: "text-emerald-600", deception: "text-amber-600" };
const SIG_DOT = { threat: "bg-red-500", opportunity: "bg-emerald-500", deception: "bg-amber-500" };

function SignalDetection() {
  const [sig, setSig] = useState(0);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const s = setInterval(() => setFilled((f) => (f < 3 ? f + 1 : f)), 1200);
    return () => clearInterval(s);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSig((i) => (i + 1) % SIGNALS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const cur = SIGNALS[sig];

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Radar className="h-4 w-4 text-cyan-600" />
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Signal Detection</span>
        <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">94% detection rate</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`aspect-square rounded-lg border flex items-center justify-center overflow-hidden transition-all duration-500 ${i < filled ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-slate-50"}`}>
            {i < filled && <img src={HERO_IMG[HERO_SLUGS[i]] || `/raw-assets/regular_season_files/60px-ML_icon_${HERO_SLUGS[i]}.png`} alt={HERO_SLUGS[i]} className="w-full h-full object-cover" loading="lazy" />}
          </div>
        ))}
      </div>
      <div className="relative h-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={sig} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.96 }} transition={{ duration: 0.35 }}
            className={`absolute inset-0 rounded-xl border p-3 ${SIG_STYLE[cur.type]}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${SIG_DOT[cur.type]}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${SIG_TEXT[cur.type]}`}>{cur.type}</span>
              <span className="text-[10px] text-slate-400 ml-auto">{cur.hero}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{cur.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PatternRecognition() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pattern Recognition</span>
      </div>
      <div className="relative mb-4 rounded-lg border border-slate-200 bg-slate-50 h-16 overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100/60 to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-mono text-slate-400">Scanning hero pool...</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {PATTERNS.map((p, i) => (
          <motion.div key={p.label} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.45, delay: 0.12 * i }} className="flex items-center gap-3">
            <p.icon className={`h-3.5 w-3.5 shrink-0 ${p.color}`} />
            <span className="text-xs text-slate-700 flex-1">{p.label}</span>
            <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.confidence}%` }} viewport={VIEWPORT} transition={{ duration: 1.2, delay: 0.3 + 0.12 * i, ease: "easeOut" }} className="h-full rounded-full bg-cyan-500" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 w-8 text-right">{p.confidence}%</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] text-slate-400 font-mono">Analyzes 132+ hero interactions in real-time</span>
      </div>
    </div>
  );
}

function StrategicOutput() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fafbfe] p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-cyan-600" />
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Strategic Output</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-center">
          <span className="text-[10px] font-bold text-cyan-700 uppercase block">Engage</span>
          <span className="text-[10px] text-cyan-500">Pickoff</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
          <span className="text-[10px] font-bold text-slate-600 uppercase block">Win Con</span>
          <span className="text-[10px] text-slate-400">Turtle 1-2</span>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-center">
          <span className="text-[10px] font-bold text-blue-700 uppercase block">Tempo</span>
          <span className="text-[10px] text-blue-500">Early</span>
        </div>
      </div>
      <div className="mb-3">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-2">Risk Distribution</span>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-slate-100">
          <motion.div initial={{ width: 0 }} whileInView={{ width: "30%" }} viewport={VIEWPORT} transition={{ duration: 1, ease: "easeOut" }} className="bg-emerald-500 rounded-l-full" />
          <motion.div initial={{ width: 0 }} whileInView={{ width: "50%" }} viewport={VIEWPORT} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="bg-amber-400" />
          <motion.div initial={{ width: 0 }} whileInView={{ width: "20%" }} viewport={VIEWPORT} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }} className="bg-red-400 rounded-r-full" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-emerald-600">Early 30%</span>
          <span className="text-[9px] text-amber-500">Mid 50%</span>
          <span className="text-[9px] text-red-500">Late 20%</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Lane Reads</span>
        {LANES.map((l, i) => (
          <motion.div key={l.lane} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.35, delay: 0.08 * i }} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 w-8">{l.lane}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${l.color}`} />
            <span className="text-[10px] text-slate-600 capitalize">{l.status}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
        <Zap className="h-3 w-3 text-cyan-500" />
        <span className="text-[10px] text-slate-400 font-mono">Actionable gameplan in under 3 seconds</span>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }} className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-3">How DraftMLBB reads the battlefield</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Every ban, every pick, every signal — the AI sees what you miss.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[10px] font-bold text-cyan-700">01</span>
              <span className="text-sm font-bold text-slate-800">Signal Detection</span>
            </div>
            <SignalDetection />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0.12 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700">02</span>
              <span className="text-sm font-bold text-slate-800">AI Pattern Recognition</span>
            </div>
            <PatternRecognition />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0.24 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700">03</span>
              <span className="text-sm font-bold text-slate-800">Strategic Output</span>
            </div>
            <StrategicOutput />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
