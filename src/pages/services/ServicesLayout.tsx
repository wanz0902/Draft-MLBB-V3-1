import { NavLink, Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swords, DoorOpen, Gem, ArrowLeft, ChevronRight, Home, Sparkles } from "lucide-react";

interface Tab {
  label: string;
  path: string;
  icon: React.ElementType;
}

const SERVICE_TABS: Tab[] = [
  { label: "Scrim Services", path: "/services/scrim", icon: Swords },
  { label: "Room Tournament", path: "/services/room-tournament", icon: DoorOpen },
  { label: "Account Valuation", path: "/services/account-valuation", icon: Gem },
];

export default function ServicesLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Home className="h-3 w-3" />
          <span>App</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[var(--text-secondary)]">Services</span>
        </div>

        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/[0.07] blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-cyan-500/[0.07] blur-2xl" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Services Hub</h1>
                <p className="text-sm text-[var(--text-muted)]">Professional esports services and tools</p>
              </div>
            </div>
            <Link to="/app" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-card-hover)]">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to App
            </Link>
          </div>
        </div>

        <nav className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1">
          {SERVICE_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive ? "text-cyan-400" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="services-tab-indicator"
                        className="absolute inset-0 rounded-lg bg-[var(--accent-bg)] border border-cyan-500/20"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      />
                    )}
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{tab.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
