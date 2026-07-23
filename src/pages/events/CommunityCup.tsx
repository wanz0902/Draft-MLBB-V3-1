import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Coins,
  Clock,
  CheckCircle2,
  Calendar,
  Target,
  Star,
  ShieldCheck,
  Gamepad2,
  ClipboardCheck,
  ListChecks,
  UserPlus,
  Award,
  Zap,
  ChevronRight,
  ExternalLink,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer, staggerItem } from "../../lib/motionPresets";

const PRIZE_DISTRIBUTION = [
  {
    rank: "1st",
    amount: "Rp1.000.000",
    color: "#FACC15",
    bg: "rgba(250,204,21,0.08)",
    border: "rgba(250,204,21,0.2)",
    medal: "Gold",
  },
  {
    rank: "2nd",
    amount: "Rp700.000",
    color: "#CBD5E1",
    bg: "rgba(203,213,225,0.08)",
    border: "rgba(203,213,225,0.2)",
    medal: "Silver",
  },
  {
    rank: "3rd",
    amount: "Rp300.000",
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
    medal: "Bronze",
  },
];

const TIMELINE = [
  { week: "Week 1", title: "Qualifier A", desc: "First qualifier bracket", icon: Target, date: "TBA" },
  { week: "Week 2", title: "Qualifier B", desc: "Second qualifier bracket", icon: Target, date: "TBA" },
  { week: "Week 3", title: "Last Chance", desc: "Final opportunity to qualify", icon: Zap, date: "TBA" },
  { week: "Week 4", title: "Monthly Final", desc: "Grand championship match", icon: Trophy, date: "TBA" },
];

const REQUIREMENTS = [
  { label: "MLBB Account connected", icon: Gamepad2, group: "Account" },
  { label: "Profile completed", icon: ClipboardCheck, group: "Account" },
  { label: "Verified email address", icon: ShieldCheck, group: "Account" },
  { label: "Minimum 10 ranked matches", icon: Star, group: "Account" },
  { label: "Join or create a squad", icon: Users, group: "Team" },
  { label: "Minimum squad size: 5", icon: UserPlus, group: "Team" },
  { label: "Squad roster locked", icon: ListChecks, group: "Team" },
  { label: "Admin approval confirmed", icon: UserCheck, group: "Admin" },
];

export default function CommunityCup() {
  const eligibleMembers = 0;
  const totalMembers = 100;
  const currentPrize = 0;
  const targetPrize = 2000000;
  const progress = targetPrize > 0 ? (currentPrize / targetPrize) * 100 : 0;

  return (
    <motion.div
      {...fadeUp}
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Community Cup
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
              Coming Soon
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            MVP Draft Community Cup — Founding Season
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/20">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  MVP Draft Community Cup — Founding Season
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Community contribution pool
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Prize Fund Progress
                  </span>
                  <span className="text-sm font-bold text-yellow-400">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/[0.03] border border-[var(--border)] px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                      Eligible
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    {eligibleMembers} / {totalMembers}
                  </span>
                </div>
                <div className="rounded-lg bg-white/[0.03] border border-[var(--border)] px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                      Fund
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--text-primary)]">
                    Rp{currentPrize.toLocaleString("id-ID")} / Rp
                    {targetPrize.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-[var(--border)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)]">
                    Status
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                  <Clock className="h-3 w-3" />
                  Not Started
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                <Calendar className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Tournament Timeline
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  4-week tournament format
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TIMELINE.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="relative rounded-xl border border-[var(--border)] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        {item.week}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                        Upcoming
                      </span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 mb-3">
                      <Icon className="h-4 w-4 text-cyan-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {item.desc}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                      <Clock className="h-3 w-3" />
                      {item.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10">
                <Award className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Prize Distribution
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Top 3 finishers
                </p>
              </div>
            </div>

            {/* Podium visualization */}
            <div className="flex items-end justify-center gap-4 mb-6 py-4">
              {/* 2nd place */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-300/10 border-2 border-slate-400/25 mb-2">
                  <span className="text-sm font-bold text-slate-300">2nd</span>
                </div>
                <div className="w-24 rounded-t-xl bg-gradient-to-b from-slate-400/15 to-slate-400/5 border border-slate-400/15 border-b-0 p-3 text-center" style={{ height: 90 }}>
                  <p className="text-[10px] text-slate-400 font-semibold">Silver</p>
                  <p className="text-sm font-bold text-white mt-1">Rp700.000</p>
                </div>
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center">
                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-yellow-400/15 border-2 border-yellow-400/30 mb-2 shadow-lg shadow-yellow-400/10" style={{ width: 52, height: 52 }}>
                  <span className="text-sm font-black text-yellow-400">1st</span>
                </div>
                <div className="w-28 rounded-t-xl bg-gradient-to-b from-yellow-400/15 to-yellow-400/5 border border-yellow-400/20 border-b-0 p-3 text-center" style={{ height: 120 }}>
                  <p className="text-[10px] text-yellow-400 font-bold">Gold</p>
                  <p className="text-base font-black text-yellow-300 mt-1">Rp1.000.000</p>
                </div>
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-600/10 border-2 border-amber-600/25 mb-2">
                  <span className="text-sm font-bold text-amber-600">3rd</span>
                </div>
                <div className="w-24 rounded-t-xl bg-gradient-to-b from-amber-600/15 to-amber-600/5 border border-amber-600/15 border-b-0 p-3 text-center" style={{ height: 70 }}>
                  <p className="text-[10px] text-amber-600 font-semibold">Bronze</p>
                  <p className="text-sm font-bold text-white mt-1">Rp300.000</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Total Prize Pool</span>
              <span className="text-sm font-bold text-yellow-400">
                Rp2.000.000
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Requirements Checklist
              </h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-2 sm:grid-cols-2"
            >
              {REQUIREMENTS.map((req, idx) => {
                const Icon = req.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-white/[0.02] px-4 py-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                      <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                    </div>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="h-4 w-4 shrink-0 rounded border border-[var(--border)] bg-white/[0.04]" />
                      <span className="text-sm text-[var(--text-secondary)] truncate">
                        {req.label}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] shrink-0">
                      {req.group}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
          >
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Season Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
                  Not Started
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Eligible members
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  0 / 100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Prize pool</span>
                <span className="text-sm font-medium text-yellow-400">
                  Rp0 / Rp2.000.000
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
          >
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                disabled
                className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--text-muted)] cursor-not-allowed opacity-60"
              >
                <ListChecks className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">View Rules</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
              <button
                disabled
                className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--text-muted)] cursor-not-allowed opacity-60"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">Join Discord</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
              <button
                disabled
                className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--text-muted)] cursor-not-allowed opacity-60"
              >
                <UserPlus className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">Register Team</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
          >
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Eligibility
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Elite or Pro membership
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Required for tournament entry
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 mt-0.5">
                  <Gamepad2 className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Verified MLBB account
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    UID and SID must be linked
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 mt-0.5">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Squad registered
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Must be in a 5-member squad
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-amber-400">Coming Soon</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Registration opens when prize fund reaches target
            </p>
          </motion.div>

          <Link
            to="/events/my-squad"
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Squad
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
