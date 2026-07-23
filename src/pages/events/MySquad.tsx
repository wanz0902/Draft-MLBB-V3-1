import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Crown,
  Link2,
  UserPlus,
  Swords,
  Star,
  Lock,
} from "lucide-react";
import { fadeUp, staggerContainer, staggerItem } from "../../lib/motionPresets";

const PLAYER_SLOTS = [
  { role: "EXP Laner", slot: 1 },
  { role: "Jungler", slot: 2 },
  { role: "Mid Laner", slot: 3 },
  { role: "Gold Laner", slot: 4 },
  { role: "Roamer", slot: 5 },
];

const SQUAD_FIELDS = [
  { label: "Team Name", value: "—" },
  { label: "Short Name", value: "—" },
  { label: "Captain", value: "—" },
  { label: "Members", value: "0 / 5" },
  { label: "Substitute", value: "0" },
  { label: "Invite Code", value: "—" },
];

export default function MySquad() {
  return (
    <motion.div
      {...fadeUp}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)]">
          <Shield className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">My Squad</h1>
          <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            UI Preview
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
      >
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20">
              <Shield className="h-12 w-12 text-cyan-400/60" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
              <Lock className="h-3 w-3 text-[var(--text-muted)]" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              No Squad Yet
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Create or join a squad to compete in tournaments
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Squad Formation
          </h3>
          <div className="relative rounded-xl border border-[var(--border)] bg-white/[0.02] p-6">
            <div className="grid grid-cols-5 gap-3">
              {PLAYER_SLOTS.map((slot) => (
                <div key={slot.slot} className="flex flex-col items-center gap-2">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-white/[0.03] transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5">
                    <Users className="h-6 w-6 text-[var(--text-muted)]/40" />
                    {slot.slot === 2 && (
                      <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/30">
                        <Crown className="h-2.5 w-2.5 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-medium text-[var(--text-muted)]">
                      {slot.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
              <Crown className="h-3 w-3 text-yellow-400" />
              <span>= Captain</span>
              <span className="mx-1 text-[var(--border)]">|</span>
              <span>5 players required</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Squad Info
          </h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-2 sm:grid-cols-2"
          >
            {SQUAD_FIELDS.map((item) => (
              <motion.div
                key={item.label}
                variants={staggerItem}
                className="flex items-center justify-between rounded-lg bg-[var(--bg-card-hover)] px-4 py-3"
              >
                <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex gap-3">
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600/50 px-5 py-2.5 text-sm font-bold text-white/50 cursor-not-allowed"
          >
            <Swords className="h-4 w-4" />
            Create Squad
          </button>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card-hover)] px-5 py-2.5 text-sm font-bold text-[var(--text-muted)] cursor-not-allowed"
          >
            <UserPlus className="h-4 w-4" />
            Join Squad
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
      >
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Membership Eligibility
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 mt-0.5">
              <Star className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Elite or Pro membership required
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Upgrade your plan to create or join squads
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 mt-0.5">
              <Link2 className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Verified MLBB account
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Link your MLBB UID and SID in profile settings
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
