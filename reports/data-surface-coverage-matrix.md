# Data Surface Coverage Matrix

> Generated: 2026-07-23 | Audit scope: Full project data inventory

## Coverage Matrix

| Data Domain | Source/Table/File | Record Count | API Endpoint | Frontend Route | UI Status | Access Level | Problem |
|-------------|-------------------|--------------|--------------|----------------|-----------|--------------|---------|
| **Heroes (catalog)** | `data/heroes_master.json` + `src/data/heroes_master.json` | 132 | `GET /api/heroes` | `/app/heroes` | FULLY SURFACED | PUBLIC | — |
| **Hero Details** | `data/heroes/*.json` (132 files) | 132 | `GET /api/heroes/:slug` | `/app/heroes` → hero detail | FULLY SURFACED | PUBLIC | — |
| **Hero Tournament Stats** | `data/heroes_stats.json` + SQLite `heroes` | 84 heroes | `GET /api/hero-stats` | `/app/heroes` (stats grid) | FULLY SURFACED | PUBLIC | — |
| **Hero Advanced Data** | `data/heroes_advanced.json` | 2 heroes only | `GET /api/heroes/advanced` | `/app/hero-intelligence` | PARTIALLY SURFACED | PUBLIC | Only 2 heroes have advanced data |
| **Global Rank Meta** | `data/global_rank_stats.json` | 132 heroes | `GET /api/global-rank-stats` | `/app/meta` | FULLY SURFACED | PUBLIC | — |
| **Pro Players** | `data/liquipedia/players.json` | 599 | `GET /api/liquipedia/players` | `/app/pro` (LiquipediaDatabase) | FULLY SURFACED | PUBLIC | **No sidebar link** to `/app/pro` |
| **Player Detail** | `data/players_detail/butss.json` | 1 | `GET /api/liquipedia/player-detail` | `/app/pro` (detail modal) | PARTIALLY SURFACED | PUBLIC | Only 1 player has detailed profile |
| **Player Photos** | `data/player-photo-indonesia-targets.json` | 57 targets | — (client-side) | `/app/pro` (photo overrides) | PARTIALLY SURFACED | PUBLIC | Empty photo sources arrays |
| **Pro Teams** | `data/liquipedia/teams.json` | 343 | `GET /api/liquipedia/teams` | `/app/pro` (Teams tab) | FULLY SURFACED | PUBLIC | **No standalone team route** |
| **Team Analytics** | `data/regular_matches.json` (computed) | 10 teams | `GET /api/team-stats` | `/app/teams` | FULLY SURFACED | PUBLIC | — |
| **Team Match History** | `data/regular_matches.json` | 72 matches | `GET /api/team-analytics/:id/matches` | `/app/teams` (detail) | FULLY SURFACED | PUBLIC | — |
| **MPL Teams (Draft)** | Static config + assets | 10 teams | `GET /api/draft/teams` | `/app/draft` | FULLY SURFACED | PUBLIC | — |
| **Team Intelligence** | Computed from match data | — | `GET /api/draft/team-intel/:id` | `/app/draft` | FULLY SURFACED | PUBLIC | — |
| **Items** | `data/items.json` + `aset_item/` | 103 | `GET /api/items` | `/app/data` (Items tab) | FULLY SURFACED | PUBLIC | — |
| **Emblems** | `data/emblems.json` + `aset_emblem/` | 33 (26 talents + 7 emblems) | `GET /api/emblems` | `/app/data` (Emblems tab) | FULLY SURFACED | PUBLIC | — |
| **Battle Spells** | `data/battle_spells.json` + `aset_spell/` | 12 | `GET /api/battle-spells` | `/app/data` (Spells tab) | FULLY SURFACED | PUBLIC | — |
| **MPL ID S17 Series** | `data/mpl_id_s17_regular_season.json` | 72 series, 174 games | `GET /api/matches` | `/app/teams` | FULLY SURFACED | PUBLIC | — |
| **Match Summaries** | `data/matches.json` | 100 | `GET /api/history` | SharedDataProvider (draft history) | PARTIALLY SURFACED | PUBLIC | Used for draft history, not standalone page |
| **Regular Season Matches** | `data/regular_matches.json` | 72 | `GET /api/matches` | `/app/teams` | FULLY SURFACED | PUBLIC | — |
| **Live Matches (Liquipedia)** | `data/liquipedia-live-hub-cache.json` | 0 (empty) | `GET /api/liquipedia/live-hub` | `/app/live-matches` | FULLY SURFACED | PUBLIC | Cache empty (API 404) |
| **Liquipedia Sync Meta** | `data/liquipedia/sync-meta.json` | — | `GET /api/liquipedia/status` | `/app/pro` (status bar) | FULLY SURFACED | PUBLIC | — |
| **Liquipedia Filters** | Computed from players/teams JSON | — | `GET /api/liquipedia/filters` | `/app/pro` (filter panel) | FULLY SURFACED | PUBLIC | — |
| **Skill Icons** | `public/raw-assets/skill_icons/` | 558 files | `GET /raw-assets/*` | Hero detail pages | FULLY SURFACED | PUBLIC | — |
| **Hero Portraits** | `aset_hero/` + `public/raw-assets/aset_hero/` | 168 files | `GET /raw-assets/*` | Hero grid, draft | FULLY SURFACED | PUBLIC | — |
| **Team Logos** | `regular_season_files/` | ~30 files | `GET /raw-assets/*` | Team analytics | FULLY SURFACED | PUBLIC | — |
| **Talent Icons** | `aset_talent/` + `public/raw-assets/aset_talent/` | 26 files | `GET /raw-assets/*` | Data catalog (emblems) | FULLY SURFACED | PUBLIC | — |
| **Macro Map** | `public/macro-map/mlbb-map.webp` | 1 | Static | `/app/macro` | FULLY SURFACED | PUBLIC | — |
| **SQLite Heroes** | `data/mlbb_master.db` → `heroes` | 132 | `GET /api/db/heroes` |间接 via `/api/heroes` | FULLY SURFACED | PUBLIC | — |
| **SQLite Tournaments** | `data/mlbb_master.db` → `tournaments` | TBD | — (no dedicated endpoint) | **NO UI** | DATA EXISTS — NO UI | PUBLIC | Table exists but no standalone endpoint/route |
| **SQLite Matches** | `data/mlbb_master.db` → `matches` | TBD | — (no dedicated endpoint) | **NO UI** | DATA EXISTS — NO UI | PUBLIC | Table exists but no standalone endpoint/route |
| **SQLite Draft Events** | `data/mlbb_master.db` → `draft_events` | TBD | — | **NO UI** | DATA EXISTS — NO UI | PUBLIC | Used internally by draft engine |
| **SQLite Teams** | `data/mlbb_master.db` → `teams` | TBD | — | **NO UI** | DATA EXISTS — NO UI | PUBLIC | Separate from Liquipedia teams |
| **SQLite Meta Snapshots** | `data/mlbb_master.db` → `meta_snapshots` | TBD | — | **NO UI** | DATA EXISTS — NO UI | PUBLIC | — |
| **SQLite Scrape Log** | `data/mlbb_master.db` → `scrape_log` | TBD | `GET /api/scraper/status` | `/app/admin-tools` (indirect) | ADMIN ONLY | ADMIN | — |
| **SQLite AI Request Logs** | `data/mlbb_master.db` → `ai_request_logs` | TBD | `GET /api/ai/cache-stats` | `/app/admin-tools` (indirect) | ADMIN ONLY | ADMIN | — |
| **SQLite Visitors** | `data/mlbb_master.db` → `visitors` | TBD | `GET /api/analytics/visitors` | Landing page (online count) | FULLY SURFACED | PUBLIC | — |
| **Neon Users** | PostgreSQL `users` | TBD | `GET /auth/me` | Profile, Settings | FULLY SURFACED | PERSONAL | — |
| **Neon Sessions** | PostgreSQL `user_sessions` | TBD | — | Auth (internal) | ADMIN ONLY | ADMIN | — |
| **Neon Hero Tournament Stats** | PostgreSQL `hero_tournament_stats` | TBD |间接 via `/api/hero-stats` | `/app/heroes` | FULLY SURFACED | PUBLIC | — |
| **Membership Plans** | `src/data/membershipPlans.ts` | 3 plans | — (static) | `/settings/membership` | FULLY SURFACED | PERSONAL | — |
| **Lane System** | `src/data/lane_system.ts` | — | — (static) |间接 via draft | PARTIALLY SURFACED | PUBLIC | Used internally, no dedicated UI |
| **Esports Asset Overrides** | `src/data/esportsAssetOverrides.ts` | ~20 overrides | — (static) | `/app/pro` (team logos) | FULLY SURFACED | PUBLIC | — |
| **Player Photo Overrides** | `src/data/playerPhotoOverrides.ts` | ~5 overrides | — (static) | `/app/pro` (player photos) | FULLY SURFACED | PUBLIC | — |
| **Rejected Heroes** | `data/rejected_heroes.json` | 2 | — | **NO UI** | DEPRECATED | ADMIN | Exclusion list |
| **Photo Source Files** | `data/player-photo-sources*.json`, `data/pro-player-asset-sources.json` | 0 (empty) | — | **NO UI** | EMPTY TABLE | — | Placeholder files |
| **Liquipedia Live Hub Settings** | `data/liquipedia-live-hub-settings.json` | — | `GET /api/admin/liquipedia-live-hub` | Admin only | ADMIN ONLY | ADMIN | — |
| **Liquipedia Live Hub Sources** | `data/liquipedia-live-hub-sources.json` | 2 sources | — | Admin only | ADMIN ONLY | ADMIN | — |
| **Firebase Blueprint** | `firebase-blueprint.json` | — | — | **NO UI** | DEPRECATED | — | DraftSave schema, not in use |
| **SQL Migrations** | `scripts/migrate-*.sql` | 5 files | — | **NO UI** | DEPRECATED | ADMIN | Historical migrations |
| **Archive Backups** | `archive/backups/` | ~276 files | — | **NO UI** | DEPRECATED | ADMIN | Historical backup |

## Summary Statistics

| Category | Count |
|----------|-------|
| Total data domains audited | 42 |
| FULLY SURFACED | 24 |
| PARTIALLY SURFACED | 4 |
| DATA EXISTS — NO UI | 4 |
| ADMIN ONLY | 5 |
| DEPRECATED | 4 |
| EMPTY TABLE | 1 |

## Critical Gaps Found

1. **No sidebar link to `/app/pro`** — 599 players + 343 teams exist but users can't discover the route
2. **DataCatalog missing domains** — Only Items/Emblems/Spells shown; Heroes, Players, Teams, Matches, Meta not in Data Hub
3. **SQLite tournaments/matches tables** — Have data but no standalone API endpoint or UI page
4. **Player detail enrichment** — Only 1 of 599 players has a detailed profile file
5. **Live match cache empty** — Liquipedia live hub cache is empty (API 404)
6. **heroes_advanced.json** — Only 2 of 132 heroes have advanced data
