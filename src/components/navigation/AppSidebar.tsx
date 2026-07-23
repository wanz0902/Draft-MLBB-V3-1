import { useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  Home, Target, Sparkles, Database, Radio, Shield,
  MessageSquare, Trophy, Users, Swords, DoorOpen, Gem,
  TrendingUp, Map, ChevronRight, Settings,
  PanelLeftClose, PanelLeftOpen, X, Sword,
  LogIn, UserPlus, User, Coins,
} from "lucide-react";
import { useAuth } from "../../lib/auth";

const NAVIGATE_ITEMS = [
  { label: "Home", short: "Home", icon: Home, path: "/app" },
  { label: "Draft", short: "Draft", icon: Target, path: "/app/draft" },
  { label: "Heroes", short: "Heroes", icon: Sparkles, path: "/app/heroes" },
  { label: "Data", short: "Data", icon: Database, path: "/app/data" },
  { label: "Live Matches", short: "Live", icon: Radio, path: "/app/live-matches" },
  { label: "Draft Planner", short: "Planner", icon: Shield, path: "/app/draft-planner" },
];

const ANALYSIS_ITEMS = [
  { label: "Players", short: "Players", icon: User, path: "/app/pro" },
  { label: "Teams", short: "Teams", icon: Users, path: "/app/teams" },
  { label: "Counters", short: "Counter", icon: Swords, path: "/app/counters" },
  { label: "Macro", short: "Macro", icon: Map, path: "/app/macro" },
  { label: "Meta", short: "Meta", icon: TrendingUp, path: "/app/meta" },
];

const COMMUNITY_ITEMS = [
  { label: "Community Hub", short: "Chat", icon: MessageSquare, path: "/community" },
  { label: "Community Cup", short: "Cup", icon: Trophy, path: "/events/community-cup" },
  { label: "My Squad", short: "Squad", icon: Shield, path: "/events/my-squad" },
  { label: "Tournament History", short: "History", icon: TrendingUp, path: "/events/history" },
];

const SERVICES_ITEMS = [
  { label: "Scrim Services", short: "Scrim", icon: Sword, path: "/services/scrim" },
  { label: "Tournament Room", short: "Room", icon: DoorOpen, path: "/services/room-tournament" },
  { label: "Account Valuation", short: "Value", icon: Gem, path: "/services/account-valuation" },
];

function isGroupActive(path: string, pathname: string): boolean {
  if (path === "/app") return pathname === "/app";
  return pathname === path || pathname.startsWith(path + "/");
}

