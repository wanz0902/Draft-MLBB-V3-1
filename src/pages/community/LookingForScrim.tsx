import { motion } from "framer-motion";
import {
  Swords,
  Calendar,
  Clock,
  Trophy,
  Globe,
  Lock,
  Send,
  Shield,
  Lightbulb,
} from "lucide-react";
import { staggerContainer, staggerItem } from "../../lib/motionPresets";

const PREVIEW_CARDS = [
  { id: 1, nameW: "w-28", contactW: "w-20" },
  { id: 2, nameW: "w-24", contactW: "w-16" },
  { id: 3, nameW: "w-32", contactW: "w-24" },
];

const TIPS = [
  "Be specific about your team's skill level and goals",
  "Include your preferred communication platform",
  "State any schedule restrictions upfront",
];

export default function LookingForScrim() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-bg)]">
              <Swords className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display, system-ui)" }}
              >
                Looking for Scrim
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Find scrimmage matches with other teams
              </p>
            </div>
          </div>
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            Coming Soon
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
          >
            <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
              Post a Scrim Request
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-[var(--text-muted)]">
                  Team Name
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Enter team name"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Calendar className="h-3 w-3" /> Date
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Select date"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Clock className="h-3 w-3" /> Time
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="Select time"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Trophy className="h-3 w-3" /> BO Format
                </label>
                <div className="flex gap-2">
                  <button
                    disabled
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-muted)]"
                  >
                    BO3
                  </button>
                  <button
                    disabled
                    className="flex-1 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-bg)] px-3 py-2 text-sm text-[var(--accent)]/50"
                  >
                    BO5
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-[var(--text-muted)]">
                    Tier
                  </label>
                  <select
                    disabled
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                  >
                    <option>Select tier</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Globe className="h-3 w-3" /> Region
                  </label>
                  <select
                    disabled
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                  >
                    <option>Select region</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-muted)]">
                  Rank Range
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="e.g. Mythic 200+"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Lock className="h-3 w-3" /> Room Type
                </label>
                <div className="flex gap-2">
                  <button
                    disabled
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-muted)]"
                  >
                    Custom
                  </button>
                  <button
                    disabled
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-muted)]"
                  >
                    Tournament
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Shield className="h-3 w-3" /> Contact
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Discord / In-game ID"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                />
              </div>
              <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)]/30 px-4 py-2.5 text-sm font-semibold text-[var(--accent)]/50 cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                Post Request
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
              Recent Scrim Requests
            </h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {PREVIEW_CARDS.map((card) => (
                <motion.div
                  key={card.id}
                  variants={staggerItem}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 opacity-30 blur-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={`h-4 rounded bg-white/10 ${card.nameW}`}
                    />
                    <div className="h-5 w-16 rounded-full bg-white/8" />
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/[0.03] p-2">
                      <div className="mb-1 h-2 w-8 rounded bg-white/8" />
                      <div className="h-3 w-16 rounded bg-white/10" />
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-2">
                      <div className="mb-1 h-2 w-10 rounded bg-white/8" />
                      <div className="h-3 w-14 rounded bg-white/10" />
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-2">
                      <div className="mb-1 h-2 w-6 rounded bg-white/8" />
                      <div className="h-3 w-12 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-2.5 rounded bg-white/8 ${card.contactW}`}
                    />
                    <div className="h-2 w-16 rounded bg-white/6" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Tips for Finding Scrims
                </span>
              </div>
              <ul className="space-y-2">
                {TIPS.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-[var(--text-secondary)]"
                  >
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
