# Full Data Surface Audit

> Generated: 2026-07-23 | Scope: Complete project data inventory, coverage, and integration

## 1. Data Sources Found

### A. PostgreSQL (Neon)
- **Host**: Neon serverless PostgreSQL (connection via `DATABASE_URL`)
- **Tables**: `users`, `user_sessions`, `hero_tournament_stats`
- **Usage**: Auth sessions, user profiles, hero tournament stats upserted from Liquipedia

### B. SQLite (better-sqlite3)
- **File**: `data/mlbb_master.db` (+ 4MB WAL)
- **Tables** (9):
  - `heroes` — 132 heroes (seeded from heroes_master.json)
  - `tournaments` — Tournament metadata
  - `matches` — Match data with draft info
  - `draft_events` — Individual draft actions
  - `teams` — Team metadata
  - `meta_snapshots` — Meta tier snapshots
  - `scrape_log` — Scrape tracking
  - `ai_request_logs` — AI usage logging
  - `visitors` — Anonymous visitor tracking
- **Indexes**: 8 indexes on heroes, matches, draft_events, scrape_log, meta_snapshots, ai_logs, visitors

### C. JSON Files (Disk)
| Domain | File | Records |
|--------|------|---------|
| Heroes catalog | `data/heroes_master.json` | 132 |
| Hero details | `data/heroes/*.json` | 132 files |
| Hero tournament stats | `data/heroes_stats.json` | 84 |
| Hero advanced | `data/heroes_advanced.json` | 2 |
| Global rank meta | `data/global_rank_stats.json` | 132 |
| Pro players | `data/liquipedia/players.json` | 599 |
| Pro teams | `data/liquipedia/teams.json` | 343 |
| Player detail | `data/players_detail/butss.json` | 1 |
| Player photo targets | `data/player-photo-indonesia-targets.json` | 57 |
| Items | `data/items.json` | 103 |
| Emblems + Talents | `data/emblems.json` | 33 |
| Battle Spells | `data/battle_spells.json` | 12 |
| Match summaries | `data/matches.json` | 100 |
| Regular season matches | `data/regular_matches.json` | 72 |
| MPL ID S17 series | `data/mpl_id_s17_regular_season.json` | 72 series / 174 games |
| Live hub cache | `data/liquipedia-live-hub-cache.json` | 0 (empty) |
| Live hub settings | `data/liquipedia-live-hub-settings.json` | — |
| Live hub sources | `data/liquipedia-live-hub-sources.json` | 2 |
| Sync metadata | `data/liquipedia/sync-meta.json` | — |
| Rejected heroes | `data/rejected_heroes.json` | 2 |
| Photo sources | `data/player-photo-sources*.json` | 0 (empty) |
| Pro asset sources | `data/pro-player-asset-sources.json` | 0 (empty) |

### D. Static TypeScript Data
| File | Content |
|------|---------|
| `src/data/heroes_master.json` | Copy of heroes catalog (for Vite bundling) |
| `src/data/esportsAssetOverrides.ts` | Team logo asset overrides |
| `src/data/playerPhotoOverrides.ts` | Player photo URL overrides |
| `src/data/membershipPlans.ts` | Membership plan definitions |
| `src/data/lane_system.ts` | Lane system data |

### E. Assets (Images/Icons)
| Directory | Count | Size |
|-----------|-------|------|
| Hero portraits (`aset_hero/`) | 168 | 3.88 MB |
| Item icons (`aset_item/`) | 162 | 1.95 MB |
| Emblem icons (`aset_emblem/`) | 7 | 18 KB |
| Spell icons (`aset_spell/`) | 12 | 58 KB |
| Talent icons (`aset_talent/`) | 26 | 93 KB |
| Skill icons (`skill_icons/`) | 558 | 3.52 MB |
| Regular season assets | 139 | 26.61 MB |
| **Total** | **1,072** | **~36 MB** |

### F. SQL Migrations
- `scripts/migrate-users-table.sql`
- `scripts/migrate-profile-membership.sql`
- `scripts/migrate-profile-completed.sql`
- `scripts/migrate-local-auth.sql`
- `scripts/migrate-all-missing-columns.sql`

## 2. API Endpoints (42 total)

### Auth (7)
- `GET /auth/google`, `GET /auth/google/callback`
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- `POST /auth/complete-profile`

