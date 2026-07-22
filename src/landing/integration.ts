import heroesMaster from "../data/heroes_master.json";
import { getHeroImageUrl } from "../lib/heroUtils";
import FallbackImage from "../components/FallbackImage";

export type TabId = "home" | "draft" | "intelligence" | "heroes" | "teams" | "items" | "counter" | "tier" | "tdp" | "macro" | "admin";

// These will be set by App.tsx via setLandingCallbacks
let _onChangeTab: ((tab: string) => void) | null = null;
let _setAppView: ((v: boolean) => void) | null = null;
let _onOpenHero: ((heroName: string) => void) | null = null;

export function registerLandingCallbacks(onChangeTab: (tab: string) => void, setAppView: (v: boolean) => void, onOpenHero?: (heroName: string) => void) {
  _onChangeTab = onChangeTab;
  _setAppView = setAppView;
  _onOpenHero = onOpenHero || null;
}

export function enterApp(targetTab?: TabId, heroName?: string) {
  if (heroName && _onOpenHero) {
    _onOpenHero(heroName);
    window.scrollTo({ top: 0, behavior: "smooth" });
    sessionStorage.setItem("draftHasEnteredApp", "true");
    return;
  }
  if (targetTab && _onChangeTab) _onChangeTab(targetTab);
  if (_setAppView) _setAppView(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
  sessionStorage.setItem("draftHasEnteredApp", "true");
}

export function resolveHeroPortrait(slug: string, heroAssets: Record<string, string> = {}): string {
  // Find hero by slug in heroesMaster
  const hero = (heroesMaster as any[]).find((h: any) => h.slug === slug);
  if (hero) return getHeroImageUrl(hero.hero_name, heroAssets);
  // Fallback
  return "/raw-assets/regular_season_files/60px-ML_icon_Zhuxin.png";
}

export function getHeroList() {
  return heroesMaster as Array<{ hero_id: number; hero_name: string; slug: string; role: string[]; lanes: string[] }>;
}

export function getHeroCount(): number {
  return (heroesMaster as any[]).length;
}

export { FallbackImage };
