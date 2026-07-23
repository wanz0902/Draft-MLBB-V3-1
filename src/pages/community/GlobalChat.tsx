import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  Users,
  Pin,
  Hash,
  BarChart3,
  Link as LinkIcon,
  Swords,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { staggerContainer, staggerItem } from "../../lib/motionPresets";

const MESSAGES = [
  { id: 1, nameW: "w-20", msgW: "w-56", timeW: "w-12" },
  { id: 2, nameW: "w-24", msgW: "w-40", timeW: "w-14" },
  { id: 3, nameW: "w-16", msgW: "w-48", timeW: "w-10" },
  { id: 4, nameW: "w-28", msgW: "w-36", timeW: "w-12" },
  { id: 5, nameW: "w-20", msgW: "w-52", timeW: "w-14" },
];

const ONLINE_USERS = [
  { id: 1, nameW: "w-20" },
  { id: 2, nameW: "w-24" },
  { id: 3, nameW: "w-16" },
  { id: 4, nameW: "w-22" },
  { id: 5, nameW: "w-18" },
  { id: 6, nameW: "w-26" },
];

export default function GlobalChat() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)]">
            <MessageSquare className="h-5 w-5 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Global Chat
            </h1>
            <span className="inline-block rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-[var(--accent)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  general
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  128 members
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                Topic: MLBB Draft Discussion
              </span>
            </div>

            <div className="mx-4 mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Pin className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">
                  Pinned Announcement
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Welcome to the MVP Draft community! Global chat is launching
                soon.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4 px-4 py-4"
            >
              {MESSAGES.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={staggerItem}
                  className="flex items-start gap-3 opacity-30 blur-[0.5px]"
                >
                  <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--bg-card-hover)]" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 rounded bg-[var(--bg-card-hover)] ${msg.nameW}`}
                      />
                      <div
                        className={`h-3 rounded bg-[var(--bg-card-hover)] ${msg.timeW}`}
                      />
                    </div>
                    <div
                      className={`h-3 rounded bg-[var(--bg-card-hover)] ${msg.msgW}`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="relative border-t border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex h-10 items-center rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] px-3 opacity-50">
                  <span className="text-sm text-[var(--text-muted)]">
                    Type a message...
                  </span>
                </div>
                <button
                  disabled
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/30 text-[var(--accent)]/50 cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-b-xl bg-[var(--bg-primary)]/60 backdrop-blur-[1px]">
                <span className="text-sm font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] px-4 py-2 rounded-lg border border-[var(--border)]">
                  Coming Soon
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block space-y-4"
        >
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Online Now
              </span>
              <span className="ml-auto text-xs text-[var(--text-muted)]">
                {ONLINE_USERS.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {ONLINE_USERS.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2.5 opacity-30"
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-[var(--bg-card-hover)]" />
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-card)] bg-emerald-400" />
                  </div>
                  <div
                    className={`h-3 rounded bg-[var(--bg-card-hover)] ${user.nameW}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Community Stats
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Total Messages
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  1,247
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Active Today
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  42
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Quick Links
              </span>
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "Looking for Scrim",
                  icon: Swords,
                  color: "text-cyan-400",
                },
                {
                  label: "Looking for Team",
                  icon: UsersRound,
                  color: "text-violet-400",
                },
                {
                  label: "Looking for Player",
                  icon: UserPlus,
                  color: "text-amber-400",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-2"
                  >
                    <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                    <span className="text-xs text-[var(--text-secondary)]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
