import { useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  User,
  History,
  BarChart3,
  Heart,
  Shield,
  ScrollText,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../lib/auth";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const PLAYER_PROFILE: SidebarItem[] = [
  { label: "Overview", path: "/profile", icon: User },
  { label: "Match History", path: "/profile/matches", icon: History },
  { label: "Statistics", path: "/profile/statistics", icon: BarChart3 },
  { label: "Favorite Heroes", path: "/profile/favorites", icon: Heart },
  { label: "My Squad", path: "/profile/squad", icon: Shield },
  { label: "Tournament History", path: "/profile/tournaments", icon: ScrollText },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/profile") return location.pathname === "/profile";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="py-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Player Profile
        </p>
        <div className="space-y-0.5">
          {PLAYER_PROFILE.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-l-2 border-cyan-400 bg-[var(--accent-bg)] text-cyan-400"
                    : "border-l-2 border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-4 px-4">
        <Link
          to="/app"
          onClick={onNavigate}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Link>
      </div>
    </nav>
  );
}

export default function ProfileLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] bg-[var(--bg-primary)] lg:block sticky top-16 h-[calc(100vh-4rem)]">
        <SidebarContent />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--border)] bg-[var(--bg-primary)] transition-transform duration-300 lg:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Profile</span>
          <button onClick={() => setDrawerOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 lg:hidden sticky top-16 z-30">
          <button onClick={() => setDrawerOpen(true)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-[var(--text-primary)]">Profile</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
