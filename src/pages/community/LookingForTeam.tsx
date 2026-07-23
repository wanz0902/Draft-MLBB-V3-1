import { motion } from "framer-motion";
import {
  Users,
  Swords,
  Shield,
  Clock,
  Globe,
  Send,
  Star,
  Camera,
} from "lucide-react";
import { staggerContainer, staggerItem } from "../../lib/motionPresets";

const PREVIEW_CARDS = [
  { id: 1, nameW: "w-20", roleW: "w-16" },
  { id: 2, nameW: "w-24", roleW: "w-12" },
  { id: 3, nameW: "w-16", roleW: "w-20" },
];

const ROLES = ["EXP", "Mid", "Gold", "Roam", "Jungle"];

export default function LookingForTeam() {
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
              <Users className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2
                className="text-xl font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display, system-ui)" }}
              >
                Looking for Team
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Find a team that matches your playstyle
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
              Post Your Profile
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border)]">
                    <Camera className="h-6 w-6 text-[var(--text-muted)]" />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)]">
                    Upload avatar
                  </span>
                  <p className="text-[10px] text-[var(--text-muted)]/60">
                    JPG, PNG. Max 2MB
                  </p>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-muted)]">
                  Nickname
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Your in-game name"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Swords className="h-3 w-3" /> Main Role
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      disabled
                      className="rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-muted)] cursor-not-allowed"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Star className="h-3 w-3" /> Secondary Role
                </label>
                <select
                  disabled
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                >
                  <option>Select role</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Shield className="h-3 w-3" /> Rank
                  </label>
                  <select
                    disabled
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                  >
                    <option>Select rank</option>
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
                <label className="mb-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Clock className="h-3 w-3" /> Active Hours
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="e.g. 7PM-11PM"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-muted)] outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-muted)]">
                  Hero Pool
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Fanny", "Lancelot", "Hayabusa", "Benedetta", "Ling"].map(
                    (hero) => (
                      <button
                        key={hero}
                        disabled
                        className="rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-muted)] cursor-not-allowed"
                      >
                        {hero}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--text-muted)]">
                  Contact
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
                Post Profile
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
              Browse Players
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
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
                    <div className="flex-1">
                      <div
                        className={`mb-1 h-3.5 rounded bg-white/10 ${card.nameW}`}
                      />
                      <div
                        className={`h-2.5 rounded bg-white/8 ${card.roleW}`}
                      />
                    </div>
                  </div>
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/[0.03] p-2">
                      <div className="mb-1 h-2 w-8 rounded bg-white/8" />
                      <div className="h-3 w-14 rounded bg-white/10" />
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-2">
                      <div className="mb-1 h-2 w-6 rounded bg-white/8" />
                      <div className="h-3 w-12 rounded bg-white/10" />
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-2">
                      <div className="mb-1 h-2 w-10 rounded bg-white/8" />
                      <div className="h-3 w-16 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 rounded-full bg-white/6" />
                    <div className="h-6 w-20 rounded-full bg-white/6" />
                    <div className="h-6 w-14 rounded-full bg-white/6" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
