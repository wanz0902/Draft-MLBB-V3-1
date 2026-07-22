export type EsportsAsset = {
  src: string;
  label?: string;
  source?: "local" | "cached" | "manual" | "liquipedia-api";
  credit?: string;
  sourceUrl?: string;
};

// ─── Team Logo Mapping ──────────────────────────────────────────────────────
// Maps team names/templates to local asset paths in public/raw-assets/

export const TEAM_LOGO_OVERRIDES: Record<string, EsportsAsset> = {
  "ONIC": { src: "/raw-assets/regular_season_files/74px-ONIC_Esports_2019_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "ONIC Esports": { src: "/raw-assets/regular_season_files/74px-ONIC_Esports_2019_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "RRQ": { src: "/raw-assets/regular_season_files/74px-RRQ_2019_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "RRQ Hoshi": { src: "/raw-assets/regular_season_files/74px-RRQ_2019_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "EVOS": { src: "/raw-assets/regular_season_files/52px-EVOS_Esports_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "EVOS Glory": { src: "/raw-assets/regular_season_files/52px-EVOS_Esports_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "EVOS Legends": { src: "/raw-assets/regular_season_files/52px-EVOS_Esports_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "Bigetron": { src: "/raw-assets/regular_season_files/56px-Bigetron_2020_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "Bigetron Alpha": { src: "/raw-assets/regular_season_files/56px-Bigetron_2020_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "Team Liquid ID": { src: "/raw-assets/regular_season_files/44px-Team_Liquid_2024_darkmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "Alter Ego": { src: "/raw-assets/regular_season_files/51px-Alter_Ego_2022_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "Geek Fam": { src: "/raw-assets/regular_season_files/43px-Geek_Fam_2019_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
  "Dewa United": { src: "/raw-assets/regular_season_files/76px-Dewa_United_Esports_allmode.png", source: "local", credit: "Liquipedia regular_season_files" },
};

export const TOURNAMENT_LOGO_OVERRIDES: Record<string, EsportsAsset> = {
  "MPL Indonesia Season 17": { src: "/raw-assets/regular_season_files/44px-Team_Liquid_2024_lightmode.png", source: "local", label: "MPL ID S17", credit: "Local asset" },
  "MPL Indonesia": { src: "/raw-assets/regular_season_files/44px-Team_Liquid_2024_lightmode.png", source: "local", label: "MPL", credit: "Local asset" },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeTeamKey(name: string | null | undefined): string {
  return (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getTeamLogoAsset(teamName: string | null | undefined): EsportsAsset | null {
  if (!teamName) return null;
  const direct = TEAM_LOGO_OVERRIDES[teamName];
  if (direct) return direct;
  const normalized = normalizeTeamKey(teamName);
  for (const [key, val] of Object.entries(TEAM_LOGO_OVERRIDES)) {
    if (normalizeTeamKey(key) === normalized) return val;
  }
  return null;
}

export function getTournamentLogoAsset(tournamentName: string | null | undefined): EsportsAsset | null {
  if (!tournamentName) return null;
  const direct = TOURNAMENT_LOGO_OVERRIDES[tournamentName];
  if (direct) return direct;
  const lower = tournamentName.toLowerCase();
  for (const [key, val] of Object.entries(TOURNAMENT_LOGO_OVERRIDES)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return null;
}
