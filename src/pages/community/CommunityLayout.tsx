import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Swords,
  Users,
  UserPlus,
  ArrowLeft,
  ChevronRight,
  Wifi,
  Swords as SwordsIcon,
  ShieldCheck,
  Globe,
} from "lucide-react";

interface TabItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { label: "Global Chat", path: "/community/chat", icon: MessageCircle },
  { label: "Looking for Scrim", path: "/community/lfs", icon: Swords },
  { label: "Looking for Team", path: "/community/lft", icon: Users },
  { label: "Looking for Player", path: "/community/lfp", icon: UserPlus },
];

const STATS = [
  { label: "Online Users", value: "0", icon: Wifi },
  { label: "Active Scrims", value: "0", icon: SwordsIcon },
  { label: "Teams Registered", value: "0", icon: ShieldCheck },
];

export default function CommunityLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link
            to="/app"
            className="hover:text-[var(--accent)] transition-colors"
          >
            App
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[var(--text-secondary)]">Community</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6 overflow-hidden rounded-2xl"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-bg) 0%, var(--bg-card) 50%, var(--bg-card-hover) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-[var(--bg-primary)]/20" />
          <div className="relative px-6 py-8 md:px-10 md:py-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-bg)] border border-[var(--accent)]/20">
                  <Globe className="h-7 w-7 text-[var(--accent)]" />
                </div>
                <div>
                  <h1
                    className="text-2xl font-black text-[var(--text-primary)] md:text-3xl"
                    style={{ fontFamily: "var(--font-display, system-ui)" }}
                  >
                    Community Hub
                  </h1>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Connect, compete, and grow with the MVP Draft community
                  </p>
                </div>
              </div>
              <Link
                to="/app"
                className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--accent)] md:flex"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border)] px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
                      <span className="text-xs text-[var(--text-muted)]">
                        {stat.label}
                      </span>
                    </div>
                    <div className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <nav className="flex gap-1 overflow-x-auto rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-1.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className="relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 z-10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="community-tab-indicator"
                      className="absolute inset-0 rounded-lg bg-[var(--accent-bg)] border border-[var(--accent)]/20"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    />
                    <span
                      className={
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }
                    >
                      {tab.label}
                    </span>
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </motion.div>

        <Link
          to="/app"
          className="mb-4 flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Link>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.15 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