### Profile (3)
- `PATCH /api/profile`, `POST /api/profile/mlbb/disconnect`, `DELETE /auth/account`

### Hero Data (5)
- `GET /api/heroes`, `GET /api/heroes/advanced`, `GET /api/heroes/:id`
- `GET /api/hero-stats`, `GET /api/db/heroes`

### Match Data (5)
- `GET /api/matches`, `GET /api/history`
- `GET /api/team-analytics/:teamId/matches`, `GET /api/mpl/match-center`, `GET /api/mpl/team/:teamId/matches`

### Item/Asset (4)
- `GET /api/items`, `GET /api/emblems`, `GET /api/battle-spells`, `GET /api/assets`

### Team (3)
- `GET /api/team-stats`, `GET /api/draft/teams`, `GET /api/draft/team-intel/:teamId`

### Draft Engine (4)
- `POST /api/draft/recommendation`, `POST /api/draft/final-analysis`, `POST /api/draft/ai-recommend`
- `POST /api/draft/evaluate` (DEPRECATED — 410)

### AI Provider (6)
- `POST /api/ai/draft-analysis`, `POST /api/ai/recommendation-explain`, `POST /api/ai/deep-analysis`
- `GET /api/ai/test`, `GET /api/ai/providers/test`, `GET /api/ai/providers/benchmark`, `GET /api/ai/cache-stats`

### Liquipedia (5)
- `GET /api/liquipedia/status`, `GET /api/liquipedia/filters`
- `GET /api/liquipedia/players`, `GET /api/liquipedia/teams`, `GET /api/liquipedia/player-detail`

### Liquipedia Live Hub (4)
- `GET /api/liquipedia/live-hub`
- `GET /api/admin/liquipedia-live-hub`, `POST /api/admin/liquipedia-live-hub/sync`, `PUT /api/admin/liquipedia-live-hub/settings`

### Admin (3)
- `POST /api/admin/liquipedia/check-updates`, `POST /api/admin/liquipedia/apply-updates`
- `POST /api/scrape/liquipedia`

### Scraper (4)
- `GET /api/scraper/status`
- `POST /api/scraper/trigger/heroes`, `POST /api/scraper/trigger/hero/:heroId`, `POST /api/scraper/trigger/tournament-stats`

### MLBB Account (3)
- `POST /api/mlbb/check-account`, `POST /api/profile/mlbb/link`, `GET /api/mlbb/provider-health`

### Analytics (2)
- `POST /api/analytics/heartbeat`, `GET /api/analytics/visitors`

### Health (1)
- `GET /api/db/health`

## 3. Frontend Routes (40+)

### Public Routes
- `/` — Landing page
- `/login`, `/register`, `/complete-profile` — Auth

### App Routes (Guest Preview)
- `/app` — Dashboard
- `/app/draft` — Draft simulator (AI-powered)
- `/app/heroes` — Hero grid with stats
- `/app/hero-intelligence` — Deep hero analysis
- `/app/data` — Data Hub (Items/Emblems/Spells + Overview)
- `/app/live-matches` — Live esports tracker
- `/app/draft-planner` — Team draft planner
- `/app/counters` — Counter-pick matrix
- `/app/macro` — Macro map planner
- `/app/teams` — Team analytics
- `/app/meta` — Meta tier list
- `/app/pro` — **Pro Player/Team Database (599 players, 343 teams)**
- `/app/admin-tools` — Admin (protected)

### Community (Coming Soon)
- `/community`, `/community/chat`, `/community/lfs`, `/community/lft`, `/community/lfp`

### Events (Coming Soon)
- `/events/community-cup`, `/events/my-squad`, `/events/history`

### Services (Coming Soon)
- `/services/scrim`, `/services/room-tournament`, `/services/account-valuation`

### Profile (Protected)
- `/profile`, `/profile/matches`, `/profile/statistics`, `/profile/favorites`

### Settings (Protected)
- `/settings`, `/settings/account`, `/settings/profile`, `/settings/appearance`, `/settings/mlbb`, `/settings/membership`

## 4. Data Access Classification

### PUBLIC / PRODUCT DATA (safe for all users)
- Heroes (132), Hero Details (132), Hero Stats (84)
- Pro Players (599), Pro Teams (343)
- Items (103), Emblems (33), Battle Spells (12)
- Global Rank Meta (132)
- MPL Matches (72), Match Summaries (100)
- Live Matches (Liquipedia)
- All asset files (icons, portraits, logos)

