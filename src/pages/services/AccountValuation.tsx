import { motion } from "framer-motion";
import { Gem, Shield, Upload, Lock } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const FIELDS = ["Hero Count", "Skin Count", "Collector Skins", "Legend Skins", "Epic Limited Skins", "Highest Rank", "Account Age", "Rare Items"];

export default function AccountValuation() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div {...fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)]">
            <Gem className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Account Valuation</h1>
            <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">UI Preview</span>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.06 }} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Security Notice</h2>
        </div>
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 mb-6">
          <p className="text-xs text-emerald-400">We never request your password, OTP, email access, or recovery codes. Your account data is safe.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f}>
              <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1 font-semibold">{f}</label>
              <div className="h-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border)] opacity-40" />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1 font-semibold">Screenshot Upload</label>
          <div className="h-32 rounded-lg bg-[var(--bg-input)] border-2 border-dashed border-[var(--border)] flex items-center justify-center opacity-40">
            <div className="text-center">
              <Upload className="h-6 w-6 text-[var(--text-muted)] mx-auto mb-1" />
              <p className="text-xs text-[var(--text-muted)]">Drop screenshot here</p>
            </div>
          </div>
        </div>

        <button disabled className="mt-4 px-4 py-2 rounded-lg bg-cyan-600/50 text-white/50 text-sm font-semibold cursor-not-allowed">Get Valuation</button>
      </motion.div>
    </div>
  );
}
