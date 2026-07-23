import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Gamepad2,
  FileText,
  Swords,
  CheckCircle2,
  Edit3,
  LogOut,
  Crown,
  ShieldCheck,
  LinkIcon,
  ChevronRight,
  User,
  Star,
  Settings,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useSharedData } from "../../App";
import heroesMaster from "../../data/heroes_master.json";
import { staggerContainer, staggerItem } from "../../lib/motionPresets";

interface HeroEntry {
  hero_id: number;
  hero_name: string;
  slug: string;
  role: string[];
  lanes?: string[];
  specialty?: string;
}

const allHeroes = heroesMaster as HeroEntry[];

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

export default function ProfileOverview() {
  const { user, logout } = useAuth();
  const { heroAssets } = useSharedData();
  const navigate = useNavigate();

  if (!user) return null;

  const completion = calcCompletion(user);
  const displayName = user.mlbb_nickname || user.name || "Player";
  const heroLookup = allHeroes.find((h) => h.slug === user.showcase_hero);

  const showcaseImg =
    heroLookup && heroAssets[heroLookup.hero_name]
      ? heroAssets[heroLookup.hero_name]
      : heroLookup && heroAssets[heroLookup.slug]
        ? heroAssets[heroLookup.slug]
        : null;

  const membershipLabel =
    user.membership_plan
      ? user.membership_plan.charAt(0).toUpperCase() + user.membership_plan.slice(1)
      : "Free";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]"
      >
        <div className="relative h-[250px] w-full overflow-hidden">
          {showcaseImg ? (
            <img
              src={showcaseImg}
              alt={heroLookup?.hero_name || "Showcase"}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cyan-900/40 via-[#0a111f] to-purple-900/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/60 to-transparent" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/8 blur-3xl" />
        </div>

        <div className="relative z-10 -mt-14 px-6 pb-6 md:px-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            <div className="relative shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-full border-[3px] border-cyan-400 shadow-lg shadow-cyan-500/30 bg-[var(--bg-card)]">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name || "Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-cyan-400">
                    {(user.name || "P").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--bg-card)] bg-cyan-400">
                <Sparkles className="h-3 w-3 text-[#0a111f]" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              {user.name && user.mlbb_nickname && (
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{user.name}</p>
              )}
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] sm:justify-start">
                {user.mlbb_uid && (
                  <span>
                    UID: <span className="text-white">{user.mlbb_uid}</span>
                  </span>
                )}
                {user.mlbb_sid && (
                  <span>
                    Server: <span className="text-white">{user.mlbb_sid}</span>
                  </span>
                )}
                {user.mlbb_uid && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </span>
                )}
                {user.created_at && (
                  <span>
                    Member since{" "}
                    <span className="text-white">
                      {format(new Date(user.created_at), "d MMMM yyyy")}
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400 border border-purple-500/20">
                <Crown className="h-3.5 w-3.5" />
                {membershipLabel}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Profile Completion</span>
              <span className="font-medium text-cyan-400">{completion}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              to="/settings/profile"
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
            <Link
              to="/settings/mlbb"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              Manage MLBB
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div
          variants={staggerItem}
          className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-5"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10">
              <Gamepad2 className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Connected Game Profile</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Nickname</span>
              <span className="text-white">{user.mlbb_nickname || "---"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">UID</span>
              <span className="text-white">{user.mlbb_uid || "---"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">SID</span>
              <span className="text-white">{user.mlbb_sid || "---"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Status</span>
              {user.mlbb_uid ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </span>
              ) : (
                <span className="text-slate-500">Not connected</span>
              )}
            </div>
            <Link
              to="/settings/mlbb"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300"
            >
              <LinkIcon className="h-3 w-3" />
              Manage Connection
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-5"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10">
              <FileText className="h-4 w-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Personal Profile</h3>
          </div>
          <div className="space-y-3">
            {user.bio ? (
              <p className="text-sm text-slate-300 leading-relaxed">{user.bio}</p>
            ) : (
              <p className="text-sm text-slate-500 italic">No bio added yet.</p>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Favorite Role</span>
              <span className="text-white">{user.favorite_role || "---"}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Completion</span>
              <span className="text-purple-400 font-medium">{completion}%</span>
            </div>
            <Link
              to="/settings/profile"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
            >
              <Edit3 className="h-3 w-3" />
              {user.bio ? "Edit Bio" : "Add Bio"}
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-5"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
              <Swords className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Showcase Hero</h3>
          </div>
          {heroLookup ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.06]">
                  {showcaseImg ? (
                    <img
                      src={showcaseImg}
                      alt={heroLookup.hero_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Swords className="h-6 w-6 text-emerald-400/60" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{heroLookup.hero_name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {heroLookup.role.join(", ")}
                  </p>
                  {heroLookup.specialty && (
                    <p className="text-xs text-slate-500">{heroLookup.specialty}</p>
                  )}
                </div>
              </div>
              <Link
                to="/settings/profile"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
              >
                <Edit3 className="h-3 w-3" />
                Change Showcase
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-slate-500">No showcase hero selected.</p>
              <Link
                to="/settings/profile"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
              >
                Set Showcase Hero
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-5"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Account Status</h3>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Provider</span>
              <span className="text-white text-xs">Google</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">MLBB Connected</span>
              {user.mlbb_uid ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <span className="text-xs text-slate-500">Pending</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Membership</span>
              <span className="flex items-center gap-1 text-xs text-purple-400">
                <Crown className="h-3.5 w-3.5" />
                {membershipLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Profile Status</span>
              {user.profile_completed ? (
                <span className="text-xs text-emerald-400">Complete</span>
              ) : (
                <span className="text-xs text-amber-400">{completion}%</span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-5 md:col-span-2 lg:col-span-1"
        >
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-400/10">
              <Settings className="h-4 w-4 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="space-y-1.5">
            <Link
              to="/settings/profile"
              className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-cyan-400" />
                Edit Profile
              </span>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Link>
            <Link
              to="/settings/profile"
              className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-emerald-400" />
                Change Showcase
              </span>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Link>
            <Link
              to="/settings/mlbb"
              className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-amber-400" />
                MLBB Account
              </span>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Link>
            <Link
              to="/settings/membership"
              className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-400" />
                Membership
              </span>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Link>
            <Link
              to="/settings/account"
              className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                Account Settings
              </span>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </span>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
