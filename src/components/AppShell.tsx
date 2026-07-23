import { useState, useCallback, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppSidebar from "./navigation/AppSidebar";
import { useAuth } from "../lib/auth";

function getInitialCompact(): boolean {
  try {
    return localStorage.getItem("mvp-sidebar-compact") === "true";
  } catch {
    return false;
  }
}

const ROUTE_TITLES: Record<string, string> = {
  "/app": "Dashboard",
  "/app/draft": "Draft Simulator",
  "/app/heroes": "Heroes",
  "/app/hero-intelligence": "Hero Intelligence",
  "/app/data": "Data Catalog",
  "/app/live-matches": "Live Matches",
  "/app/draft-planner": "Draft Planner",
  "/app/counters": "Counter Matrix",
  "/app/macro": "Macro Planner",
  "/app/teams": "Team Analytics",
  "/app/meta": "Meta Tier List",
  "/app/pro": "Liquipedia",
  "/app/admin-tools": "Admin Tools",
  "/community": "Community Hub",
  "/community/chat": "Global Chat",
  "/community/lfs": "Looking for Scrim",
  "/community/lft": "Looking for Team",
  "/community/lfp": "Looking for Player",
  "/events": "Events",
  "/events/community-cup": "Community Cup",
  "/events/my-squad": "My Squad",
  "/events/history": "Tournament History",
  "/services": "Services",
  "/services/scrim": "Scrim Services",
  "/services/room-tournament": "Tournament Room",
  "/services/account-valuation": "Account Valuation",
  "/profile": "Profile",
  "/settings": "Settings",
  "/settings/account": "Account Settings",
  "/settings/profile": "Profile Settings",
  "/settings/appearance": "Appearance",
  "/settings/mlbb": "MLBB Settings",
  "/settings/membership": "Membership",
};

function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const key = "/" + segments.slice(0, 2).join("/");
    if (ROUTE_TITLES[key]) return ROUTE_TITLES[key];
  }
  return "Dashboard";
}

export default function AppShell() {
  const [compact, setCompact] = useState(getInitialCompact);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = !user;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleCompact = useCallback(() => {
    setCompact((prev) => {
      const next = !prev;
      try { localStorage.setItem("mvp-sidebar-compact", String(next)); } catch {}
      return next;
    });
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const sidebarMode = isMobile ? "mobile" : compact ? "compact" : "expanded";
  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  const returnTo = encodeURIComponent(location.pathname);

  return (
    <div className="app-shell" data-sidebar-mode={sidebarMode}>
      <AppSidebar
        compact={compact}
        onToggleCompact={toggleCompact}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />
      <div className="app-main">
        <header className="app-topbar">
          <div className="app-topbar-inner">
            <div className="app-topbar-left">
              {/* Hamburger only visible on mobile/tablet via CSS */}
              <button
                onClick={openMobile}
                className="app-topbar-menu"
                aria-label="Open menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <span className="app-topbar-title">{pageTitle}</span>
            </div>
            <div className="app-topbar-right">
              {isGuest ? (
                <>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Preview Mode
                  </span>
                  <button
                    onClick={() => navigate(`/login?returnTo=${returnTo}`)}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate(`/register?returnTo=${returnTo}`)}
                    className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:from-cyan-500 hover:to-blue-500 shadow-[0_4px_12px_-4px_rgba(6,182,212,0.4)]"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  <div className="app-topbar-badge online">
                    <span className="app-topbar-badge-dot" />
                    <span className="app-topbar-badge-text">Online</span>
                  </div>
                  <div className="app-topbar-badge users">
                    <span className="app-topbar-badge-dot amber" />
                    <span className="app-topbar-badge-text">Users</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
