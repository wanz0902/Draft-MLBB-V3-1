import { motion } from "framer-motion";
import { CheckCircle2, Clock, Zap, BrainCircuit, Shield, Users, Search, Target, ChevronRight, Video, Smartphone, Radio, DollarSign, Gamepad2, Sparkles } from "lucide-react";
import { ROADMAP_MODES } from "../constants/landingDemoData";
import { VIEWPORT } from "../constants/landingAnimations";

const STAGE_ICONS = [Zap, BrainCircuit, Shield];

function ManualDraftPreview() {
  return (
    <div className="border border-slate-200 bg-slate-50 rounded-lg p-3 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Manual Mode</span>
      </div>
      <div className="flex gap-1 mb-1.5">
        {["Fanny", "Zhuxin", "Martis"].map((h) => (
          <div key={h} className="flex-1 h-6 rounded border border-red-200 bg-red-50 flex items-center justify-center">
            <span className="text-[8px] text-red-500 font-mono">{h}</span>
          </div>
        ))}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`empty-ban-${i}`} className="flex-1 h-6 rounded border border-dashed border-slate-200 bg-white" />
        ))}
      </div>
      <div className="flex gap-1">
        {["Tigreal", "Atlas"].map((h) => (
          <div key={h} className="flex-1 h-7 rounded border border-blue-200 bg-blue-50 flex items-center justify-center">
            <span className="text-[8px] text-blue-600 font-mono">{h}</span>
          </div>
        ))}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`empty-pick-${i}`} className="flex-1 h-7 rounded border border-dashed border-slate-200 bg-white" />
        ))}
      </div>
    </div>
  );
}

function AssistedCoachPreview() {
  return (
    <div className="border border-slate-200 bg-slate-50 rounded-lg p-3 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">AI Coach Active</span>
      </div>
      <div className="flex gap-1 mb-2">
        {["Fanny", "Zhuxin", "", "", ""].map((h, i) => (
          <div key={i} className={`flex-1 h-6 rounded border flex items-center justify-center ${h ? "border-red-200 bg-red-50" : "border-dashed border-slate-200 bg-white"}`}>
            {h && <span className="text-[8px] text-red-500 font-mono">{h}</span>}
          </div>
        ))}
      </div>
      <div className="rounded bg-blue-50 border border-blue-200 p-2 flex items-start gap-1.5">
        <BrainCircuit className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-[8px] text-blue-600 font-mono leading-tight">Counter detected: pick Martis for</p>
          <p className="text-[8px] text-blue-600 font-mono leading-tight">jungle pressure + anti-dive</p>
        </div>
      </div>
    </div>
  );
}

