# Data Source of Truth Map

> Generated: 2026-07-23

For each data domain, this map identifies the canonical source, fallback, sync method, and UI consumer.

| Domain | Canonical Source | Fallback | Sync Method | UI Consumer |
|--------|------------------|----------|-------------|-------------|
| Heroes (catalog) | `data/heroes_master.json` (132) | SQLite `heroes` table | Manual seed on server start | `/app/heroes` via SharedDataProvider |
| Hero Details | `data/heroes/{slug}.json` (132 files) | — | Manual/Liquipedia scrape | `/app/heroes` → hero detail modal |
| Hero Tournament Stats | `data/heroes_stats.json` (84) | SQLite `heroes` table stats columns | Liquipedia scrape (`/api/scrape/liquipedia`) | `/app/heroes` stats grid |
| Hero Advanced Data | `data/heroes_advanced.json` (2 only) | — | Manual creation | `/app/hero-intelligence` |
| Global Rank Meta | `data/global_rank_stats.json` (132) | — | Manual export from Moonton | `/app/meta` |
| Pro Players | `data/liquipedia/players.json` (599) | — | Liquipedia API sync (`/api/admin/liquipedia/apply-updates`) | `/app/pro` (LiquipediaDatabase) |
| Player Detail | `data/players_detail/{nickname}.json` (1 only) | Liquipedia API on-demand | Manual scrape per player | `/app/pro` detail modal |
| Pro Teams | `data/liquipedia/teams.json` (343) | — | Liquipedia API sync | `/app/pro` Teams tab |
| Team Analytics | `data/regular_matches.json` (72 matches) | — | Manual import | `/app/teams` |
| MPL Teams (Draft) | Static config in server.ts | Team assets in `regular_season_files/` | Manual | `/app/draft` |
| Items | `data/items.json` (103) + `aset_item/` icons | — | Manual creation | `/app/data` Items tab |
| Emblems | `data/emblems.json` (33) + `aset_emblem/` icons | — | Manual creation | `/app/data` Emblems tab |
| Battle Spells | `data/battle_spells.json` (12) + `aset_spell/` icons | — | Manual creation | `/app/data` Spells tab |
| Match Summaries | `data/matches.json` (100) | — | Manual import | SharedDataProvider (draft history) |
| MPL ID S17 Series | `data/mpl_id_s17_regular_season.json` (72/174) | — | Manual import | `/app/teams` |
| Live Matches | `data/liquipedia-live-hub-cache.json` | Liquipedia API live fetch | Auto-sync (900s interval) | `/app/live-matches` |
| Users | Neon PostgreSQL `users` | — | Auth flows (register/login/OAuth) | `/profile`, `/settings` |
| Hero Tournament Stats (Neon) | PostgreSQL `hero_tournament_stats` | SQLite `heroes` stats | Liquipedia apply-updates | `/app/heroes` (indirect) |
| Visitors | SQLite `visitors` | — | Heartbeat API | Landing page (online count) |
| Membership Plans | `src/data/membershipPlans.ts` | — | Static code | `/settings/membership` |
| Lane System | `src/data/lane_system.ts` | — | Static code | Draft engine (indirect) |
| Esports Assets | `src/data/esportsAssetOverrides.ts` | `regular_season_files/` | Static code | `/app/pro` team logos |
| Player Photos | `src/data/playerPhotoOverrides.ts` | Liquipedia auto-repair | Static code | `/app/pro` player photos |
