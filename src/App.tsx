import React, { Suspense, lazy, useState, useEffect, useCallback, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "./lib/api";
import { AuthProvider, useAuth } from "./lib/auth";
import { ThemeProvider } from "./lib/theme";
import { registerLandingCallbacks } from "./landing/integration";
import AppShell from "./components/AppShell";
import { RouteGuard, ProtectedRoute } from "./components/RouteGuard";
import { AuthRequiredProvider } from "./components/auth/AuthRequiredContext";
import AuthRequiredDialog from "./components/auth/AuthRequiredDialog";
import AuroraBackground from "./components/ui/animated-background";
import { HeroStats, Item, TeamStats } from "./types";
import heroesMaster from "./data/heroes_master.json";
import { ShieldCheck } from "lucide-react";

const DraftSimulator = lazy(() => import("./components/DraftSimulator"));
const HeroIntelligenceDashboard = lazy(() => import("./components/HeroIntelligenceDashboard"));
const HeroFullPage = lazy(() => import("./components/HeroFullPage"));
const StatsDashboard = lazy(() => import("./components/StatsDashboard"));
const TeamAnalytics = lazy(() => import("./components/TeamAnalytics"));
const DataCatalog = lazy(() => import("./components/DataCatalog"));
const AdminTools = lazy(() => import("./components/AdminTools"));
const TierListPanel = lazy(() => import("./components/TierListPanel"));
const CounterMatrixPanel = lazy(() => import("./components/CounterMatrixPanel"));
const TeamDraftPlanner = lazy(() => import("./components/TeamDraftPlanner"));
const MacroMapPlanner = lazy(() => import("./components/MacroMapPlanner"));
const LiquipediaDatabase = lazy(() => import("./components/LiquipediaDatabase"));
const LiveMatchHub = lazy(() => import("./components/LiveMatchHub"));

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const CompleteProfilePage = lazy(() => import("./pages/auth/CompleteProfilePage"));
const AppDashboard = lazy(() => import("./pages/app/AppDashboard"));
const ProfileLayout = lazy(() => import("./pages/profile/ProfileLayout"));
const ProfileOverview = lazy(() => import("./pages/profile/ProfileOverview"));
const ProfileMatches = lazy(() => import("./pages/profile/ProfileMatches"));
const ProfileStatistics = lazy(() => import("./pages/profile/ProfileStatistics"));
const ProfileFavorites = lazy(() => import("./pages/profile/ProfileFavorites"));
const ComingSoonPage = lazy(() => import("./pages/profile/ComingSoonPage"));
const CommunityLayout = lazy(() => import("./pages/community/CommunityLayout"));
const GlobalChat = lazy(() => import("./pages/community/GlobalChat"));
const LookingForScrim = lazy(() => import("./pages/community/LookingForScrim"));
const LookingForTeam = lazy(() => import("./pages/community/LookingForTeam"));
const LookingForPlayer = lazy(() => import("./pages/community/LookingForPlayer"));
const EventsLayout = lazy(() => import("./pages/events/EventsLayout"));
const CommunityCup = lazy(() => import("./pages/events/CommunityCup"));
const MySquad = lazy(() => import("./pages/events/MySquad"));
const TournamentHistory = lazy(() => import("./pages/events/TournamentHistory"));
const ServicesLayout = lazy(() => import("./pages/services/ServicesLayout"));
const ScrimServices = lazy(() => import("./pages/services/ScrimServices"));
const RoomTournament = lazy(() => import("./pages/services/RoomTournament"));
const AccountValuation = lazy(() => import("./pages/services/AccountValuation"));
const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout"));
const SettingsAccount = lazy(() => import("./pages/settings/SettingsAccount"));
const SettingsProfile = lazy(() => import("./pages/settings/SettingsProfile"));
const SettingsAppearance = lazy(() => import("./pages/settings/SettingsAppearance"));
const SettingsMLBB = lazy(() => import("./pages/settings/SettingsMLBB"));
const SettingsMembership = lazy(() => import("./pages/settings/SettingsMembership"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function ModuleLoader() {
  return (
    <div className="flex min-h-[320px] items-center justify-center text-sm text-[var(--text-muted)]">
      Loading module...
    </div>
  );
}

function AppLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="relative flex h-16 w-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20" />
          <div className="relative rounded-full h-16 w-16 bg-[var(--bg-card)] border border-cyan-500/35 flex items-center justify-center shadow-lg shadow-cyan-500/15">
            <div className="h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-sans text-md font-bold text-[var(--text-primary)] tracking-tight">MVP Draft</h3>
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Loading...</p>
        </div>
      </div>
    </div>
  );
}

interface SharedDataCtxType {
  heroes: HeroStats[];
  items: Item[];
  teamsData: TeamStats[];
  heroAssets: Record<string, string>;
  historyData: any[];
}

const SharedDataCtx = createContext<SharedDataCtxType>({
  heroes: [], items: [], teamsData: [], heroAssets: {}, historyData: [],
});

export function useSharedData() {
  return useContext(SharedDataCtx);
}

function SharedDataProvider({ children }: { children: React.ReactNode }) {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [heroes, setHeroes] = useState<HeroStats[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [teamsData, setTeamsData] = useState<TeamStats[]>([]);
  const [heroAssets, setHeroAssets] = useState<Record<string, string>>({});
  const [historyData, setHistoryData] = useState<any[]>([]);

  const loadAllData = useCallback(async () => {
    try {
      const [heroesRes, assetsRes, teamsRes, itemsRes, historyRes] = await Promise.all([
        fetch(apiUrl("/api/hero-stats")),
        fetch(apiUrl("/api/assets")),
        fetch(apiUrl("/api/team-stats")),
        fetch(apiUrl("/api/items")),
        fetch(apiUrl("/api/history")),
      ]);
      const [heroesData, assetsData, teamsDataRaw, itemsData, historyDataRaw] = await Promise.all([
        heroesRes.json(), assetsRes.json(), teamsRes.json(), itemsRes.json(), historyRes.json(),
      ]);
      setHeroes(Array.isArray(heroesData) ? heroesData : []);
      setHeroAssets(assetsData?.heroes || {});
      setTeamsData(Array.isArray(teamsDataRaw) ? teamsDataRaw : []);
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setHistoryData(Array.isArray(historyDataRaw) ? historyDataRaw : []);
    } catch (error) {
      console.error("Failed to fetch application data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  if (authLoading || loading) return <AppLoadingScreen />;

  return (
    <SharedDataCtx.Provider value={{ heroes, items, teamsData, heroAssets, historyData }}>
      {children}
    </SharedDataCtx.Provider>
  );
}

function LandingRoute() {
  const navigate = useNavigate();
  const LandingPage = React.lazy(() => import("./landing/components/LandingPage"));

  const handleChangeTab = useCallback((tab: string) => {
    const routeMap: Record<string, string> = {
      draft: "/app/draft",
      intelligence: "/app/hero-intelligence",
      heroes: "/app/heroes",
      teams: "/app/teams",
      items: "/app/data",
      counter: "/app/counters",
      tier: "/app/meta",
      tdp: "/app/draft-planner",
      macro: "/app/macro",
      live: "/app/live-matches",
      pro: "/app/pro",
    };
    const target = routeMap[tab];
    if (target) navigate(target);
    else if (tab === "admin") navigate("/app/admin-tools");
  }, [navigate]);

  useEffect(() => {
    registerLandingCallbacks(handleChangeTab, () => {}, undefined);
  }, [handleChangeTab]);

  return (
    <Suspense fallback={<AppLoadingScreen />}>
      <LandingPage onChangeTab={handleChangeTab} heroesCount={heroesMaster.length} />
    </Suspense>
  );
}

function FeatureRoute({ children, fullWidth }: { children: React.ReactNode; fullWidth?: boolean }) {
  const mainClass = fullWidth
    ? "mx-auto max-w-[1840px] px-4 py-6 sm:px-6 lg:py-8"
    : "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8";

  return (
    <>
      <AuroraBackground />
      <main className={`flex-1 w-full ${mainClass}`}>
        <Suspense fallback={<ModuleLoader />}>
          {children}
        </Suspense>
      </main>
    </>
  );
}

function GoogleOAuthRedirectHandler() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    const savedReturnTo = sessionStorage.getItem("mvp-auth-return-to");
    if (savedReturnTo && savedReturnTo.startsWith("/") && !savedReturnTo.startsWith("//") && !savedReturnTo.match(/^https?:\/\//)) {
      sessionStorage.removeItem("mvp-auth-return-to");
      if (window.location.pathname === "/app" && savedReturnTo !== "/app") {
        navigate(savedReturnTo, { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return null;
}

function AppRoutes() {
  const { heroes, items, teamsData, heroAssets } = useSharedData();
  const [intelligenceTarget, setIntelligenceTarget] = useState<string | null>(null);
  const [heroDetailTarget, setHeroDetailTarget] = useState<string | null>(null);
  const [draftInProgress, setDraftInProgress] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans text-[var(--text-primary)] bg-[var(--bg-primary)]">
      <GoogleOAuthRedirectHandler />

      {heroDetailTarget && (
        <Suspense fallback={<ModuleLoader />}>
          <HeroFullPage heroName={heroDetailTarget} heroAssets={heroAssets} onBack={() => setHeroDetailTarget(null)} />
        </Suspense>
      )}

      {!heroDetailTarget && (
        <Routes>
          {/* Public routes — no sidebar */}
          <Route path="/" element={<LandingRoute />} />
          <Route path="/login" element={<RouteGuard guestOnly><Suspense fallback={<AppLoadingScreen />}><LoginPage /></Suspense></RouteGuard>} />
          <Route path="/register" element={<RouteGuard guestOnly><Suspense fallback={<AppLoadingScreen />}><RegisterPage /></Suspense></RouteGuard>} />
          <Route path="/complete-profile" element={<RouteGuard incompleteProfileOnly><Suspense fallback={<AppLoadingScreen />}><CompleteProfilePage /></Suspense></RouteGuard>} />

          {/* Platform routes — AppShell (sidebar + topbar), NO auth required for preview */}
          <Route element={<AppShell />}>
            {/* Preview routes — accessible to guests (read-only) */}
            <Route path="/app" element={<Suspense fallback={<ModuleLoader />}><AppDashboard /></Suspense>} />
            <Route path="/app/draft" element={<FeatureRoute fullWidth><DraftSimulator heroes={heroes} heroAssets={heroAssets} teamsData={teamsData} user={null} setDraftInProgress={setDraftInProgress} /></FeatureRoute>} />
            <Route path="/app/heroes" element={<FeatureRoute><StatsDashboard heroes={heroes} heroAssets={heroAssets} onOpenHeroIntelligence={setIntelligenceTarget} onOpenFullPage={setHeroDetailTarget} /></FeatureRoute>} />
            <Route path="/app/hero-intelligence" element={<FeatureRoute><HeroIntelligenceDashboard heroAssets={heroAssets} initialHeroName={intelligenceTarget} onOpenFullPage={setHeroDetailTarget} /></FeatureRoute>} />
            <Route path="/app/data" element={<FeatureRoute><DataCatalog items={items} heroAssets={heroAssets} heroes={heroes} /></FeatureRoute>} />
            <Route path="/app/live-matches" element={<FeatureRoute><LiveMatchHub /></FeatureRoute>} />
            <Route path="/app/draft-planner" element={<FeatureRoute fullWidth><TeamDraftPlanner heroes={heroes} heroAssets={heroAssets} /></FeatureRoute>} />
            <Route path="/app/counters" element={<FeatureRoute><CounterMatrixPanel heroes={heroes} heroAssets={heroAssets} /></FeatureRoute>} />
            <Route path="/app/macro" element={<FeatureRoute fullWidth><MacroMapPlanner /></FeatureRoute>} />
            <Route path="/app/teams" element={<FeatureRoute><TeamAnalytics teamsData={teamsData} heroAssets={heroAssets} heroes={heroes} /></FeatureRoute>} />
            <Route path="/app/meta" element={<FeatureRoute><TierListPanel heroes={heroes} heroAssets={heroAssets} /></FeatureRoute>} />
            <Route path="/app/pro" element={<FeatureRoute><LiquipediaDatabase /></FeatureRoute>} />

            <Route path="/community" element={<Suspense fallback={<ModuleLoader />}><CommunityLayout /></Suspense>}>
              <Route index element={<Navigate to="chat" replace />} />
              <Route path="chat" element={<Suspense fallback={<ModuleLoader />}><GlobalChat /></Suspense>} />
              <Route path="lfs" element={<Suspense fallback={<ModuleLoader />}><LookingForScrim /></Suspense>} />
              <Route path="lft" element={<Suspense fallback={<ModuleLoader />}><LookingForTeam /></Suspense>} />
              <Route path="lfp" element={<Suspense fallback={<ModuleLoader />}><LookingForPlayer /></Suspense>} />
            </Route>

            <Route path="/events" element={<Suspense fallback={<ModuleLoader />}><EventsLayout /></Suspense>}>
              <Route index element={<Navigate to="community-cup" replace />} />
              <Route path="community-cup" element={<Suspense fallback={<ModuleLoader />}><CommunityCup /></Suspense>} />
              <Route path="my-squad" element={<ProtectedRoute><Suspense fallback={<ModuleLoader />}><MySquad /></Suspense></ProtectedRoute>} />
              <Route path="history" element={<ProtectedRoute><Suspense fallback={<ModuleLoader />}><TournamentHistory /></Suspense></ProtectedRoute>} />
            </Route>

            <Route path="/services" element={<Suspense fallback={<ModuleLoader />}><ServicesLayout /></Suspense>}>
              <Route index element={<Navigate to="scrim" replace />} />
              <Route path="scrim" element={<Suspense fallback={<ModuleLoader />}><ScrimServices /></Suspense>} />
              <Route path="room-tournament" element={<Suspense fallback={<ModuleLoader />}><RoomTournament /></Suspense>} />
              <Route path="account-valuation" element={<Suspense fallback={<ModuleLoader />}><AccountValuation /></Suspense>} />
            </Route>

            {/* Protected routes — require login */}
            <Route path="/app/admin-tools" element={<ProtectedRoute><FeatureRoute><AdminTools /></FeatureRoute></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<ModuleLoader />}><ProfileLayout /></Suspense></ProtectedRoute>}>
              <Route index element={<Suspense fallback={<ModuleLoader />}><ProfileOverview /></Suspense>} />
              <Route path="matches" element={<Suspense fallback={<ModuleLoader />}><ProfileMatches /></Suspense>} />
              <Route path="statistics" element={<Suspense fallback={<ModuleLoader />}><ProfileStatistics /></Suspense>} />
              <Route path="favorites" element={<Suspense fallback={<ModuleLoader />}><ProfileFavorites /></Suspense>} />
              <Route path="squad" element={<Suspense fallback={<ModuleLoader />}><MySquad /></Suspense>} />
              <Route path="tournaments" element={<Suspense fallback={<ModuleLoader />}><TournamentHistory /></Suspense>} />
              <Route path="community/chat" element={<Navigate to="/community/chat" replace />} />
              <Route path="community/scrim" element={<Navigate to="/community/lfs" replace />} />
              <Route path="community/team" element={<Navigate to="/community/lft" replace />} />
              <Route path="community/player" element={<Navigate to="/community/lfp" replace />} />
              <Route path="competitive/squad" element={<Navigate to="/events/my-squad" replace />} />
              <Route path="competitive/tournament" element={<Navigate to="/events/community-cup" replace />} />
              <Route path="competitive/history" element={<Navigate to="/events/history" replace />} />
              <Route path="services/scrim" element={<Navigate to="/services/scrim" replace />} />
              <Route path="services/room" element={<Navigate to="/services/room-tournament" replace />} />
              <Route path="services/valuation" element={<Navigate to="/services/account-valuation" replace />} />
            </Route>

            <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<ModuleLoader />}><SettingsLayout /></Suspense></ProtectedRoute>}>
              <Route index element={<Navigate to="account" replace />} />
              <Route path="account" element={<Suspense fallback={<ModuleLoader />}><SettingsAccount /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<ModuleLoader />}><SettingsProfile /></Suspense>} />
              <Route path="appearance" element={<Suspense fallback={<ModuleLoader />}><SettingsAppearance /></Suspense>} />
              <Route path="mlbb" element={<Suspense fallback={<ModuleLoader />}><SettingsMLBB /></Suspense>} />
              <Route path="membership" element={<Suspense fallback={<ModuleLoader />}><SettingsMembership /></Suspense>} />
            </Route>
          </Route>

          <Route path="*" element={<Suspense fallback={<ModuleLoader />}><NotFoundPage /></Suspense>} />
        </Routes>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AuthRequiredProvider>
            <SharedDataProvider>
              <AppRoutes />
              <AuthRequiredDialog />
            </SharedDataProvider>
          </AuthRequiredProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