interface SidebarProps {
  compact: boolean;
  onToggleCompact: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AppSidebar({
  compact,
  onToggleCompact,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isGuest = !user;

  useEffect(() => { onMobileClose(); }, [location.pathname, onMobileClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) onMobileClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, onMobileClose]);

  const membershipLabel = user?.membership_plan
    ? user.membership_plan.charAt(0).toUpperCase() + user.membership_plan.slice(1)
    : "Free";

  const renderExpandedNavItems = useCallback((items: typeof NAVIGATE_ITEMS) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = isGroupActive(item.path, location.pathname);
      return (
        <NavLink
          key={item.path}
          to={item.path}
          title={item.label}
          className={`flex flex-row items-center w-full min-w-0 gap-2.5 px-3 py-2 rounded-[10px] text-[13px] font-medium no-underline cursor-pointer relative transition-all duration-150 ${
            active
              ? "bg-[rgba(6,182,212,0.08)] text-[#67e8f9]"
              : "text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#e2e8f0]"
          }`}
        >
          <span className="flex-shrink-0 inline-flex items-center justify-center w-[18px] h-[18px]">
            <Icon className="w-[18px] h-[18px]" />
          </span>
          <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
            {item.label}
          </span>
          {active && <div className="sidebar-active-indicator" />}
        </NavLink>
      );
    }),
  [location.pathname]);

  const renderCompactNavItems = useCallback((items: typeof NAVIGATE_ITEMS) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = isGroupActive(item.path, location.pathname);
      return (
        <NavLink
          key={item.path}
          to={item.path}
          title={item.label}
          className={`flex flex-row items-center w-full min-w-0 gap-2 px-2.5 py-[7px] rounded-[8px] text-[11px] font-medium no-underline cursor-pointer relative transition-all duration-150 ${
            active
              ? "bg-[rgba(6,182,212,0.1)] text-[#67e8f9]"
              : "text-[#94a3b8] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#e2e8f0]"
          }`}
        >
          <span className="flex-shrink-0 inline-flex items-center justify-center w-[16px] h-[16px]">
            <Icon className="w-[16px] h-[16px]" />
          </span>
          <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
            {item.short}
          </span>
          {active && <div className="sidebar-active-indicator" />}
        </NavLink>
      );
    }),
  [location.pathname]);

  const expandedSidebar = (
    <div className="flex flex-col h-full w-[var(--app-sidebar-expanded-width)] bg-[#070c16] border-r border-[rgba(255,255,255,0.06)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
        <Link to="/app" className="flex items-center gap-2.5 no-underline min-w-0" onClick={onMobileClose}>
          <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#22d3ee] to-[#2563eb] font-mono text-[11px] font-black text-[#020617] flex-shrink-0 shadow-[0_8px_24px_-8px_rgba(34,211,238,0.6)]">
            ML
          </div>
          <div className="min-w-0">
            <div className="font-display text-[14px] font-bold text-[#f1f5f9] leading-tight truncate">MVP Draft</div>
            <div className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-[rgba(34,211,238,0.5)] leading-tight">Command Center</div>
          </div>
        </Link>
        <button
          onClick={onToggleCompact}
          className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-[#475569] cursor-pointer transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#94a3b8] flex-shrink-0"
          aria-label="Switch to compact mode"
          title="Compact mode"
          type="button"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Nav scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3 px-3 sidebar-scroll">
        <div className="mb-1">
          <div className="px-2 pb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">NAVIGATE</div>
          <div className="space-y-0.5">
            {renderExpandedNavItems(NAVIGATE_ITEMS)}
          </div>
        </div>
        <div className="mb-1">
          <div className="px-2 pb-1 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">ANALYSIS</div>
          <div className="space-y-0.5">
            {renderExpandedNavItems(ANALYSIS_ITEMS)}
          </div>
        </div>
        <div className="mb-1">
          <div className="px-2 pb-1 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">COMMUNITY</div>
          <div className="space-y-0.5">
            {renderExpandedNavItems(COMMUNITY_ITEMS)}
          </div>
        </div>
        <div>
          <div className="px-2 pb-1 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">SERVICES</div>
          <div className="space-y-0.5">
            {renderExpandedNavItems(SERVICES_ITEMS)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-2.5 pb-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <Link to="/events/community-cup" className="block p-3 rounded-xl border border-[rgba(250,204,21,0.08)] bg-[rgba(250,204,21,0.02)] no-underline transition-all duration-150 hover:border-[rgba(250,204,21,0.15)] hover:bg-[rgba(250,204,21,0.04)]" onClick={onMobileClose}>
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#fbbf24]">COMMUNITY CUP</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col gap-px">
              <span className="text-[9px] text-[#64748b]">Members</span>
              <span className="text-[11px] font-bold text-[#f1f5f9]">0 / 100</span>
            </div>
            <div className="flex flex-col gap-px">
              <span className="text-[9px] text-[#64748b]">Prize Fund</span>
              <span className="text-[11px] font-bold text-yellow-400">Rp0</span>
            </div>
          </div>
          <div className="h-[3px] rounded-[2px] bg-[rgba(255,255,255,0.06)] mb-2 overflow-hidden">
            <div className="h-full rounded-[2px] bg-gradient-to-r from-[#facc15] to-[#f59e0b] transition-all duration-600" style={{ width: "0%" }} />
          </div>
          <div className="flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-semibold text-[#94a3b8] transition-all duration-150">
            View Event <ChevronRight className="w-3 h-3" />
          </div>
        </Link>

        {isGuest ? (
          <div className="p-3 rounded-xl border border-[rgba(34,211,238,0.12)] bg-[rgba(34,211,238,0.03)]">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.06)] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[#e2e8f0] leading-tight">Guest Preview</div>
                <div className="text-[9px] text-[#64748b] leading-tight">Sign in to unlock features</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { navigate("/login"); onMobileClose(); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-[10px] font-bold text-white transition hover:from-cyan-500 hover:to-blue-500"
              >
                <LogIn className="w-3 h-3" /> Sign In
              </button>
              <button
                onClick={() => { navigate("/register"); onMobileClose(); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-white transition hover:bg-white/[0.08]"
              >
                <UserPlus className="w-3 h-3" /> Create
              </button>
            </div>
          </div>
        ) : (
          <Link to="/profile" className="flex items-center gap-2.5 p-2.5 rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] no-underline cursor-pointer transition-all duration-150 hover:border-[rgba(34,211,238,0.15)] hover:bg-[rgba(34,211,238,0.03)]" onClick={onMobileClose}>
            <img
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email || "U"}&background=0D8ABC&color=fff`}
              alt="Profile"
              className="w-8 h-8 rounded-full border-[1.5px] border-[rgba(34,211,238,0.25)] object-cover flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[#e2e8f0] truncate leading-tight">
                {user?.mlbb_nickname || user?.name || "Player"}
              </div>
              <div className="font-mono text-[9px] text-[#64748b] leading-tight">{membershipLabel} Plan</div>
            </div>
            <Link
              to="/settings/profile"
              className="flex items-center justify-center w-7 h-7 rounded-md text-[#64748b] no-underline flex-shrink-0 transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#94a3b8]"
              onClick={(e) => { e.stopPropagation(); onMobileClose(); }}
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
          </Link>
        )}
      </div>
    </div>
  );

  const compactSidebar = (
    <div className="flex flex-col h-full w-[var(--app-sidebar-compact-width)] bg-[#070c16] border-r border-[rgba(255,255,255,0.06)]">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 px-2 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
        <Link to="/app" className="flex items-center justify-center no-underline" title="MVP Draft Home" onClick={onMobileClose}>
          <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#22d3ee] to-[#2563eb] font-mono text-[11px] font-black text-[#020617] shadow-[0_8px_24px_-8px_rgba(34,211,238,0.6)]">
            ML
          </div>
        </Link>
        <button
          onClick={onToggleCompact}
          className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-[#475569] cursor-pointer transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#94a3b8]"
          aria-label="Switch to expanded mode"
          title="Expand sidebar"
          type="button"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Nav scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-2 px-2 sidebar-scroll">
        <div className="space-y-0.5">
          {renderCompactNavItems(NAVIGATE_ITEMS)}
        </div>
        <div className="w-7 h-px bg-[#1e293b] mx-auto my-1.5" />
        <div className="space-y-0.5">
          {renderCompactNavItems(ANALYSIS_ITEMS)}
        </div>
        <div className="w-7 h-px bg-[#1e293b] mx-auto my-1.5" />
        <div className="space-y-0.5">
          {renderCompactNavItems(COMMUNITY_ITEMS)}
        </div>
        <div className="w-7 h-px bg-[#1e293b] mx-auto my-1.5" />
        <div className="space-y-0.5">
          {renderCompactNavItems(SERVICES_ITEMS)}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 py-3 px-2 border-t border-[rgba(255,255,255,0.06)] flex flex-col items-center gap-2.5" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        {/* Mini Milestone Widget */}
        <Link
          to="/events/community-cup"
          className="group w-full flex flex-col items-center gap-1.5 p-2 rounded-xl border border-[rgba(250,204,21,0.08)] bg-[rgba(250,204,21,0.02)] no-underline transition-all duration-200 hover:border-[rgba(250,204,21,0.18)] hover:bg-[rgba(250,204,21,0.05)]"
          title="Community Cup — Members & Prize Fund"
          onClick={onMobileClose}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[rgba(250,204,21,0.08)] border border-[rgba(250,204,21,0.12)] flex-shrink-0 transition-colors group-hover:bg-[rgba(250,204,21,0.14)]">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="w-full flex flex-col items-center gap-1">
            <div className="w-full flex items-center justify-between px-0.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#64748b]">Mbr</span>
              <span className="text-[10px] font-bold text-[#e2e8f0] leading-none">0<tspan className="text-[#64748b] font-normal">/100</tspan></span>
            </div>
            <div className="w-full flex items-center justify-between px-0.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#64748b]">Fund</span>
              <span className="text-[10px] font-bold text-yellow-400 leading-none">Rp0</span>
            </div>
          </div>
          <div className="w-full h-[2px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#facc15] to-[#f59e0b] transition-all duration-500" style={{ width: "0%" }} />
          </div>
        </Link>

        {/* Profile / Guest */}
        {isGuest ? (
          <button
            onClick={() => { navigate("/login"); onMobileClose(); }}
            className="w-9 h-9 rounded-full border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.06)] flex items-center justify-center transition-all duration-150 hover:bg-[rgba(34,211,238,0.14)] hover:border-[rgba(34,211,238,0.3)]"
            title="Sign In"
          >
            <LogIn className="w-4 h-4 text-cyan-400" />
          </button>
        ) : (
          <Link
            to="/profile"
            className="relative no-underline group"
            onClick={onMobileClose}
            title={user?.mlbb_nickname || "Profile"}
          >
            <img
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email || "U"}&background=0D8ABC&color=fff`}
              alt="Profile"
              className="w-9 h-9 rounded-full border-[1.5px] border-[rgba(34,211,238,0.25)] object-cover transition-all duration-150 group-hover:border-[rgba(34,211,238,0.45)] group-hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]"
              referrerPolicy="no-referrer"
            />
            {user?.membership_plan && user.membership_plan !== "free" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-[1.5px] border-[#070c16] flex items-center justify-center" title={membershipLabel}>
                <Gem className="w-2 h-2 text-white" />
              </div>
            )}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-sidebar-desktop" data-compact={compact || undefined}>
        {compact ? compactSidebar : expandedSidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="sidebar-mobile-overlay"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div
            className="sidebar-mobile-drawer"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
              <Link to="/app" className="flex items-center gap-2.5 no-underline min-w-0" onClick={onMobileClose}>
                <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#22d3ee] to-[#2563eb] font-mono text-[11px] font-black text-[#020617] flex-shrink-0 shadow-[0_8px_24px_-8px_rgba(34,211,238,0.6)]">
                  ML
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[14px] font-bold text-[#f1f5f9] leading-tight truncate">MVP Draft</div>
                  <div className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-[rgba(34,211,238,0.5)] leading-tight">Command Center</div>
                </div>
              </Link>
              <button
                onClick={onMobileClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg border-none bg-transparent text-[#64748b] cursor-pointer transition-all duration-150 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#e2e8f0] flex-shrink-0"
                aria-label="Close navigation"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3 px-3 sidebar-scroll">
              <div className="mb-1">
                <div className="px-2 pb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">NAVIGATE</div>
                <div className="space-y-0.5">{renderExpandedNavItems(NAVIGATE_ITEMS)}</div>
              </div>
              <div className="mb-1">
                <div className="px-2 pb-1 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">ANALYSIS</div>
                <div className="space-y-0.5">{renderExpandedNavItems(ANALYSIS_ITEMS)}</div>
              </div>
              <div className="mb-1">
                <div className="px-2 pb-1 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">COMMUNITY</div>
                <div className="space-y-0.5">{renderExpandedNavItems(COMMUNITY_ITEMS)}</div>
              </div>
              <div>
                <div className="px-2 pb-1 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#475569] select-none">SERVICES</div>
                <div className="space-y-0.5">{renderExpandedNavItems(SERVICES_ITEMS)}</div>
              </div>
            </div>

            <div className="flex-shrink-0 p-3 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-2">
              <Link to="/events/community-cup" className="block p-3 rounded-xl border border-[rgba(250,204,21,0.08)] bg-[rgba(250,204,21,0.02)] no-underline transition-all duration-150 hover:border-[rgba(250,204,21,0.15)] hover:bg-[rgba(250,204,21,0.04)]" onClick={onMobileClose}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#fbbf24]">COMMUNITY CUP</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex flex-col gap-px">
                    <span className="text-[9px] text-[#64748b]">Members</span>
                    <span className="text-[11px] font-bold text-[#f1f5f9]">0 / 100</span>
                  </div>
                  <div className="flex flex-col gap-px">
                    <span className="text-[9px] text-[#64748b]">Prize Fund</span>
                    <span className="text-[11px] font-bold text-yellow-400">Rp0</span>
                  </div>
                </div>
                <div className="h-[3px] rounded-[2px] bg-[rgba(255,255,255,0.06)] mb-2 overflow-hidden">
                  <div className="h-full rounded-[2px] bg-gradient-to-r from-[#facc15] to-[#f59e0b]" style={{ width: "0%" }} />
                </div>
                <div className="flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-semibold text-[#94a3b8]">
                  View Event <ChevronRight className="w-3 h-3" />
                </div>
              </Link>

              {isGuest ? (
                <div className="p-3 rounded-xl border border-[rgba(34,211,238,0.12)] bg-[rgba(34,211,238,0.03)]">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.06)] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-[#e2e8f0] leading-tight">Guest Preview</div>
                      <div className="text-[9px] text-[#64748b] leading-tight">Sign in to unlock features</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { navigate("/login"); onMobileClose(); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-[10px] font-bold text-white transition hover:from-cyan-500 hover:to-blue-500"
                    >
                      <LogIn className="w-3 h-3" /> Sign In
                    </button>
                    <button
                      onClick={() => { navigate("/register"); onMobileClose(); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      <UserPlus className="w-3 h-3" /> Create
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/profile" className="flex items-center gap-2.5 p-2.5 rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] no-underline cursor-pointer transition-all duration-150 hover:border-[rgba(34,211,238,0.15)] hover:bg-[rgba(34,211,238,0.03)]" onClick={onMobileClose}>
                  <img
                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email || "U"}&background=0D8ABC&color=fff`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-[1.5px] border-[rgba(34,211,238,0.25)] object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#e2e8f0] truncate leading-tight">
                      {user?.mlbb_nickname || user?.name || "Player"}
                    </div>
                    <div className="font-mono text-[9px] text-[#64748b] leading-tight">{membershipLabel} Plan</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
