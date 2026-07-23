import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Trophy, Calendar, Users, Target, Swords, Star, Shield,
  Crown, Zap, Clock, ArrowRight, Settings, TrendingUp,
  Gamepad2, CircleDot, ChevronRight, Sparkles, BarChart3,
  MessageSquare, Swords as SwordsIcon, Medal, Flame, Eye,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useSharedData } from "../../App";

const CONTRIBUTION_PER_ELIGIBLE_MEMBER = 20000;
const TARGET_ELIGIBLE_MEMBERS = 100;
const MAX_MONTHLY_PRIZE_POOL = 2000000;

function calcCompletion(user: ReturnType<typeof useAuth>["user"]) {
  if (!user) return 0;
  let score = 0;
  if (user.email) score += 25;
  if (user.name) score += 25;
  if (user.mlbb_uid) score += 25;
  if (user.bio) score += 12.5;
  if (user.favorite_role) score += 6.25;
  if (user.showcase_hero) score += 6.25;
  return score;
}

const weeklySchedule = [
  { week: 1, label: "Qualifier A", status: "Coming Soon", date: "TBA" },
  { week: 2, label: "Qualifier B", status: "Coming Soon", date: "TBA" },
  { week: 3, label: "Last Chance", status: "Coming Soon", date: "TBA" },
  { week: 4, label: "Monthly Final", status: "Coming Soon", date: "TBA", isFinal: true },
];

const quickActions = [
  { label: "Draft Now", path: "/app/draft", icon: Swords, color: "text-cyan-400" },
  { label: "View Profile", path: "/profile", icon: BarChart3, color: "text-pink-400" },
  { label: "Community", path: "/community", icon: Users, color: "text-blue-400" },
  { label: "Community Cup", path: "/events/community-cup", icon: Trophy, color: "text-yellow-400" },
  { label: "My Squad", path: "/events/my-squad", icon: Shield, color: "text-emerald-400" },
  { label: "Membership", path: "/settings/membership", icon: Crown, color: "text-purple-400" },
];

const platformUpdates = [
  { title: "Community Cup Coming Soon", date: "Jul 2026", badge: "New" },
  { title: "New Hero Stats Updated", date: "Jul 2026", badge: null },
  { title: "Draft Planner v2 Released", date: "Jul 2026", badge: null },
];

const featuredHeroSlugs = ["fanny", "gusion", "lancelot"];