### PERSONAL / AUTHENTICATED DATA
- User profile, MLBB account connection, Membership
- Saved drafts, Squad membership, Tournament registrations
- Personal uploads, Personal history

### ADMIN ONLY (not shown in public UI)
- Users management, AI request logs, Scrape logs
- Raw cache records, Data source secrets
- Application settings, Internal API health
- Authentication sessions, Audit logs

## 5. Critical Gaps Found & Fixed

### Gap 1: No sidebar link to Player Database
- **Before**: `/app/pro` route existed with full LiquipediaDatabase (599 players, 343 teams) but no sidebar link
- **Fix**: Added "Players" to ANALYSIS sidebar group with `User` icon, short label "Players"
- **File**: `src/components/navigation/AppSidebar.tsx`

### Gap 2: DataCatalog missing domain overview
- **Before**: DataCatalog only had 3 tabs (Items/Emblems/Spells) — no overview of all data domains
- **Fix**: Added "Data Hub" overview tab showing 10 domain cards with real counts, status badges, source files, and links
- **File**: `src/components/DataCatalog.tsx`

### Gap 3: No data source attribution
- **Before**: Users couldn't tell where data came from or how current it was
- **Fix**: Data Hub Overview shows source file for each domain, status badges (ready/partial), and data sources panel

## 6. Sidebar Before/After

### Before
```
NAVIGATE: Home, Draft, Heroes, Data, Live Matches, Draft Planner
ANALYSIS: Counters, Macro, Teams, Meta
COMMUNITY: Community Hub, Community Cup, My Squad, Tournament History
SERVICES: Scrim Services, Tournament Room, Account Valuation
```

### After
```
NAVIGATE: Home, Draft, Heroes, Data, Live Matches, Draft Planner
ANALYSIS: Players, Teams, Counters, Macro, Meta
COMMUNITY: Community Hub, Community Cup, My Squad, Tournament History
SERVICES: Scrim Services, Tournament Room, Account Valuation
```

## 7. Data Hub Before/After

### Before (3 tabs)
- Items | Emblems | Battle Spells

### After (4 tabs)
- Data Hub (overview) | Items | Emblems | Battle Spells

**Data Hub Overview** shows:
- 10 domain cards with real counts
- Status badges (ready/partial)
- Source file attribution
- Clickable links to detail pages
- Data Sources panel showing all 6 data sources

## 8. Database Diagnostics

### Active Database
- **Neon PostgreSQL**: Connected via `DATABASE_URL` env var (host redacted)
- **SQLite**: `data/mlbb_master.db` (164KB + 4MB WAL)

### Table Counts (SQLite, from `getDbHealth()`)
| Table | Status |
|-------|--------|
| heroes | Seeded (132) |
| tournaments | Exists |
| matches | Exists |
| draft_events | Exists |
| teams | Exists |
| meta_snapshots | Exists |
| scrape_log | Exists |
| ai_request_logs | Exists |
| visitors | Exists |

### No Destructive Changes Made
- No DROP TABLE, TRUNCATE, or DELETE operations
- No schema migrations needed
- No duplicate records created

## 9. Known Limitations

1. **Player detail enrichment**: Only 1 of 599 players has a detailed profile (`butss.json`). The LiquipediaDatabase component handles this gracefully with fallback to list data.
2. **Live match cache empty**: Liquipedia live hub cache is empty (API 404 for current event). The LiveMatchHub shows appropriate empty state.
3. **heroes_advanced.json**: Only 2 of 132 heroes have advanced data. HeroIntelligenceDashboard handles this gracefully.
4. **14 Coming Soon pages**: Community, Events, Services, and some Profile pages are placeholder UIs — expected for MVP.
5. **No standalone tournament page**: Tournament data exists in MPL JSON files but is consumed via TeamAnalytics, not a dedicated route.

## 10. Next Recommended Data Domains

1. **Player detail enrichment** — Scrape/fetch detailed profiles for top 50-100 active pro players
2. **Tournament standalone page** — Create `/app/tournaments` route consuming SQLite tournaments table
3. **Match standalone page** — Create `/app/matches` route with search/filter
4. **Team detail page** — Enhance `/app/teams` with individual team profiles from Liquipedia
5. **Meta snapshot history** — Surface SQLite `meta_snapshots` table in a timeline view
