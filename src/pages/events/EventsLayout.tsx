import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Users,
  ScrollText,
  ChevronRight,
  ArrowLeft,
  Shield,
  Zap,
} from "lucide-react";

interface TabItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const TAB_ITEMS: TabItem[] = [
  { label: "Community Cup", path: "/events/community-cup", icon: Trophy },
  { label: "My Squad", path: "/events/my-squad", icon: Users },
  { label: "Tournament History", path: "/events/history", icon: ScrollText },
];

export default function EventsLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)]">
      <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(135deg, var(--accent) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6 lg:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/20">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                      Events Hub
                    </h1>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-yellow-400 border border-yellow-500/20">
                      <Zap className="h-2.5 w-2.5" />
                      Founding Season
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Compete in community tournaments and build your squad
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Link
                  to="/app"
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  App
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[var(--text-secondary)]">Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 lg:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <Trophy className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Events
            </span>
          </div>

          <div className="hidden lg:block">
            <nav className="flex gap-1 py-3">
              {TAB_ITEMS.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--accent-bg)] text-[var(--accent)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="events-tab-indicator"
                        className="absolute inset-0 rounded-full bg-[var(--accent-bg)] border border-[var(--accent)]/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={drawerOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--border)] bg-[var(--bg-primary)] lg:hidden ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Events Hub
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <span className="sr-only">Close</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4">
            <Link
              to="/app"
              onClick={() => setDrawerOpen(false)}
              className="hover:text-[var(--accent)] transition-colors"
            >
              App
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[var(--text-secondary)]">Events</span>
          </div>
          <nav className="flex flex-col gap-1">
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent)]/20"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] border border-transparent"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <Link
              to="/app"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Link>
          </div>
        </div>
      </motion.div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