function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function AppDashboard() {
  const { user } = useAuth();
  const { heroAssets } = useSharedData();
  const isGuest = !user;

  const eligibleMembers = 0;
  const prizeFund = eligibleMembers * CONTRIBUTION_PER_ELIGIBLE_MEMBER;
  const progressPercent = (eligibleMembers / TARGET_ELIGIBLE_MEMBERS) * 100;

  const featuredHeroSrc = heroAssets[featuredHeroSlugs[0]] || heroAssets[featuredHeroSlugs[1]] || heroAssets[featuredHeroSlugs[2]];

  if (isGuest) {
    return (
      <div className="w-full max-w-[1640px] mx-auto px-4 md:px-6 xl:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.08]"
          style={{ minHeight: 320, background: "linear-gradient(135deg, #060d1a 0%, #0a1628 30%, #0d1a2d 60%, #080e1a 100%)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {featuredHeroSrc && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden opacity-[0.12]">
              <img src={featuredHeroSrc} alt="" className="absolute right-[-5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain" style={{ filter: "brightness(1.3) contrast(1.1) saturate(0.8)", maskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 80%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 80%)" }} />
            </div>
          )}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[100px]" />
          <div className="relative z-10 flex flex-col justify-center min-h-[320px] p-8 sm:p-10 lg:p-12">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-5 w-fit">
              <Eye className="w-3 h-3" /> Preview Mode
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Explore MVP Draft
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-lg leading-relaxed">
              Lihat bagaimana Draft War Room, Hero Intelligence, Community, Events, dan Services bekerja sebelum membuat akun.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/app/draft" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(6,182,212,0.4)] no-underline">
                <Target className="w-4 h-4" /> Explore Draft
              </Link>
              <Link to="/app/heroes" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20 no-underline">
                <Sparkles className="w-4 h-4 text-purple-400" /> Browse Heroes
              </Link>
              <Link to="/community" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20 no-underline">
                <MessageSquare className="w-4 h-4 text-blue-400" /> View Community
              </Link>
            </div>
            <p className="text-[11px] text-slate-500 mt-6">
              Guest Preview — Login diperlukan untuk menjalankan analisis dan menyimpan data.
            </p>
          </div>
        </motion.div>

        {/* Prize Fund preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl border border-white/[0.08] mt-5"
          style={{ background: "linear-gradient(135deg, #0c1424 0%, #0a1220 50%, #0d1628 100%)" }}
        >
          <div className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-500/20 flex-shrink-0">
                <Trophy className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">MVP Draft Community Cup</h2>
                <p className="text-[10px] text-[var(--text-muted)]">Coming Soon — Monthly Tournament</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Prize Pool</p>
                <p className="text-lg font-black text-yellow-400">{formatRupiah(MAX_MONTHLY_PRIZE_POOL)}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Members</p>
                <p className="text-lg font-black text-white">0<span className="text-sm font-normal text-[var(--text-muted)]">/100</span></p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Status</p>
                <p className="text-sm font-bold text-amber-400">Coming Soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const completion = calcCompletion(user);
  const displayName = user.mlbb_nickname || user.name || "Player";
  const membershipLabel = user.membership_plan
    ? user.membership_plan.charAt(0).toUpperCase() + user.membership_plan.slice(1)
    : "Free";

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  return (
    <div className="w-full max-w-[1640px] mx-auto px-4 md:px-6 xl:px-8 pb-8">

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN DASHBOARD SHELL — Hero + Community Rail
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-0 mb-5">

        {/* ── CINEMATIC HERO SCENE — main column ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none border border-white/[0.08] border-b-0 lg:border-b lg:border-r-0"
          style={{ minHeight: 400, background: "linear-gradient(135deg, #060d1a 0%, #0a1628 30%, #0d1a2d 60%, #080e1a 100%)" }}
        >
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Featured hero artwork — single dominant */}
          {featuredHeroSrc && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden opacity-[0.18]">
              <img
                src={featuredHeroSrc}
                alt=""
                className="absolute right-[-5%] top-1/2 -translate-y-1/2 h-[120%] w-auto object-contain"
                style={{ filter: "brightness(1.3) contrast(1.1) saturate(0.8)", maskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 80%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.6) 0%, transparent 80%)" }}
              />
            </div>
          )}

          {/* Glow orbs */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-[100px]" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-purple-500/[0.05] blur-[80px]" />

          {/* Content */}
          <div className="relative z-10 flex h-full min-h-[400px] flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/60 mb-3">Dashboard</p>
              <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] text-white tracking-tight">
                Welcome back,<br />
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">{displayName}</span>
              </h1>
              {user.name && user.mlbb_nickname && user.name !== user.mlbb_nickname && (
                <p className="mt-2 text-base text-[var(--text-secondary)]">{user.name}</p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3.5 py-1.5 text-xs font-bold text-purple-300 border border-purple-500/25">
                  <Crown className="h-3.5 w-3.5" />
                  {membershipLabel}
                </span>
                {user.mlbb_uid && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
                    <CircleDot className="h-3 w-3 text-cyan-400" />
                    UID {user.mlbb_uid}
                    {user.mlbb_sid && <span className="text-[var(--text-muted)]">({user.mlbb_sid})</span>}
                  </span>
                )}
                {memberSince && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
                    <Clock className="h-3 w-3" />
                    Since {memberSince}
                  </span>
                )}
              </div>

              {/* Profile completion */}
              <div className="mt-6 max-w-xs">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Profile Completion</span>
                  <span className="font-bold text-cyan-400">{completion}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link to="/app/draft" className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02]">
                <Swords className="h-4 w-4" />
                Draft Now
              </Link>
              <Link to="/profile" className="inline-flex items-center gap-2 rounded-xl bg-white/[0.07] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] border border-white/[0.08] transition-all hover:bg-white/[0.12] hover:text-white">
                <Users className="h-4 w-4" />
                View Profile
              </Link>
              <Link to="/community" className="inline-flex items-center gap-2 rounded-xl bg-white/[0.07] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] border border-white/[0.08] transition-all hover:bg-white/[0.12] hover:text-white">
                <Gamepad2 className="h-4 w-4" />
                Community
              </Link>
            </div>
          </div>

          {/* Info strip at bottom */}
          <div className="relative z-10 border-t border-white/[0.06] bg-black/20 backdrop-blur-sm">
            <div className="flex items-center overflow-x-auto px-6 sm:px-8 lg:px-10 py-3 gap-6 text-[11px]">
              {[
                { label: "Plan", value: membershipLabel, icon: Crown },
                { label: "MLBB", value: user.mlbb_uid ? "Connected" : "Not Connected", icon: CircleDot },
                { label: "Profile", value: `${completion}%`, icon: BarChart3 },
                { label: "Community", value: "0 Online", icon: Users },
                ...(memberSince ? [{ label: "Member Since", value: memberSince, icon: Clock }] : []),
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-2 shrink-0">
                  {i > 0 && <div className="w-px h-3 bg-white/[0.1] mr-4" />}
                  <item.icon className="h-3 w-3 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-muted)] uppercase tracking-wider">{item.label}</span>
                  <span className="font-semibold text-[var(--text-secondary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── COMMUNITY RAIL — right column ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 lg:col-span-4 border border-white/[0.08] border-t-0 lg:border-t lg:border-l-0 rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none flex flex-col"
          style={{ background: "linear-gradient(180deg, #0b1220 0%, #0a111f 100%)" }}
        >
          {/* Rail header */}
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Community</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">0 Online</span>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 mt-3">
              {["Global", "LFS", "LFT"].map((tab, i) => (
                <button key={tab} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${i === 0 ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Rail body */}
          <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
            {/* Pinned announcement */}
            <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Pinned</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Community Cup registration opens when prize fund reaches target. Stay tuned!</p>
            </div>

            {/* Recent activity */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2.5">Recent Activity</p>
              <div className="space-y-2.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-2.5 opacity-30">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-white/[0.06]" />
                    <div className="flex-1 min-w-0">
                      <div className="h-2.5 w-20 rounded bg-white/[0.06] mb-1" />
                      <div className="h-2 w-32 rounded bg-white/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest LFS */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2.5">Latest LFS</p>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 opacity-30">
                <div className="h-3 w-24 rounded bg-white/[0.06] mb-1.5" />
                <div className="h-2 w-36 rounded bg-white/[0.04]" />
              </div>
            </div>

            {/* Upcoming Cup */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2.5">Next Event</p>
              <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-300">Community Cup</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Rail footer */}
          <div className="px-5 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex-1 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center px-3 opacity-40">
                <span className="text-[11px] text-[var(--text-muted)]">Type a message...</span>
              </div>
            </div>
            <Link to="/community" className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] py-2 text-[11px] font-semibold text-[var(--text-secondary)] transition hover:bg-white/[0.08] hover:text-white">
              Open Community
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PRIZE FUND — Compact Panel with Bigger Podium
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-white/[0.08] mb-5"
        style={{ background: "linear-gradient(135deg, #0c1424 0%, #0a1220 50%, #0d1628 100%)" }}
      >
        {/* Decorative glow — overflow hidden only on this layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-500/[0.04] blur-[80px]" />
        </div>

        <div className="relative z-10 p-5 sm:p-6 lg:p-8">
          {/* Header row — full width, badge on right */}
          <div className="flex items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-500/20 flex-shrink-0">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">MVP Draft Community Cup</h2>
                <p className="text-[11px] text-[var(--text-muted)]">Founding Season — Monthly Tournament</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20 flex-shrink-0 whitespace-nowrap">
              <Clock className="h-3 w-3" />
              Coming Soon
            </span>
          </div>

          {/* Main grid: left metrics + right podium */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] gap-6 lg:gap-8 items-start">

            {/* Left: metrics + progress + contribution */}
            <div className="space-y-4">
              {/* Key metrics — compact row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Eligible Members</p>
                  <p className="text-2xl font-black text-white">{eligibleMembers}<span className="text-sm font-normal text-[var(--text-muted)]">/{TARGET_ELIGIBLE_MEMBERS}</span></p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Prize Fund</p>
                  <p className="text-2xl font-black text-white">{formatRupiah(prizeFund)}</p>
                  <p className="text-[9px] text-[var(--text-muted)]">of {formatRupiah(MAX_MONTHLY_PRIZE_POOL)}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Status</p>
                  <p className="text-base font-bold text-amber-400 mt-0.5">Preview</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-[var(--text-secondary)]">Season Progress</span>
                  <span className="text-[11px] font-bold text-yellow-400">{progressPercent}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Contribution info — compact */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-cyan-400" />
                  {formatRupiah(CONTRIBUTION_PER_ELIGIBLE_MEMBER)}/member
                </span>
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-purple-400" />
                  Elite & Pro eligible
                </span>
              </div>
            </div>

            {/* Right: Prize podium — safe area */}
            <div className="flex flex-col items-center justify-center py-4 px-2 sm:px-5 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-5 text-center">Prize Distribution</p>

              {/* Podium visualization */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 mb-4 w-full">
                {/* 2nd place */}
                <div className="flex flex-col items-center min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300/10 border border-slate-400/20 mb-2 flex-shrink-0">
                    <Medal className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="w-full max-w-[100px] rounded-t-xl bg-gradient-to-b from-slate-400/15 to-slate-400/5 border border-slate-400/15 border-b-0 px-2 py-2.5 text-center" style={{ height: 90 }}>
                    <p className="text-[10px] text-slate-400 font-semibold">2nd</p>
                    <p className="text-xs font-bold text-white mt-1 whitespace-nowrap">{formatRupiah(700000)}</p>
                  </div>
                </div>

                {/* 1st place */}
                <div className="flex flex-col items-center min-w-0">
                  <div className="flex items-center justify-center rounded-full bg-yellow-400/15 border border-yellow-400/25 mb-2 shadow-lg shadow-yellow-400/10 flex-shrink-0" style={{ width: 48, height: 48 }}>
                    <Crown className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="w-full max-w-[120px] rounded-t-xl bg-gradient-to-b from-yellow-400/15 to-yellow-400/5 border border-yellow-400/20 border-b-0 px-2 py-2.5 text-center" style={{ height: 120 }}>
                    <p className="text-[10px] text-yellow-400 font-bold">1st</p>
                    <p className="text-sm font-black text-yellow-300 mt-1 whitespace-nowrap">{formatRupiah(1000000)}</p>
                  </div>
                </div>

                {/* 3rd place */}
                <div className="flex flex-col items-center min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600/10 border border-amber-600/20 mb-2 flex-shrink-0">
                    <Medal className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="w-full max-w-[100px] rounded-t-xl bg-gradient-to-b from-amber-600/15 to-amber-600/5 border border-amber-600/15 border-b-0 px-2 py-2.5 text-center" style={{ height: 72 }}>
                    <p className="text-[10px] text-amber-600 font-semibold">3rd</p>
                    <p className="text-xs font-bold text-white mt-1 whitespace-nowrap">{formatRupiah(300000)}</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-2">
                <p className="text-[10px] text-[var(--text-muted)]">Total Prize Pool</p>
                <p className="text-lg font-black text-yellow-400">{formatRupiah(MAX_MONTHLY_PRIZE_POOL)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          COMPETITIVE TIMELINE + UTILITY PANEL
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-12 gap-5 mb-5">

        {/* Timeline — 8 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 lg:col-span-8 rounded-2xl border border-white/[0.08] p-6 sm:p-8"
          style={{ background: "linear-gradient(135deg, #0b1220 0%, #0a111f 100%)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Monthly Competitive Timeline</h2>
              <p className="text-xs text-[var(--text-muted)]">Community Season — 4 Weeks</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-px bg-white/[0.08]" />
            <div className="relative grid grid-cols-4 gap-4">
              {weeklySchedule.map((w) => (
                <div key={w.week} className="flex flex-col items-center text-center">
                  <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                    w.isFinal
                      ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400 shadow-lg shadow-yellow-400/15"
                      : "border-white/[0.12] bg-[var(--bg-card)] text-[var(--text-secondary)]"
                  }`}>
                    W{w.week}
                  </div>
                  <p className={`mt-2.5 text-xs font-bold ${w.isFinal ? "text-yellow-400" : "text-white"}`}>{w.label}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">{w.date}</p>
                  <span className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${w.isFinal ? "bg-yellow-400/10 text-yellow-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Utility panel — 4 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 lg:col-span-4 rounded-2xl border border-white/[0.08] p-5"
          style={{ background: "linear-gradient(180deg, #0b1220 0%, #0a111f 100%)" }}
        >
          {/* Player Status */}
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Player Status</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-[var(--text-secondary)]">Squad</span>
                </div>
                <Link to="/events/my-squad" className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300">Find →</Link>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-[var(--text-secondary)]">Membership</span>
                </div>
                <Link to="/settings/membership" className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300">{membershipLabel} →</Link>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/[0.06] mb-5" />

          {/* Latest Updates */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Updates</p>
            <div className="space-y-2.5">
              {platformUpdates.map((update, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[var(--text-secondary)] truncate">{update.title}</p>
                  </div>
                  {update.badge && (
                    <span className="shrink-0 rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[8px] font-bold text-cyan-400">{update.badge}</span>
                  )}
                  <span className="shrink-0 text-[9px] text-[var(--text-muted)]">{update.date}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          QUICK ACTION DOCK
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/[0.08] p-1"
        style={{ background: "linear-gradient(135deg, #0b1220 0%, #0a111f 100%)" }}
      >
        <div className="flex items-center overflow-x-auto">
          {quickActions.map((action, i) => (
            <Link
              key={action.path}
              to={action.path}
              className="group flex items-center gap-2.5 shrink-0 px-5 py-3.5 transition-all hover:bg-white/[0.04] rounded-xl"
            >
              {i > 0 && <div className="w-px h-5 bg-white/[0.06] mr-2" />}
              <action.icon className={`h-4 w-4 ${action.color} transition-transform group-hover:scale-110`} />
              <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-white transition-colors whitespace-nowrap">{action.label}</span>
              <ArrowRight className="h-3 w-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