function ProWarRoomPreview() {
  return (
    <div className="border border-slate-200 bg-slate-50 rounded-lg p-3 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Team Intel</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {[
          { icon: Users, label: "Scout", color: "purple" },
          { icon: Search, label: "Deceive", color: "amber" },
          { icon: Target, label: "Win Con", color: "blue" },
        ].map(({ icon: I, label, color }) => (
          <div key={label} className={`rounded border border-${color}-200 bg-${color}-50 p-1.5 flex flex-col items-center gap-0.5`}>
            <I className={`h-3 w-3 text-${color}-500`} />
            <span className={`text-[7px] font-mono text-${color}-600`}>{label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {["68%", "74%", "61%"].map((v, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: v }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PREVIEW_COMPONENTS = [ManualDraftPreview, AssistedCoachPreview, ProWarRoomPreview];

const COMING_SOON = [
  {
    title: "Auto Clip Generator",
    desc: "AI-powered highlight reel: draft analysis jadi 30-second clip dengan music template otomatis.",
    Icon: Video,
    color: "rose",
  },
  {
    title: "Account Marketplace",
    desc: "Estimasi harga akun MLBB berdasarkan hero, skin, rank. Jual-beli akun dengan harga transparan.",
    Icon: DollarSign,
    color: "amber",
  },
  {
    title: "Team Scrim Analyzer",
    desc: "Analyze scrim & practice matches, track improvement tim dari waktu ke waktu.",
    Icon: Gamepad2,
    color: "cyan",
  },
  {
    title: "Mobile App",
    desc: "Draft analysis di mana saja — iOS & Android. Kapan pun, di mana pun.",
    Icon: Smartphone,
    color: "emerald",
  },
];

const Q_MILESTONES = [
  { q: "Q1", label: "Manual Draft", color: "bg-emerald-400", pct: "15%" },
  { q: "Q2", label: "AI Coach", color: "bg-blue-500", pct: "30%" },
  { q: "Q3", label: "Pro War Room", color: "bg-purple-500", pct: "45%" },
  { q: "Q4", label: "Auto Clip", color: "bg-rose-400", pct: "60%" },
  { q: "Q1 '26", label: "Scrim Tool", color: "bg-cyan-500", pct: "75%" },
  { q: "Q2 '26", label: "Mobile App", color: "bg-amber-400", pct: "95%" },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6 }}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-black text-slate-900 text-center tracking-tight mb-3">The future of draft strategy</h2>
          <p className="text-slate-500 text-sm text-center mb-14 max-w-md mx-auto">From solo analysis to team-level intelligence.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />
          <motion.div
            className="absolute left-[18px] top-0 w-px bg-gradient-to-b from-cyan-400 to-blue-500 hidden sm:block"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <div className="space-y-10">
            {ROADMAP_MODES.map((mode, i) => {
              const Icon = STAGE_ICONS[i];
              const Preview = PREVIEW_COMPONENTS[i];
              const isLive = mode.status === "live";
              return (
                <motion.div key={mode.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative sm:pl-14">
                  <div className="absolute left-2.5 sm:left-[7px] top-1 w-7 h-7 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center z-10">
                    <span className="text-[10px] font-bold text-slate-600 font-mono">{i + 1}</span>
                  </div>

                  <div className={`rounded-2xl border p-5 sm:p-6 transition-all ${isLive ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md" : "border-dashed border-slate-200 bg-slate-50/50 opacity-70"}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${isLive ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-100"}`}>
                          <Icon className={`h-4.5 w-4.5 ${isLive ? "text-blue-600" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{mode.name}</h3>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{mode.description}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shrink-0 ${isLive ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-slate-200 bg-slate-100 text-slate-400"}`}>
                        {isLive ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {isLive ? "Live" : "Coming Soon"}
                      </span>
                    </div>
                    <Preview />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {COMING_SOON.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative sm:pl-14"
            >
              <div className="absolute left-2.5 sm:left-[7px] top-1 w-7 h-7 rounded-full border-2 border-dashed border-slate-200 bg-[#fafbfe] flex items-center justify-center z-10">
                <span className="text-[10px] font-bold text-slate-400 font-mono">{i + 4}</span>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 bg-[#fafbfe] p-5 sm:p-6 opacity-70 transition-all hover:opacity-90">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-${feat.color}-200 bg-${feat.color}-50`}>
                      <feat.Icon className={`h-4.5 w-4.5 text-${feat.color}-500`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                    <Clock className="h-3 w-3" />
                    Coming Soon
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-slate-200 bg-[#fafbfe]">
              <Sparkles className="h-4 w-4 text-slate-400 animate-pulse" />
              <span className="text-sm text-slate-400 font-medium">And many more features coming every update...</span>
              <Sparkles className="h-4 w-4 text-slate-400 animate-pulse" />
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT} transition={{ duration: 0.6, delay: 0.2 }} className="mt-16">
          <h3 className="text-sm font-bold text-slate-900 mb-4 text-center">What's next</h3>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-1 h-8 rounded-lg overflow-hidden mb-2">
              {Q_MILESTONES.map((m) => (
                <div key={m.q} className={`${m.color} flex-1 flex items-center justify-center`}>
                  <span className="text-[9px] font-mono font-bold text-white uppercase">{m.q}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {Q_MILESTONES.map((m) => (
                <div key={m.q} className="flex-1 text-center">
                  <span className="text-[9px] font-mono text-slate-400">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
